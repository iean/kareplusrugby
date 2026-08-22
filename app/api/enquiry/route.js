import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import config from "@config/config.json";
import { rateLimit } from "@lib/rateLimit";

/**
 * Enquiry endpoint.
 *
 * Sends to params.contact_email (kp.rugby@kareplus.co.uk) via nodemailer.
 *
 * REQUIRES EMAIL_USER and EMAIL_PASS in the Vercel project's environment.
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

  const str = (v) => (typeof v === "string" ? v.trim() : "");

  // Honeypot - hidden field only a bot fills. Accept and discard.
  if (str(body.website)) {
    return NextResponse.json({ ok: true, delivered: true });
  }

  const limit = rateLimit(req);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many enquiries from this connection. Please try again shortly, or call us." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const errors = {};

  /**
   * Only a name and ONE way to reach them is required.
   *
   * This form is often filled in by someone under real stress, arranging care
   * for a parent. Every extra mandatory field loses some of them. Previously
   * both phone and email were required and so was a message; that is now the
   * minimum the plan asks for and no more.
   */
  if (!str(body.name)) errors.name = "Name is required.";

  const hasEmail = Boolean(str(body.email));
  const hasPhone = Boolean(str(body.phone));

  if (!hasEmail && !hasPhone) {
    errors.contact = "Please give us either a phone number or an email address.";
  }
  // Validate the format only of whatever they actually gave us.
  if (hasEmail && !EMAIL_RE.test(str(body.email))) {
    errors.email = "That email address does not look right.";
  }

  if (body.consent !== true) errors.consent = "Consent is required.";
  if (!VALID_TYPES.includes(body.enquiryType)) errors.enquiryType = "Unknown enquiry type.";

  // Length ceilings so a malicious client cannot post megabytes of text.
  for (const [field, max] of [
    ["name", 200], ["email", 320], ["phone", 40], ["organisation", 200],
    ["message", 5000], ["area", 120], ["supportType", 120], ["funding", 120],
    ["contactMethod", 60], ["contactTime", 60], ["who", 120], ["when", 120],
  ]) {
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
      // Omitted when no email was given - an empty replyTo breaks some clients.
      ...(hasEmail ? { replyTo: str(body.email) } : {}),
      subject: `${LABELS[body.enquiryType]} — ${str(body.name)}`,
      html: `
        <h2>${esc(LABELS[body.enquiryType])}</h2>
        <p><strong>Name:</strong> ${esc(body.name)}</p>
        <p><strong>Email:</strong> ${esc(str(body.email) || "Not given")}</p>
        <p><strong>Phone:</strong> ${esc(str(body.phone) || "Not given")}</p>
        ${body.organisation ? `<p><strong>Organisation:</strong> ${esc(body.organisation)}</p>` : ""}
        ${body.who ? `<p><strong>Care is for:</strong> ${esc(body.who)}</p>` : ""}
        ${body.supportType ? `<p><strong>Support needed:</strong> ${esc(body.supportType)}</p>` : ""}
        ${body.area ? `<p><strong>Postcode / area:</strong> ${esc(body.area)}</p>` : ""}
        ${body.when ? `<p><strong>How soon:</strong> ${esc(body.when)}</p>` : ""}
        ${body.funding ? `<p><strong>Likely funding:</strong> ${esc(body.funding)}</p>` : ""}
        ${body.contactMethod || body.contactTime ? `<p><strong>Best way to contact:</strong> ${esc([str(body.contactMethod), str(body.contactTime)].filter(Boolean).join(", "))}</p>` : ""}
        <p><strong>Subject:</strong> ${esc(body.subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${esc(str(body.message) || "No message given").replace(/\n/g, "<br>")}</p>
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
