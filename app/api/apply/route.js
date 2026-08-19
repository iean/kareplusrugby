import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import config from "@config/config.json";

/**
 * Job application endpoint.
 *
 * Emails the application to params.contact_email with the CV as an
 * attachment. Nothing is written to disk - the deploy runs `git pull`, so
 * untracked writes into the repo directory cause conflicts that silently
 * stall future deploys.
 *
 * [TODO: SET EMAIL_USER AND EMAIL_PASS ON THE SERVER] - without them this
 * returns 503 and the form tells the applicant to call instead.
 *
 * [TODO: AGREE A CV RETENTION POLICY] - CVs are personal data under UK GDPR.
 * Decide how long they are kept and who can see them, then say so in the
 * privacy policy. Emailing them means they live in an inbox indefinitely
 * unless someone manages that.
 *
 * SECURITY NOTE: this route deliberately does NOT trust the client. It
 * re-checks file type and size, and it does not use the client-supplied
 * filename for anything. When storage is added, generate a fresh filename
 * server-side - never write a user-supplied path.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_CV_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXT = ["pdf", "doc", "docx", "rtf", "odt"];
const ALLOWED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/rtf",
  "text/rtf",
  "application/vnd.oasis.opendocument.text",
];

export async function POST(req) {
  let form;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  const get = (k) => {
    const v = form.get(k);
    return typeof v === "string" ? v.trim() : "";
  };

  const errors = {};
  if (!get("firstName")) errors.firstName = "First name is required.";
  if (!get("lastName")) errors.lastName = "Last name is required.";
  if (!EMAIL_RE.test(get("email"))) errors.email = "A valid email address is required.";
  if (!get("phone")) errors.phone = "Phone number is required.";
  if (!get("postcode")) errors.postcode = "Postcode is required.";
  if (get("experience").length < 10) errors.experience = "Please tell us a little more.";
  if (get("consent") !== "true") errors.consent = "Consent is required.";

  for (const [field, max] of [
    ["firstName", 100], ["lastName", 100], ["email", 320],
    ["phone", 40], ["postcode", 20], ["experience", 5000],
  ]) {
    if (get(field).length > max) errors[field] = `${field} is too long.`;
  }

  // CV is optional, but if present it must pass the same checks as the client.
  const cv = form.get("cv");
  const hasCv = cv && typeof cv === "object" && typeof cv.size === "number";
  if (hasCv) {
    const ext = (cv.name || "").split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      errors.cv = `Unsupported file type. Allowed: ${ALLOWED_EXT.join(", ")}.`;
    } else if (cv.type && !ALLOWED_MIME.includes(cv.type)) {
      // Extension and MIME disagreeing is a classic upload bypass attempt.
      errors.cv = "File type does not match its extension.";
    } else if (cv.size > MAX_CV_BYTES) {
      errors.cv = "File is larger than the 5 MB limit.";
    } else if (cv.size === 0) {
      errors.cv = "The uploaded file is empty.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Please check the form and try again.", fields: errors },
      { status: 400 }
    );
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error(`[apply] NOT SENT: EMAIL_USER/EMAIL_PASS unset`);
    return NextResponse.json(
      {
        error:
          "Our application form is temporarily unavailable. Please call or email us instead.",
      },
      { status: 503 }
    );
  }

  const esc = (v) =>
    String(v ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
    );

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    // The CV rides along as an attachment rather than being written to disk.
    // The server deploys with `git pull`, so untracked writes into the repo
    // directory cause merge conflicts and silently stall future deploys.
    const attachments = [];
    if (hasCv) {
      const buf = Buffer.from(await cv.arrayBuffer());
      const ext = (cv.name || "").split(".").pop().toLowerCase();
      // Filename is generated server-side; never trust the client's.
      const safe = `CV-${get("lastName")}-${get("firstName")}`
        .replace(/[^a-zA-Z0-9-]/g, "")
        .slice(0, 60);
      attachments.push({ filename: `${safe}.${ext}`, content: buf });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: config.params.contact_email,
      replyTo: get("email"),
      subject: `Job application — ${get("firstName")} ${get("lastName")} (${get("role")})`,
      html: `
        <h2>New job application</h2>
        <p><strong>Name:</strong> ${esc(get("firstName"))} ${esc(get("lastName"))}</p>
        <p><strong>Email:</strong> ${esc(get("email"))}</p>
        <p><strong>Phone:</strong> ${esc(get("phone"))}</p>
        <p><strong>Postcode:</strong> ${esc(get("postcode"))}</p>
        <p><strong>Role:</strong> ${esc(get("role"))}</p>
        <p><strong>Availability:</strong> ${esc(get("availability"))}</p>
        <p><strong>Right to work in UK:</strong> ${get("rightToWork") === "true" ? "Yes" : "Not stated"}</p>
        <p><strong>Driver:</strong> ${get("driver") === "true" ? "Yes" : "Not stated"}</p>
        <p><strong>Experience:</strong></p>
        <p>${esc(get("experience")).replace(/\n/g, "<br>")}</p>
        <p><strong>CV attached:</strong> ${hasCv ? "Yes" : "No"}</p>
        <hr>
        <p style="color:#666;font-size:12px">Sent from the Kare Plus Rugby website at ${new Date().toISOString()}</p>
      `,
      attachments,
    });
  } catch (err) {
    console.error(`[apply] send failed: ${err.message}`);
    return NextResponse.json(
      { error: "We could not send your application. Please email us instead." },
      { status: 502 }
    );
  }

  console.info(`[apply] role="${get("role")}" cv=${hasCv ? "yes" : "no"} delivered=true`);
  return NextResponse.json({ ok: true, delivered: true });
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed." },
    { status: 405, headers: { Allow: "POST" } }
  );
}
