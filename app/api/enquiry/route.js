import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import config from "@config/config.json";

/**
 * Enquiry endpoint.
 *
 * Sends to params.contact_email (kp.rugby@kareplus.co.uk) via nodemailer.
 *
 * [TODO: SET EMAIL_USER AND EMAIL_PASS ON THE SERVER]
 * Until those environment variables exist there is no SMTP transport, so this
 * route returns HTTP 503 and the form shows a visible error telling the
 * visitor to phone instead. It deliberately does NOT return success - a care
 * enquiry silently vanishing is far worse than an honest failure.
 *
 * EMAIL_PASS must be a Gmail App Password, not an account password.
 * Consider a transactional provider (Postmark/SendGrid/Resend) for
 * deliverability; Gmail SMTP is rate-limited and easy to get blocked.
 *
 * Nothing is written to disk on purpose: data/*.json is tracked in git and
 * runtime writes there make `git pull` conflict, which silently stalls deploys.
 *
 * Server-side validation is intentionally independent of the client - client
 * checks are a convenience and can be bypassed entirely.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const VALID_TYPES = ["care", "referral", "staffing", "general"];

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const errors = {};
  const str = (v) => (typeof v === "string" ? v.trim() : "");

  if (!str(body.name)) errors.name = "Name is required.";
  if (!EMAIL_RE.test(str(body.email))) errors.email = "A valid email address is required.";
  if (!str(body.phone)) errors.phone = "Phone number is required.";
  if (str(body.message).length < 10) errors.message = "Please give us a little more detail.";
  if (body.consent !== true) errors.consent = "Consent is required.";
  if (!VALID_TYPES.includes(body.enquiryType)) errors.enquiryType = "Unknown enquiry type.";

  // Length ceilings so a malicious client cannot post megabytes of text.
  for (const [field, max] of [["name", 200], ["email", 320], ["phone", 40], ["organisation", 200], ["message", 5000]]) {
    if (str(body[field]).length > max) errors[field] = `${field} is too long.`;
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Please check the form and try again.", fields: errors },
      { status: 400 }
    );
  }

  const to = config.params.contact_email;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    // Metadata only - never log message bodies or contact details.
    console.error(
      `[enquiry] type=${body.enquiryType} NOT SENT: EMAIL_USER/EMAIL_PASS unset`
    );
    return NextResponse.json(
      {
        error:
          "Our enquiry form is temporarily unavailable. Please call us instead.",
      },
      { status: 503 }
    );
  }

  const esc = (v) =>
    String(v ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
    );

  const LABELS = {
    care: "Home care enquiry",
    referral: "Professional referral",
    staffing: "Care home staffing request",
    general: "General enquiry",
  };

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      // replyTo means staff can hit reply and reach the enquirer directly.
      replyTo: str(body.email),
      subject: `${LABELS[body.enquiryType]} — ${str(body.name)}`,
      html: `
        <h2>${esc(LABELS[body.enquiryType])}</h2>
        <p><strong>Name:</strong> ${esc(body.name)}</p>
        <p><strong>Email:</strong> ${esc(body.email)}</p>
        <p><strong>Phone:</strong> ${esc(body.phone)}</p>
        ${body.organisation ? `<p><strong>Organisation:</strong> ${esc(body.organisation)}</p>` : ""}
        <p><strong>Subject:</strong> ${esc(body.subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${esc(body.message).replace(/\n/g, "<br>")}</p>
        <hr>
        <p style="color:#666;font-size:12px">Sent from the Kare Plus Rugby website at ${new Date().toISOString()}</p>
      `,
    });
  } catch (err) {
    console.error(`[enquiry] send failed: ${err.message}`);
    return NextResponse.json(
      { error: "We could not send your enquiry. Please call us instead." },
      { status: 502 }
    );
  }

  console.info(`[enquiry] type=${body.enquiryType} delivered=true`);
  return NextResponse.json({ ok: true, delivered: true });
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed." },
    { status: 405, headers: { Allow: "POST" } }
  );
}
