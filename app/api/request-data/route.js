import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import config from "@config/config.json";

/**
 * UK GDPR data subject request endpoint.
 *
 * NOTHING IS RETAINED. The request is emailed and then discarded.
 *
 * This route used to append every request to data/data-requests.json, and
 * exposed the whole list over GET. That was the worst instance of the problem
 * on the site: a subject access request necessarily carries identity details,
 * and this one also collected a "proof of identity" field. Writing that into
 * the repository directory — where it would reach every clone and stay in the
 * commit history — is precisely the kind of processing a data subject would be
 * exercising their rights against. It also never worked in production, since
 * Vercel's filesystem is read-only.
 *
 * These requests carry a 30-day statutory deadline, so delivery must be
 * reliable and a failure must be visible. A send failure returns an error
 * telling the requester to contact us another way; it never reports success.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Escape before interpolating into the HTML email.
const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const str = (v) => (typeof v === "string" ? v.trim() : "");

  const errors = {};
  if (!str(body.name)) errors.name = "Name is required.";
  if (!EMAIL_RE.test(str(body.email))) errors.email = "A valid email address is required.";
  if (!str(body.requestType)) errors.requestType = "Please tell us which right you are exercising.";
  if (body.consent !== true) errors.consent = "Consent is required.";

  for (const [field, max] of [
    ["name", 200], ["email", 320], ["phone", 40],
    ["requestType", 100], ["additionalInfo", 5000], ["identification", 500],
  ]) {
    if (str(body[field]).length > max) errors[field] = `${field} is too long.`;
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Please check the form and try again.", fields: errors },
      { status: 400 }
    );
  }

  // Generated once so the reference in the email and the one shown to the
  // requester are the same. Previously two separate Date.now() calls produced
  // two different ids for the same request.
  const requestId = `DR-${Date.now()}`;
  const deadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("[request-data] NOT SENT: EMAIL_USER/EMAIL_PASS unset");
    return NextResponse.json(
      {
        error:
          "We could not submit your request online. Please email or call us so your request is recorded — the 30-day deadline runs from when you contact us.",
      },
      { status: 503 }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      // GDPR requests carry a statutory deadline, so they must reach a
      // monitored inbox. No environment override, so it cannot be diverted.
      to: config.params.contact_email,
      replyTo: str(body.email),
      subject: `Data request — ${str(body.requestType)} — ${str(body.name)} (${requestId})`,
      html: `
        <h2>New data subject request</h2>
        <p><strong>Request ID:</strong> ${esc(requestId)}</p>
        <p><strong>Name:</strong> ${esc(body.name)}</p>
        <p><strong>Email:</strong> ${esc(body.email)}</p>
        <p><strong>Phone:</strong> ${esc(str(body.phone) || "Not provided")}</p>
        <p><strong>Request type:</strong> ${esc(body.requestType)}</p>
        <p><strong>Additional information:</strong> ${esc(str(body.additionalInfo) || "None provided").replace(/\n/g, "<br>")}</p>
        <p><strong>Proof of identity:</strong> ${esc(str(body.identification) || "Not provided")}</p>
        <p><strong>Consent given:</strong> Yes</p>
        <p><strong>Submitted:</strong> ${new Date().toISOString()}</p>

        <div style="background-color:#F1F6FD;padding:15px;margin:20px 0;border-left:4px solid #12469B">
          <h3 style="color:#12469B;margin-top:0">UK GDPR compliance notice</h3>
          <p style="margin-bottom:10px"><strong>Response deadline:</strong> ${deadline.toLocaleDateString("en-GB")} (30 days from submission)</p>
          <p style="margin-bottom:10px"><strong>Required actions:</strong></p>
          <ul style="margin:10px 0;padding-left:20px">
            <li>Verify the identity of the requester</li>
            <li>Locate and review all relevant personal data</li>
            <li>Prepare the response within the statutory timeframe</li>
            <li>Consider any exemptions or restrictions</li>
            <li>Document the request and the response process</li>
          </ul>
          <p style="margin-bottom:0">This request is not stored on the website. This email is the only record — do not delete it.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error(`[request-data] send failed: ${err.message}`);
    return NextResponse.json(
      {
        error:
          "We could not submit your request. Please email or call us so your request is recorded.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    success: true,
    requestId,
    message:
      "Your data request has been submitted. We will respond within 30 days as required by UK GDPR.",
  });
}

// There is no stored list to read any more.
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed." },
    { status: 405, headers: { Allow: "POST" } }
  );
}
