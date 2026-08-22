import { NextResponse } from "next/server";
import config from "@config/config.json";
import { sendToBusiness, isMailConfigured, transportName } from "@lib/mailer";

/**
 * Contact form endpoint (config.params.contact_form_action).
 *
 * NOTHING IS RETAINED. The submission is emailed and then discarded.
 *
 * This route used to append every submission — name, email, phone, message —
 * to data/messages.json, a file tracked in git. That is personal data written
 * into the repository, which is exactly what must never happen: it would end
 * up in every clone, every fork and the whole commit history, with no
 * retention policy and no way to honour an erasure request. The file was
 * still empty when this was removed, so nothing was ever actually committed.
 *
 * The write had never worked in production anyway — Vercel's filesystem is
 * read-only — so the admin viewer that read it always showed "No messages".
 * Both are gone rather than left as a trap for the next person.
 *
 * Email is the only delivery path. If it fails the visitor is told so; a care
 * enquiry silently vanishing is far worse than an honest error.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );

export async function POST(req) {
  let form;
  try {
    form = await req.formData();
  } catch {
    return new NextResponse("Invalid form submission.", { status: 400 });
  }

  const get = (k) => {
    const v = form.get(k);
    return typeof v === "string" ? v.trim() : "";
  };

  // Honeypot: a field no human sees. A bot fills it in. Accept and discard,
  // so the bot gets no signal that it was caught.
  if (get("website")) {
    return NextResponse.redirect(new URL("/thank-you", req.url), 303);
  }

  // Server-side validation, independent of the client - client checks are a
  // convenience and can be bypassed entirely.
  const name = get("name");
  const email = get("email");
  const message = get("message");

  if (!name || !EMAIL_RE.test(email) || message.length < 10) {
    return new NextResponse(
      "Please give us your name, a valid email address and a little more detail.",
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  for (const [value, max] of [[name, 200], [email, 320], [get("phone"), 40], [message, 5000]]) {
    if (value.length > max) {
      return new NextResponse("That submission was too long.", {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      });
    }
  }

  if (!isMailConfigured()) {
    // Metadata only - never log message bodies or contact details.
    console.error("[contact] NOT SENT: no mail transport configured — set SMTP_HOST or EMAIL_USER");
    return new NextResponse(
      "Our contact form is temporarily unavailable. Please call us instead.",
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    await sendToBusiness({
      // replyTo means staff can hit reply and reach the enquirer directly.
      replyTo: email,
      subject: get("subject") ? `Contact: ${get("subject")}` : "Contact form message",
      html: `
        <h2>New contact message</h2>
        <p><strong>Name:</strong> ${esc(name)}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Phone:</strong> ${esc(get("phone"))}</p>
        <p><strong>Subject:</strong> ${esc(get("subject"))}</p>
        <p><strong>Type:</strong> ${esc(get("type"))}</p>
        <p><strong>Message:</strong></p>
        <p>${esc(message).replace(/\n/g, "<br>")}</p>
        <hr>
        <p style="color:#666;font-size:12px">Sent from the Kare Plus Rugby website at ${new Date().toISOString()}</p>
      `,
    });
  } catch (err) {
    console.error(`[contact] send failed: ${err.message}`);
    return new NextResponse(
      "Sorry — we could not send your message. Please call us or email us directly.",
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }

  // Must be absolute: NextResponse.redirect rejects a relative URL.
  // 303 turns the POST into a GET so the browser does not re-post to /thank-you.
  return NextResponse.redirect(new URL("/thank-you", req.url), 303);
}

// There is no stored message list to read any more.
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
