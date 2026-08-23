import { NextResponse } from "next/server";
import { deleteApplicationByReference } from "@lib/recruitment/store";
import { query } from "@lib/recruitment/db";
import { ensureSchema } from "@lib/recruitment/schema";
import { sendToBusiness, isMailConfigured, MAIL_TO, createTransport, mailFrom } from "@lib/mailer";
import { rateLimit } from "@lib/rateLimit";
import { EMAIL_RE } from "@lib/recruitment/validation";

export const runtime = "nodejs";

/**
 * Applicant-initiated deletion. RECRUITMENT-SPEC.md Phase 6: "Add a data
 * deletion route so an applicant can request removal."
 *
 * DESIGN DECISION worth flagging for review. This deletes immediately when the
 * reference and the email address match, rather than raising a ticket for
 * someone to action. The trade-off:
 *
 *   For: erasure is a right, not a favour, and a request that sits in an inbox
 *        for three weeks is a request that has not been honoured. The pair of
 *        (reference, email) is only known to the applicant and to us.
 *
 *   Against: it is not identity verification. Someone with access to an
 *        applicant's inbox — or who has seen their confirmation email — could
 *        delete their application. The damage is limited (an application is
 *        destroyed, not disclosed) and the applicant can re-apply, which is
 *        why immediate deletion wins here. It would be the wrong call for a
 *        subject ACCESS request, where the failure mode is disclosure.
 *
 * TODO (Alif): confirm you are content with self-service deletion on
 * reference + email, or say if you would rather it raised a request for a
 * human to approve. Recorded in OVERNIGHT-NOTES.md.
 *
 * A confirmation is emailed to the applicant and a notification to the
 * business inbox, so a deletion is never silent on either side.
 */
export async function POST(req) {
  const limit = rateLimit(req, { max: 5, windowMs: 60 * 60 * 1000, bucket: "delete-ip" });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please email us instead." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const reference = String(body.reference || "").trim().toUpperCase();
  const email = String(body.email || "").trim().toLowerCase();

  if (!reference || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please give both your application reference and the email address you applied with." },
      { status: 400 },
    );
  }

  await ensureSchema();

  // Referees and files cascade with the application row.
  const deleted = await deleteApplicationByReference(reference, email);

  /**
   * The same response either way. Telling a stranger "no such application"
   * confirms whether a given person applied here, which is itself a
   * disclosure — and one an abusive ex-partner would find useful.
   */
  const genericResponse = NextResponse.json({
    ok: true,
    message:
      "If an application matching those details exists, it has been deleted. We have emailed you to confirm.",
  });

  if (!deleted.length) {
    console.info(`[delete] no match for reference=${reference}`);
    return genericResponse;
  }

  console.info(`[delete] deleted ${deleted.map((d) => d.reference).join(", ")}`);

  if (isMailConfigured()) {
    try {
      const transporter = createTransport();
      await transporter.sendMail({
        from: mailFrom(),
        to: email,
        replyTo: MAIL_TO,
        subject: `Your application has been deleted — ${reference}`,
        html: `
          <h2>Your application has been deleted</h2>
          <p>We have deleted application <strong>${reference}</strong> and
          everything stored with it, including any references we had already
          received.</p>
          <p>Copies already sent to our recruitment inbox by email may remain in
          that mailbox. If you want those removed as well, reply to this message
          and ask — we will do it.</p>
          <p>You are welcome to apply again at any time.</p>
        `,
      });
    } catch (err) {
      console.error(`[delete] confirmation email failed: ${err.message}`);
    }

    try {
      await sendToBusiness({
        subject: `Application deleted at the applicant's request — ${reference}`,
        html: `
          <h2>Application deleted</h2>
          <p>Application <strong>${reference}</strong> was deleted by the
          applicant using the deletion form. The database record, its referees
          and its file records are gone.</p>
          <p><strong>Emails already in this inbox are not deleted automatically.</strong>
          If you are asked to remove those too, they will need deleting by hand.</p>
        `,
      });
    } catch (err) {
      console.error(`[delete] business notification failed: ${err.message}`);
    }
  }

  return genericResponse;
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
