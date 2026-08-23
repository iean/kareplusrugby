import { NextResponse } from "next/server";
import {
  resolveRefereeToken,
  completeReference,
  declineReference,
  getRefereesForApplication,
  allReferencesIn,
} from "@lib/recruitment/referees";
import { getApplication } from "@lib/recruitment/store";
import { buildReferencePdf } from "@lib/recruitment/referencePdf";
import { sendCompletedReference, sendReferenceSetComplete } from "@lib/recruitment/referenceEmails";
import { isMailConfigured } from "@lib/mailer";
import { rateLimit } from "@lib/rateLimit";

export const runtime = "nodejs";

/**
 * A referee submitting or declining. RECRUITMENT-SPEC.md Phase 4.
 *
 * Order on submission, per the spec:
 *   1. save, mark completed, timestamp
 *   2. generate a PDF of that reference
 *   3. email it to the recruitment inbox, subject naming the applicant and
 *      which reference it is
 *   4. invalidate the token — one use only
 *   5. flag safeguarding / would-not-re-employ in the SUBJECT LINE
 *   6. when all three are in, send a completion summary with all three PDFs
 *
 * Steps 1 and 4 happen together in completeReference(), which nulls the token
 * hash in the same UPDATE that records the answers. That makes the write
 * atomic: a referee who double-taps cannot produce two references, and a
 * failure in the email steps afterwards cannot leave a token live.
 *
 * As with the application, the reference is SAVED FIRST and the emails are
 * best-effort. A referee must never be asked to fill this in twice because an
 * SMTP server was briefly unreachable — they will not do it.
 */
export async function POST(req) {
  const limit = rateLimit(req, { max: 20, windowMs: 60 * 60 * 1000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a moment, or call us." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const token = String(body.token || "");
  if (!token) return NextResponse.json({ error: "Missing link." }, { status: 400 });

  // Resolve first so we can build the email afterwards; resolve returns null
  // for unknown, expired, used and completed alike.
  const resolved = await resolveRefereeToken(token);
  if (!resolved) {
    return NextResponse.json(
      {
        error:
          "This link is no longer valid. It may have been used already or expired. Please call us and we will send a fresh one.",
      },
      { status: 410 },
    );
  }

  /* ---------------- declining ---------------- */
  if (body.decline) {
    const declined = await declineReference(token, String(body.reason || "").slice(0, 1000));
    if (!declined) {
      return NextResponse.json({ error: "This link is no longer valid." }, { status: 410 });
    }
    console.info(`[reference] declined for ${resolved.applicationReference}`);
    return NextResponse.json({ ok: true, declined: true });
  }

  /* ---------------- server-side validation ---------------- */
  const r = body.response && typeof body.response === "object" ? body.response : {};
  const isCharacter = resolved.referee.kind === "character";
  const errors = {};

  if (isCharacter) {
    if (!r.howLongKnown?.trim()) errors.howLongKnown = "Required.";
    if (!r.capacity?.trim()) errors.capacity = "Required.";
    if (r.notFamily !== true) errors.notFamily = "Required.";
    if (!["Yes", "No"].includes(r.anyReasonNotToWork)) errors.anyReasonNotToWork = "Required.";
    if (r.anyReasonNotToWork === "Yes" && String(r.anyReasonDetail || "").trim().length < 5)
      errors.anyReasonDetail = "Please tell us what the concern is.";
  } else {
    if (!r.detailsMatch) errors.detailsMatch = "Required.";
    if (!["Yes", "No", "With reservations"].includes(r.wouldReEmploy)) errors.wouldReEmploy = "Required.";
    if (!r.reliability) errors.reliability = "Required.";
    if (!["Yes", "No"].includes(r.safeguardingConcerns)) errors.safeguardingConcerns = "Required.";
    if (r.safeguardingConcerns === "Yes" && String(r.safeguardingDetail || "").trim().length < 5)
      errors.safeguardingDetail = "Please tell us what the concern is.";
    if (!r.refereeJobTitle?.trim()) errors.refereeJobTitle = "Required.";
    if (r.authorised !== true) errors.authorised = "Required.";
  }

  // Length ceilings so a client cannot post megabytes into a PDF.
  for (const [k, max] of [
    ["safeguardingDetail", 5000], ["anyReasonDetail", 5000], ["comments", 5000],
    ["suitability", 5000], ["reliabilityComment", 2000], ["jobTitle", 200],
    ["employmentDates", 200], ["reasonForLeaving", 1000], ["refereeJobTitle", 200],
    ["howLongKnown", 200], ["capacity", 500],
  ]) {
    if (String(r[k] || "").length > max) errors[k] = "That answer is too long.";
  }

  if (Object.keys(errors).length) {
    return NextResponse.json({ error: "Please check the form.", fields: errors }, { status: 400 });
  }

  /* ---------------- STEP 1 + 4: save and burn the token ---------------- */
  const saved = await completeReference(token, r);
  if (!saved) {
    // Lost a race with a double submit.
    return NextResponse.json({ ok: true, alreadySubmitted: true });
  }

  const application = await getApplication(saved.application_id);
  const applicant = {
    fullName: application?.answers?.fullName || "",
    role: application?.answers?.role || "",
  };

  const problems = [];

  /* ---------------- STEP 2 + 3 + 5 ---------------- */
  let pdf = null;
  try {
    pdf = await buildReferencePdf({
      referee: saved,
      applicant,
      applicationReference: resolved.applicationReference,
    });
  } catch (err) {
    console.error(`[reference] PDF failed for ${resolved.applicationReference}: ${err.message}`);
    problems.push("pdf");
  }

  if (isMailConfigured() && pdf) {
    try {
      await sendCompletedReference({
        referee: saved,
        applicant,
        applicationReference: resolved.applicationReference,
        pdf,
      });
    } catch (err) {
      console.error(`[reference] office email failed: ${err.message}`);
      problems.push("office-email");
    }
  } else if (!isMailConfigured()) {
    console.error(`[reference] ${resolved.applicationReference} SAVED but no mail transport configured`);
    problems.push("no-mail-transport");
  }

  /* ---------------- STEP 6: all three in ---------------- */
  try {
    if (await allReferencesIn(saved.application_id)) {
      const all = await getRefereesForApplication(saved.application_id);
      const pdfs = [];
      for (const ref of all.filter((x) => x.status === "completed")) {
        try {
          const p = await buildReferencePdf({
            referee: ref,
            applicant,
            applicationReference: resolved.applicationReference,
          });
          pdfs.push({
            filename: `reference-${resolved.applicationReference}-${ref.kind}-${ref.position}.pdf`,
            content: p,
          });
        } catch {
          /* one bad PDF must not stop the summary */
        }
      }
      if (isMailConfigured()) {
        await sendReferenceSetComplete({
          applicant,
          applicationReference: resolved.applicationReference,
          referees: all,
          pdfs,
        });
      }
    }
  } catch (err) {
    console.error(`[reference] completion summary failed: ${err.message}`);
    problems.push("summary-email");
  }

  console.info(
    `[reference] completed ${resolved.applicationReference} kind=${saved.kind} flagged=${saved.flagged}`,
  );

  return NextResponse.json({ ok: true, flagged: saved.flagged, problems });
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
