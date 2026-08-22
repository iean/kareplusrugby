import { NextResponse } from "next/server";
import { sendToBusiness, isMailConfigured, transportName, mailFrom, MAIL_TO } from "@lib/mailer";

/**
 * Email delivery test route, required by RECRUITMENT-SPEC.md Phase 5:
 * "Build a test route I can hit to send a test email to myself and confirm
 * delivery before we rely on it."
 *
 * Sending from a server without authentication lands in spam, and a reference
 * request that lands in spam fails silently — the referee never knows they
 * were asked. So this exists to prove delivery works BEFORE the reference loop
 * depends on it.
 *
 * PROTECTED. It is behind the same password as the status page. An open
 * send-an-email endpoint is an open relay for spammers and would get the
 * domain blocklisted, taking every enquiry on the site down with it.
 *
 * GET  -> reports what is configured, without sending and without revealing
 *         any credential.
 * POST -> sends one test message to the business inbox.
 */

function authorised(req) {
  const expected = process.env.RECRUITMENT_ADMIN_PASSWORD;
  // Fail closed. An unset password must never mean "no password required".
  if (!expected) return false;

  const header = req.headers.get("authorization") || "";
  if (!header.startsWith("Basic ")) return false;
  let decoded;
  try {
    decoded = atob(header.slice(6));
  } catch {
    return false;
  }
  const supplied = decoded.slice(decoded.indexOf(":") + 1);

  // Constant-time-ish compare; Edge has no timingSafeEqual.
  if (supplied.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < supplied.length; i++) {
    diff |= supplied.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

const deny = () =>
  new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Kare Plus Rugby recruitment", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });

export async function GET(req) {
  if (!authorised(req)) return deny();
  return NextResponse.json({
    mailConfigured: isMailConfigured(),
    transport: transportName(),
    from: mailFrom(),
    to: MAIL_TO,
    note: isMailConfigured()
      ? "A transport is configured. POST to this route to send a real test message."
      : "No transport configured. Set SMTP_HOST/SMTP_USER/SMTP_PASS (or EMAIL_USER/EMAIL_PASS) in the hosting environment.",
  });
}

export async function POST(req) {
  if (!authorised(req)) return deny();

  if (!isMailConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "No mail transport is configured, so nothing was sent. Set SMTP_HOST, SMTP_USER and SMTP_PASS (or EMAIL_USER and EMAIL_PASS) and try again.",
        transport: transportName(),
      },
      { status: 503 },
    );
  }

  const stamp = new Date().toISOString();
  try {
    await sendToBusiness({
      subject: `Test email from the Kare Plus Rugby website — ${stamp}`,
      html: `
        <h2>Test email</h2>
        <p>If you are reading this, the website can send email successfully.</p>
        <p>Sent at ${stamp} using transport <strong>${transportName()}</strong>.</p>
        <hr>
        <p style="color:#666;font-size:12px">
          Triggered from /api/careers/test-email. This message contains no
          personal data.
        </p>
      `,
    });
  } catch (err) {
    // Never log the credential; the message is enough to diagnose.
    console.error(`[test-email] send failed: ${err.message}`);
    return NextResponse.json(
      { ok: false, error: err.message, transport: transportName() },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, sentAt: stamp, to: MAIL_TO, transport: transportName() });
}
