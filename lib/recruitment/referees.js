import crypto from "crypto";
import { query } from "./db";
import { ensureSchema } from "./schema";

/**
 * The reference loop. RECRUITMENT-SPEC.md Phase 4.
 *
 * "This is the part most likely to go wrong. Build it carefully."
 *
 * TOKENS. crypto.randomBytes(32), only the SHA-256 hash stored, 30-day expiry,
 * single use. A leak of the referees table therefore hands nobody a working
 * link into a reference form — which matters, because those forms carry
 * safeguarding answers about a named person.
 *
 * The token IS the authentication. There is no login, deliberately: a ward
 * manager giving a reference between shifts will not create an account, and a
 * reference nobody completes is worse than no security theatre.
 */

export const TOKEN_DAYS = 30;
export const REMINDER_DAYS = [5, 10]; // then stop, per the spec

const sha256 = (v) => crypto.createHash("sha256").update(String(v)).digest("hex");

const parse = (row) => {
  if (!row) return null;
  let details = {};
  let response = null;
  try { details = JSON.parse(row.details || "{}"); } catch { details = {}; }
  try { response = row.response ? JSON.parse(row.response) : null; } catch { response = null; }
  return { ...row, details, response };
};

/**
 * Create the three referee rows for a submitted application and issue a token
 * for each. Returns the rows WITH their raw tokens, which the caller emails
 * and then discards — the raw token is never stored or logged.
 */
export async function createRefereesForApplication(application) {
  await ensureSchema();
  const list = application.answers?.referees || [];
  const out = [];

  let professionalCount = 0;
  for (const r of list) {
    const kind = r.kind === "character" ? "character" : "professional";
    if (kind === "professional") professionalCount += 1;

    const raw = crypto.randomBytes(32).toString("base64url");
    const id = crypto.randomUUID();
    const expires = new Date(Date.now() + TOKEN_DAYS * 24 * 60 * 60 * 1000);

    await query(
      `INSERT INTO referees
         (id, application_id, kind, position, name, email, organisation, job_title, phone,
          details, token_hash, expires_at, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'pending')`,
      [
        id,
        application.id,
        kind,
        kind === "professional" ? professionalCount : 1,
        String(r.name || "").trim(),
        String(r.email || "").trim().toLowerCase(),
        String(r.organisation || "").trim(),
        String(r.jobTitle || "").trim(),
        String(r.phone || "").trim(),
        JSON.stringify({
          relationship: r.relationship || "",
          datesWorkedTogether: r.datesWorkedTogether || "",
          howKnown: r.howKnown || "",
          howLongKnown: r.howLongKnown || "",
        }),
        sha256(raw),
        expires,
      ],
    );

    out.push({ id, kind, position: kind === "professional" ? professionalCount : 1, name: r.name, email: r.email, token: raw, expiresAt: expires });
  }
  return out;
}

/**
 * Exchange a token for the referee and their application.
 *
 * Returns null for unknown, expired, already-used and already-completed alike.
 * Someone probing tokens learns nothing from the difference.
 */
export async function resolveRefereeToken(token) {
  await ensureSchema();
  if (!token) return null;

  const { rows } = await query(
    `SELECT r.*, a.reference AS application_reference, a.answers AS application_answers
       FROM referees r
       JOIN applications a ON a.id = r.application_id
      WHERE r.token_hash = $1`,
    [sha256(token)],
  );
  if (!rows.length) return null;

  const row = rows[0];
  if (row.used_at) return null;
  if (row.status === "completed" || row.status === "declined") return null;
  if (row.expires_at && new Date(row.expires_at) < new Date()) return null;

  let applicantAnswers = {};
  try { applicantAnswers = JSON.parse(row.application_answers || "{}"); } catch { applicantAnswers = {}; }

  return {
    referee: parse(row),
    applicationReference: row.application_reference,
    // Only what the referee legitimately needs to answer: who they are being
    // asked about and for what. Never the applicant's whole application.
    applicant: {
      fullName: applicantAnswers.fullName || "",
      role: applicantAnswers.role || "",
      jobs: applicantAnswers.jobs || [],
    },
  };
}

/**
 * Record a completed reference and burn the token.
 *
 * `flagged` is computed here rather than trusted from the client, because it
 * drives the subject line that stops a safeguarding disclosure being missed in
 * a busy inbox.
 *
 * The expiry check is repeated in the WHERE clause even though the route calls
 * resolveRefereeToken() first. Defence in depth: this function must be safe on
 * its own, because the next caller may not remember to resolve first. Found by
 * Phase 7 pass 8 — before this, an expired token could still be completed if
 * the resolve step was skipped.
 */
export async function completeReference(token, response) {
  await ensureSchema();
  const hash = sha256(token);

  const flagged =
    response?.safeguardingConcerns === "Yes" ||
    response?.wouldReEmploy === "No" ||
    response?.anyReasonNotToWork === "Yes";

  const { rows } = await query(
    `UPDATE referees
        SET status = 'completed',
            response = $1,
            flagged = $2,
            completed_at = NOW(),
            used_at = NOW(),
            token_hash = NULL
      WHERE token_hash = $3
        AND used_at IS NULL
        AND status = 'pending'
        AND expires_at > NOW()
      RETURNING *`,
    [JSON.stringify(response || {}), flagged, hash],
  );

  // token_hash is nulled above, so the link cannot be replayed even before
  // expiry. An empty result means it was already used - a double submit.
  return rows.length ? parse(rows[0]) : null;
}

/** A referee declining is a legitimate outcome, not a failure. */
export async function declineReference(token, reason = "") {
  await ensureSchema();
  const { rows } = await query(
    `UPDATE referees
        SET status='declined', declined_at=NOW(), used_at=NOW(), token_hash=NULL,
            response=$1
      WHERE token_hash=$2 AND used_at IS NULL AND expires_at > NOW()
      RETURNING *`,
    [JSON.stringify({ declined: true, reason: String(reason).slice(0, 1000) }), sha256(token)],
  );
  return rows.length ? parse(rows[0]) : null;
}

export async function getRefereesForApplication(applicationId) {
  await ensureSchema();
  const { rows } = await query(
    `SELECT * FROM referees WHERE application_id=$1 ORDER BY kind DESC, position ASC`,
    [applicationId],
  );
  return rows.map(parse);
}

/** True once every referee has responded one way or the other. */
export async function allReferencesIn(applicationId) {
  const list = await getRefereesForApplication(applicationId);
  return list.length > 0 && list.every((r) => r.status === "completed" || r.status === "declined");
}

/**
 * Referees who are overdue a reminder.
 *
 * Two reminders only — at 5 and 10 days — then stop. Chasing a busy ward
 * manager a third time does not produce a reference, it produces a spam
 * complaint.
 */
export async function refereesNeedingReminder(now = new Date()) {
  await ensureSchema();
  const { rows } = await query(
    `SELECT r.*, a.reference AS application_reference, a.answers AS application_answers
       FROM referees r
       JOIN applications a ON a.id = r.application_id
      WHERE r.status = 'pending'
        AND r.reminders_sent < $1
        AND r.expires_at > $2`,
    [REMINDER_DAYS.length, now],
  );

  const due = [];
  for (const row of rows) {
    const days = (now - new Date(row.requested_at)) / (24 * 60 * 60 * 1000);
    const threshold = REMINDER_DAYS[row.reminders_sent];
    if (days >= threshold) due.push(parse(row));
  }
  return due;
}

export async function markReminderSent(refereeId) {
  await query(
    `UPDATE referees SET reminders_sent = reminders_sent + 1, last_reminder_at = NOW() WHERE id = $1`,
    [refereeId],
  );
}

/** For the weekly digest and the status page. */
export async function applicationsAwaitingReferences() {
  await ensureSchema();
  const { rows } = await query(
    `SELECT a.id, a.reference, a.submitted_at, a.answers,
            COUNT(r.id)                                            AS total,
            COUNT(*) FILTER (WHERE r.status = 'completed')          AS completed,
            COUNT(*) FILTER (WHERE r.status = 'declined')           AS declined,
            COUNT(*) FILTER (WHERE r.status = 'pending')            AS pending,
            BOOL_OR(r.flagged)                                      AS any_flagged,
            MIN(r.requested_at)                                     AS first_requested
       FROM applications a
       JOIN referees r ON r.application_id = a.id
      WHERE a.status = 'submitted'
      GROUP BY a.id, a.reference, a.submitted_at, a.answers
      ORDER BY a.submitted_at DESC`,
  );
  return rows.map((r) => {
    let answers = {};
    try { answers = JSON.parse(r.answers || "{}"); } catch { answers = {}; }
    return {
      id: r.id,
      reference: r.reference,
      submittedAt: r.submitted_at,
      applicantName: answers.fullName || "",
      role: answers.role || "",
      total: Number(r.total),
      completed: Number(r.completed),
      declined: Number(r.declined),
      pending: Number(r.pending),
      anyFlagged: Boolean(r.any_flagged),
      waitingDays: r.first_requested
        ? Math.floor((Date.now() - new Date(r.first_requested)) / (24 * 60 * 60 * 1000))
        : 0,
    };
  });
}
