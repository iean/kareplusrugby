import crypto from "crypto";
import { query } from "./db";
import { ensureSchema, retentionDate } from "./schema";

/**
 * Reading and writing applications.
 *
 * Save-and-resume is mandatory per RECRUITMENT-SPEC.md: this form is long and
 * most applicants are on a phone, so progress is written server-side after
 * every step. Losing a half-finished application loses the candidate.
 *
 * TOKENS. Only a SHA-256 hash of a resume token is stored. A leak of the
 * database therefore does not hand anyone a working link into someone's
 * half-finished application, which would expose their employment history and
 * their referees' contact details.
 */

const RESUME_TOKEN_DAYS = 30;

const sha256 = (v) => crypto.createHash("sha256").update(v).digest("hex");

/** A short, human-quotable reference. Avoids look-alike characters. */
function newReference() {
  const alphabet = "ACDEFGHJKLMNPQRTUVWXY34679";
  let out = "";
  const bytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) out += alphabet[bytes[i] % alphabet.length];
  return `KPR-${out.slice(0, 3)}-${out.slice(3)}`;
}

const newId = () => crypto.randomUUID();

const normEmail = (e) => String(e || "").trim().toLowerCase();

/**
 * Find the applicant's open draft, or start one.
 *
 * Keyed to email, as the spec requires. A submitted application is never
 * reopened — coming back after submitting starts a fresh draft rather than
 * silently editing something already sent to the recruitment inbox.
 */
export async function getOrCreateDraft(email) {
  await ensureSchema();
  const e = normEmail(email);

  const existing = await query(
    `SELECT * FROM applications
      WHERE email = $1 AND status = 'draft'
      ORDER BY updated_at DESC LIMIT 1`,
    [e],
  );
  if (existing.rows.length) return hydrate(existing.rows[0]);

  const id = newId();
  const { rows } = await query(
    `INSERT INTO applications (id, reference, email, status, delete_after)
     VALUES ($1, $2, $3, 'draft', $4) RETURNING *`,
    [id, newReference(), e, retentionDate()],
  );
  return hydrate(rows[0]);
}

function hydrate(row) {
  let answers = {};
  try {
    answers = JSON.parse(row.answers || "{}");
  } catch {
    answers = {};
  }
  return { ...row, answers };
}

export async function getApplication(id) {
  await ensureSchema();
  const { rows } = await query(`SELECT * FROM applications WHERE id = $1`, [id]);
  return rows.length ? hydrate(rows[0]) : null;
}

/**
 * Merge one step's answers into the draft.
 *
 * Merges rather than replaces, so a step posting only its own fields can never
 * wipe the rest of the application.
 */
export async function saveStep(id, step, stepAnswers) {
  await ensureSchema();
  const current = await getApplication(id);
  if (!current) throw new Error("Application not found");
  if (current.status !== "draft") throw new Error("This application has already been submitted");

  const merged = { ...current.answers, ...stepAnswers };

  const { rows } = await query(
    `UPDATE applications
        SET answers = $1,
            current_step = GREATEST(current_step, $2),
            updated_at = NOW()
      WHERE id = $3
      RETURNING *`,
    [JSON.stringify(merged), Number(step) || 0, id],
  );
  return hydrate(rows[0]);
}

/**
 * Issue a resume link token.
 *
 * Returns the RAW token, which is emailed and never stored. Any previously
 * issued token for the application is revoked, so the newest link is the only
 * one that works.
 */
export async function issueResumeToken(applicationId) {
  await ensureSchema();
  const raw = crypto.randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + RESUME_TOKEN_DAYS * 24 * 60 * 60 * 1000);

  await query(`DELETE FROM resume_tokens WHERE application_id = $1`, [applicationId]);
  await query(
    `INSERT INTO resume_tokens (token_hash, application_id, expires_at)
     VALUES ($1, $2, $3)`,
    [sha256(raw), applicationId, expires],
  );
  return { token: raw, expiresAt: expires };
}

/**
 * Exchange a resume token for its application.
 *
 * Returns null for unknown, expired or already-submitted applications rather
 * than distinguishing between them — an attacker probing tokens learns nothing
 * from the difference.
 */
export async function resolveResumeToken(token) {
  await ensureSchema();
  if (!token) return null;

  const { rows } = await query(
    `SELECT t.application_id, t.expires_at
       FROM resume_tokens t
      WHERE t.token_hash = $1`,
    [sha256(String(token))],
  );
  if (!rows.length) return null;
  if (new Date(rows[0].expires_at) < new Date()) return null;

  const app = await getApplication(rows[0].application_id);
  if (!app || app.status !== "draft") return null;

  await query(`UPDATE resume_tokens SET used_at = NOW() WHERE token_hash = $1`, [
    sha256(String(token)),
  ]);
  return app;
}

/**
 * Delete applications past their retention date.
 *
 * Built alongside the storage, not bolted on later, as the spec requires.
 * ON DELETE CASCADE removes the resume tokens and file rows with them; the
 * objects themselves are removed by the caller, which knows about storage.
 */
export async function deleteExpiredApplications(now = new Date()) {
  await ensureSchema();
  const { rows } = await query(
    `DELETE FROM applications
      WHERE delete_after < $1
        AND status <> 'hired'
      RETURNING id, reference`,
    [now],
  );
  return rows;
}

/** Delete one application outright, for a data deletion request. */
export async function deleteApplicationByReference(reference, email) {
  await ensureSchema();
  const { rows } = await query(
    `DELETE FROM applications
      WHERE reference = $1 AND email = $2
      RETURNING id, reference`,
    [String(reference).trim().toUpperCase(), normEmail(email)],
  );
  return rows;
}
