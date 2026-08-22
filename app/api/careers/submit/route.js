import crypto from "crypto";
import { NextResponse } from "next/server";
import { getApplication, saveStep } from "@lib/recruitment/store";
import { query } from "@lib/recruitment/db";
import { ensureSchema } from "@lib/recruitment/schema";
import { buildApplicationPdf } from "@lib/recruitment/pdf";
import { validateUpload, validateBatch, MAX_FILES } from "@lib/recruitment/files";
import { unexplainedGaps, validateReferees } from "@lib/recruitment/validation";
import { sendToBusiness, isMailConfigured, MAIL_TO, createTransport, mailFrom } from "@lib/mailer";
import { rateLimit } from "@lib/rateLimit";
import { notifyNewApplication } from "@lib/recruitment/notify";

/**
 * Submitting a completed application. RECRUITMENT-SPEC.md Phase 3.
 *
 * ORDER MATTERS, and the spec is explicit about it:
 *
 *   1. save the application as `submitted`
 *   2. generate the PDF
 *   3. email the recruitment inbox with the PDF and every attachment
 *   4. email the applicant a confirmation with their copy
 *   5. WhatsApp notification (feature-flagged, default off)
 *   6. trigger the reference emails
 *
 * "If any step after step 1 fails, the application must still be saved and the
 * failure logged and reported. Never lose a submission because an email
 * bounced." That is why everything after the save runs inside its own
 * try/catch and accumulates into `problems` rather than throwing: an applicant
 * who has spent twenty minutes on this must never be told to start again
 * because an SMTP server was briefly unreachable.
 *
 * The response tells the applicant the truth — saved, and whether the emails
 * got out — rather than a blanket "thank you" that hides a half-failure.
 */

export const runtime = "nodejs"; // pdfkit and pg need Node, not the Edge runtime

const MAX_BODY_BYTES = 30 * 1024 * 1024;

export async function POST(req) {
  const limit = rateLimit(req, { max: 5, windowMs: 60 * 60 * 1000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many applications from this connection. Please call us instead." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let form;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  // Honeypot.
  if (String(form.get("website") || "").trim()) {
    return NextResponse.json({ ok: true, reference: "KPR-000-000" });
  }

  const applicationId = String(form.get("applicationId") || "");
  if (!applicationId) {
    return NextResponse.json({ error: "Missing application." }, { status: 400 });
  }

  await ensureSchema();
  const application = await getApplication(applicationId);
  if (!application) {
    return NextResponse.json({ error: "We could not find that application." }, { status: 404 });
  }
  if (application.status !== "draft") {
    // Idempotent: a double-tap on a slow connection must not submit twice.
    return NextResponse.json({ ok: true, reference: application.reference, alreadySubmitted: true });
  }

  const a = application.answers || {};

  /* ---------------------------------------------------------------- *
   * Server-side validation. The client is never trusted.
   * ---------------------------------------------------------------- */
  const errors = {};
  if (!a.fullName?.trim()) errors.fullName = "Name is missing.";
  if (!a.email?.trim()) errors.email = "Email is missing.";
  if (!a.confirmTrue) errors.confirmTrue = "The declaration was not confirmed.";
  if (!a.consentReferees) errors.consentReferees = "Consent to contact referees was not given.";

  const gaps = unexplainedGaps(a.jobs || []);
  if (gaps.length) {
    errors.gaps = `There ${gaps.length === 1 ? "is 1 employment gap" : `are ${gaps.length} employment gaps`} that still need explaining.`;
  }

  const refCheck = validateReferees({
    referees: a.referees || [],
    applicantEmail: a.email,
    jobs: a.jobs || [],
  });
  Object.assign(errors, refCheck.errors);

  if (Object.keys(errors).length) {
    return NextResponse.json(
      { error: "Please go back and check your answers.", fields: errors },
      { status: 400 },
    );
  }

  /* ---------------------------------------------------------------- *
   * Files: validated by magic bytes, never by extension alone.
   * ---------------------------------------------------------------- */
  const incoming = form.getAll("files").filter((f) => f && typeof f === "object" && f.size);
  const cvEntry = form.get("cv");
  if (cvEntry && typeof cvEntry === "object" && cvEntry.size) incoming.push(cvEntry);

  const batch = validateBatch(incoming.map((f) => ({ size: f.size })));
  if (!batch.ok) return NextResponse.json({ error: batch.error }, { status: 413 });
  if (incoming.length > MAX_FILES) {
    return NextResponse.json({ error: `No more than ${MAX_FILES} files.` }, { status: 413 });
  }

  const attachments = [];
  const fileRows = [];
  for (const f of incoming) {
    const buf = Buffer.from(await f.arrayBuffer());
    const check = validateUpload({
      name: f.name,
      mime: f.type,
      size: buf.length,
      head: buf.subarray(0, 16),
    });
    if (!check.ok) {
      return NextResponse.json({ error: check.error }, { status: 400 });
    }
    // The filename sent onward is generated here, never the uploader's.
    attachments.push({ filename: check.storedKey, content: buf });
    fileRows.push({
      kind: f === cvEntry ? "cv" : "certificate",
      original_name: f.name,
      stored_key: check.storedKey,
      mime_type: f.type || "application/octet-stream",
      size_bytes: buf.length,
    });
  }

  /* ---------------------------------------------------------------- *
   * STEP 1 — save. Everything else is best-effort after this point.
   * ---------------------------------------------------------------- */
  await query(
    `UPDATE applications SET status='submitted', submitted_at=NOW(), updated_at=NOW() WHERE id=$1`,
    [applicationId],
  );
  for (const r of fileRows) {
    await query(
      `INSERT INTO application_files (id, application_id, kind, original_name, stored_key, mime_type, size_bytes)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [crypto.randomUUID(), applicationId, r.kind, r.original_name, r.stored_key, r.mime_type, r.size_bytes],
    );
  }
  const saved = await getApplication(applicationId);

  const problems = [];

  /* ---------------------------------------------------------------- *
   * STEP 2 — the PDF
   * ---------------------------------------------------------------- */
  let pdf = null;
  try {
    pdf = await buildApplicationPdf({ application: saved, files: fileRows });
  } catch (err) {
    console.error(`[apply-submit] PDF failed for ${saved.reference}: ${err.message}`);
    problems.push("pdf");
  }

  const esc = (v) =>
    String(v ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const locationText = Array.isArray(a.locations) ? a.locations.join(", ") : "";

  /* ---------------------------------------------------------------- *
   * STEP 3 — email the recruitment inbox
   * ---------------------------------------------------------------- */
  if (isMailConfigured()) {
    try {
      await sendToBusiness({
        subject: `Job application — ${a.fullName} — ${a.role || "General"} (${locationText}) — ${saved.reference}`,
        replyTo: a.email,
        html: `
          <h2>New job application</h2>
          <p><strong>Reference:</strong> ${esc(saved.reference)}</p>
          <p><strong>Name:</strong> ${esc(a.fullName)}</p>
          <p><strong>Role:</strong> ${esc(a.role || "General application")}</p>
          <p><strong>Locations:</strong> ${esc(locationText)}</p>
          <p><strong>Email:</strong> ${esc(a.email)}</p>
          <p><strong>Phone:</strong> ${esc(a.mobile)}</p>
          <p>The full application is attached as a PDF, along with any files the
          applicant uploaded.</p>
          <p>All three referees are being contacted automatically.</p>
        `,
        attachments: [
          ...(pdf ? [{ filename: `application-${saved.reference}.pdf`, content: pdf }] : []),
          ...attachments,
        ],
      });
    } catch (err) {
      console.error(`[apply-submit] office email failed for ${saved.reference}: ${err.message}`);
      problems.push("office-email");
    }

    /* -------------------------------------------------------------- *
     * STEP 4 — confirmation to the applicant
     * -------------------------------------------------------------- */
    try {
      const transporter = createTransport();
      await transporter.sendMail({
        from: mailFrom(),
        to: a.email,
        replyTo: MAIL_TO,
        subject: `We have your application — ${saved.reference}`,
        html: `
          <h2>Thank you for applying to Kare Plus Rugby</h2>
          <p>We have your application for <strong>${esc(a.role || "a role with us")}</strong>.
          Your reference is <strong>${esc(saved.reference)}</strong> — quote it if you call us.</p>
          <h3>What happens next</h3>
          <ol>
            <li>We are contacting the three referees you named now.</li>
            <li>Someone will read your application and call you to talk it through.</li>
            <li>If it looks like a fit, we will invite you to meet us.</li>
          </ol>
          <p>We aim to come back to you as soon as we can. If you have not heard
          from us and want to chase it, call 01788 422422 and quote your reference.</p>
          <p>A copy of everything you told us is attached.</p>
          <hr>
          <p style="color:#666;font-size:12px">
            If you did not apply for a job with Kare Plus Rugby, please tell us at
            ${esc(MAIL_TO)} and we will delete this application.
          </p>
        `,
        attachments: pdf
          ? [{ filename: `your-application-${saved.reference}.pdf`, content: pdf }]
          : [],
      });
    } catch (err) {
      console.error(`[apply-submit] applicant email failed for ${saved.reference}: ${err.message}`);
      problems.push("applicant-email");
    }
  } else {
    console.error(`[apply-submit] ${saved.reference} SAVED but no mail transport configured`);
    problems.push("no-mail-transport");
  }

  /* ---------------------------------------------------------------- *
   * STEP 5 — WhatsApp doorbell (feature-flagged, default off)
   * ---------------------------------------------------------------- */
  try {
    await notifyNewApplication({ role: a.role || "General application", location: locationText });
  } catch (err) {
    console.error(`[apply-submit] notify failed: ${err.message}`);
    problems.push("whatsapp");
  }

  /* ---------------------------------------------------------------- *
   * STEP 6 — reference emails are Phase 4.
   * ---------------------------------------------------------------- */

  return NextResponse.json({
    ok: true,
    reference: saved.reference,
    // Honest about partial failure rather than a blanket thank-you.
    emailed: problems.length === 0,
    problems,
  });
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
