import { NextResponse } from "next/server";
import config from "@config/config.json";
import { sendToBusiness, isMailConfigured, transportName } from "@lib/mailer";
import { rateLimit } from "@lib/rateLimit";

/**
 * "Get started" enquiry endpoint.
 *
 * NOTHING IS RETAINED. The submission is emailed and then discarded.
 *
 * This route used to append every submission — who needs care, their name,
 * email and phone — to data/get-started.json. That is personal data written
 * into the repository directory, which must never happen: it would spread to
 * every clone and sit in the commit history with no retention policy and no
 * way to honour an erasure request. It also never worked in production, since
 * Vercel's filesystem is read-only, and the GET that exposed the whole list
 * has gone with it.
 *
 * Email is the only delivery path. A care enquiry silently vanishing is far
 * worse than an honest error, so a send failure returns an error the visitor
 * can act on rather than a success.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Escape before interpolating into the HTML email. Without this a submission
// containing markup is injected straight into the message staff open.
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

  // Honeypot - hidden field only a bot fills. Accept and discard.
  if (str(body.website)) {
    return NextResponse.json({ success: true });
  }

  const limit = rateLimit(req);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many enquiries from this connection. Please try again shortly, or call us." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  // Server-side validation, independent of the client.
  const errors = {};
  if (!str(body.name)) errors.name = "Name is required.";
  if (!EMAIL_RE.test(str(body.email))) errors.email = "A valid email address is required.";
  if (!str(body.phone)) errors.phone = "Phone number is required.";

  for (const [field, max] of [
    ["name", 200], ["email", 320], ["phone", 40],
    ["whoNeedsCare", 100], ["careType", 100], ["needs", 5000],
  ]) {
    if (str(body[field]).length > max) errors[field] = `${field} is too long.`;
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Please check the form and try again.", fields: errors },
      { status: 400 }
    );
  }

  if (!isMailConfigured()) {
    // Metadata only - never log contact details or message bodies.
    console.error("[get-started] NOT SENT: no mail transport configured — set SMTP_HOST or EMAIL_USER");
    return NextResponse.json(
      { error: "This form is temporarily unavailable. Please call us instead." },
      { status: 503 }
    );
  }

  try {
    await sendToBusiness({
      replyTo: str(body.email),
      subject: `New Get Started request — ${str(body.name)}`,
      html: `
        <h2>New Get Started form submission</h2>
        <p><strong>Who needs the care:</strong> ${esc(body.whoNeedsCare)}</p>
        <p><strong>Type of care required:</strong> ${esc(body.careType)}</p>
        <p><strong>Name:</strong> ${esc(body.name)}</p>
        <p><strong>Email:</strong> ${esc(body.email)}</p>
        <p><strong>Phone:</strong> ${esc(body.phone)}</p>
        <p><strong>Needs:</strong> ${esc(str(body.needs) || "Not specified").replace(/\n/g, "<br>")}</p>
        <hr>
        <p style="color:#666;font-size:12px">Sent from the Kare Plus Rugby website at ${new Date().toISOString()}</p>
      `,
    });
  } catch (err) {
    console.error(`[get-started] send failed: ${err.message}`);
    return NextResponse.json(
      { error: "We could not send your enquiry. Please call us instead." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}

// There is no stored list to read any more.
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed." },
    { status: 405, headers: { Allow: "POST" } }
  );
}
