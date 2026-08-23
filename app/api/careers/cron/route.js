import { NextResponse } from "next/server";
import crypto from "crypto";
import {
  refereesNeedingReminder,
  markReminderSent,
  applicationsAwaitingReferences,
  REMINDER_DAYS,
} from "@lib/recruitment/referees";
import { sendReferenceReminder, sendWeeklyDigest } from "@lib/recruitment/referenceEmails";
import { deleteExpiredApplications } from "@lib/recruitment/store";
import { isMailConfigured } from "@lib/mailer";
import { query } from "@lib/recruitment/db";
import { ensureSchema } from "@lib/recruitment/schema";

export const runtime = "nodejs";

/**
 * Scheduled jobs for the recruitment system.
 *
 *   ?job=chase     referee reminders at 5 and 10 days, then stop
 *   ?job=digest    weekly summary of applications waiting on references
 *   ?job=retention delete applications past their retention date
 *
 * WHY A ROUTE AND NOT CRON. RECRUITMENT-SPEC.md assumed a VPS with real cron.
 * On Vercel the equivalent is Vercel Cron, which calls an HTTPS endpoint on a
 * schedule — so the job lives here and vercel.json points at it.
 *
 * AUTHENTICATION. Vercel Cron sends a bearer token in CRON_SECRET. Without a
 * secret set this refuses to run rather than defaulting to open: an unguarded
 * endpoint that emails referees is a way to spam people, and the retention job
 * deletes data.
 *
 * REMINDERS CANNOT DOUBLE-SEND. markReminderSent() is called before the email,
 * not after. If the send then fails, the referee misses one reminder — which
 * is recoverable. If it were the other way round, a transient SMTP error on a
 * job that runs daily would email the same busy ward manager every day until
 * it succeeded, which is how a domain gets reported as spam.
 */

function authorised(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false; // fail closed

  const header = req.headers.get("authorization") || "";
  const supplied = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (supplied.length !== secret.length) return false;

  return crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(secret));
}

async function chase() {
  const due = await refereesNeedingReminder();
  const results = { considered: due.length, sent: 0, failed: 0, skipped: 0 };

  for (const ref of due) {
    let answers = {};
    try { answers = JSON.parse(ref.application_answers || "{}"); } catch { answers = {}; }

    // The raw token is not recoverable - only its hash is stored - so a
    // reminder re-uses the SAME link by issuing nothing new. We cannot rebuild
    // the URL, so the reminder has to carry a freshly minted token.
    const raw = crypto.randomBytes(32).toString("base64url");
    const hash = crypto.createHash("sha256").update(raw).digest("hex");
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Rotate the token with the reminder. The old link stops working, which is
    // the right trade: a referee acting on the newest email is the common case,
    // and a rotated token limits how long any single link stays live.
    await query(
      `UPDATE referees SET token_hash = $1, expires_at = $2 WHERE id = $3 AND used_at IS NULL`,
      [hash, expires, ref.id],
    );

    // Counted before sending - see the note above.
    await markReminderSent(ref.id);

    if (!isMailConfigured()) { results.skipped += 1; continue; }

    try {
      await sendReferenceReminder({
        referee: ref,
        applicantName: answers.fullName || "an applicant",
        role: answers.role || "",
        token: raw,
        reminderNumber: ref.reminders_sent + 1,
      });
      results.sent += 1;
    } catch (err) {
      console.error(`[cron:chase] reminder failed for referee ${ref.id}: ${err.message}`);
      results.failed += 1;
    }
  }
  return results;
}

async function digest() {
  const rows = await applicationsAwaitingReferences();
  const outstanding = rows.filter((r) => r.pending > 0);
  if (!isMailConfigured()) return { outstanding: outstanding.length, sent: false, reason: "no mail transport" };
  await sendWeeklyDigest(outstanding);
  return { outstanding: outstanding.length, sent: true };
}

async function retention() {
  const deleted = await deleteExpiredApplications();
  if (deleted.length) {
    // References cascade with the application row. Log the count and the
    // references only - never the applicants' details.
    console.info(`[cron:retention] deleted ${deleted.length}: ${deleted.map((d) => d.reference).join(", ")}`);
  }
  return { deleted: deleted.length, references: deleted.map((d) => d.reference) };
}

export async function GET(req) {
  if (!authorised(req)) {
    return new NextResponse("Unauthorised.", { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  await ensureSchema();
  const job = new URL(req.url).searchParams.get("job");

  try {
    if (job === "chase") return NextResponse.json({ job, ...(await chase()) });
    if (job === "digest") return NextResponse.json({ job, ...(await digest()) });
    if (job === "retention") return NextResponse.json({ job, ...(await retention()) });
  } catch (err) {
    console.error(`[cron:${job}] failed: ${err.message}`);
    return NextResponse.json({ job, error: err.message }, { status: 500 });
  }

  return NextResponse.json(
    { error: "Unknown job.", valid: ["chase", "digest", "retention"], reminderDays: REMINDER_DAYS },
    { status: 400 },
  );
}
