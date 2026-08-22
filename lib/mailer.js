import nodemailer from "nodemailer";
import config from "@config/config.json";

/**
 * The one place the site builds an email transport.
 *
 * Every form on the site — enquiry, referral, job application, get-started,
 * contact, and the GDPR data request — is delivered through here, and every one
 * of them goes to a single inbox.
 *
 * WHERE IT SENDS
 * --------------
 * params.contact_email in config/config.json: kp.rugby@kareplus.co.uk.
 * Confirmed by Alif on 2026-08-22 as the address for everything. There is no
 * per-form override and no environment override, deliberately — a referral with
 * a discharge deadline must not be silently divertible.
 *
 * HOW IT SENDS
 * ------------
 * Previously each route hardcoded `service: "gmail"`, which meant the site
 * could only ever send through a Gmail account. It now takes whichever of these
 * is configured, so the mailbox provider is a deployment decision rather than a
 * code change:
 *
 *   1. Generic SMTP  — SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 *      Works with Microsoft 365, Google Workspace, Fastmail, a cPanel host, or
 *      a transactional provider's SMTP relay (Resend, SendGrid, Brevo,
 *      Mailgun, Postmark). This is the better option: it can send *from* the
 *      kareplus.co.uk mailbox itself, and it gives real delivery logs.
 *
 *   2. Gmail         — EMAIL_USER, EMAIL_PASS
 *      The original setup, kept working so nothing breaks. EMAIL_PASS must be a
 *      Gmail App Password, not the account password, and the account needs
 *      2-step verification switched on. Gmail SMTP is rate-limited and can be
 *      blocked for bulk sending, so prefer option 1 for a business inbox.
 *
 * If neither is set, isMailConfigured() returns false and every route returns
 * an honest 503 telling the visitor to phone instead. A care enquiry silently
 * vanishing is far worse than a visible failure.
 */

export const MAIL_TO = config.params.contact_email;

const smtpHost = () => process.env.SMTP_HOST?.trim();
const gmailUser = () => process.env.EMAIL_USER?.trim();

/** True when the deployment has enough configuration to actually send. */
export function isMailConfigured() {
  if (smtpHost()) return true;
  return Boolean(gmailUser() && process.env.EMAIL_PASS);
}

/**
 * The address messages are sent FROM. Falls back sensibly so a misconfigured
 * MAIL_FROM never produces an empty From header, which most servers reject.
 */
export function mailFrom() {
  return (
    process.env.MAIL_FROM?.trim() ||
    process.env.SMTP_USER?.trim() ||
    gmailUser() ||
    MAIL_TO
  );
}

/** Which route is in use, for logging. Never logs a credential. */
export function transportName() {
  if (smtpHost()) return `smtp:${smtpHost()}`;
  if (gmailUser()) return "gmail";
  return "none";
}

export function createTransport() {
  const host = smtpHost();

  if (host) {
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS;
    return nodemailer.createTransport({
      host,
      port,
      // 465 is implicit TLS; 587 and 25 start plaintext and upgrade via
      // STARTTLS. Setting this wrongly is the usual cause of a hanging send.
      secure: process.env.SMTP_SECURE
        ? process.env.SMTP_SECURE === "true"
        : port === 465,
      // Auth is omitted entirely when no user is set, which is what a local
      // test server or an IP-allowlisted internal relay expects. Passing an
      // empty auth object makes nodemailer try to authenticate and fail.
      ...(user ? { auth: { user, pass } } : {}),
    });
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser(), pass: process.env.EMAIL_PASS },
  });
}

/**
 * Turn the HTML body into a readable plain-text alternative.
 *
 * Sending HTML with no text/plain part is a real deliverability problem: spam
 * filters score multipart/alternative more kindly than HTML alone, and some
 * clients and notification previews show the text part rather than the HTML.
 * Every one of these messages is a care enquiry, a referral or a job
 * application, so landing in a spam folder is not an acceptable failure.
 */
function htmlToText(html) {
  return String(html)
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<hr\s*\/?>/gi, "\n---\n")
    .replace(/<[^>]+>/g, "")
    // Undo the escaping applied before interpolation, so the text part reads
    // as the sender actually wrote it.
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Send one message to the business inbox.
 *
 * Throws on failure so the calling route can return a visible error. It must
 * never swallow a failure and report success.
 */
export async function sendToBusiness({ subject, html, replyTo, attachments }) {
  const transporter = createTransport();
  return transporter.sendMail({
    from: mailFrom(),
    to: MAIL_TO,
    ...(replyTo ? { replyTo } : {}),
    subject,
    html,
    text: htmlToText(html),
    ...(attachments && attachments.length ? { attachments } : {}),
  });
}
