import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import nodemailer from "nodemailer";
import config from "@config/config.json";

const messagesFile = path.join(process.cwd(), "data", "messages.json");

async function readMessages() {
  try {
    const data = await fs.readFile(messagesFile, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

async function writeMessages(messages) {
  await fs.mkdir(path.dirname(messagesFile), { recursive: true });
  await fs.writeFile(messagesFile, JSON.stringify(messages, null, 2));
}

async function sendEmail(msg) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
    <h2>New Contact Message</h2>
    <p><strong>Name:</strong> ${msg.name}</p>
    <p><strong>Email:</strong> ${msg.email}</p>
    <p><strong>Phone:</strong> ${msg.phone || ""}</p>
    <p><strong>Subject:</strong> ${msg.subject || ""}</p>
    <p><strong>Type:</strong> ${msg.type || ""}</p>
    <p>${msg.message}</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: config.params.contact_email,
    subject: msg.subject ? `Contact: ${msg.subject}` : "Contact Form Message",
    html,
  });
}

export async function GET() {
  const messages = await readMessages();
  return NextResponse.json(messages);
}

export async function POST(req) {
  const form = await req.formData();
  const msg = {
    name: form.get("name") || "",
    email: form.get("email") || "",
    phone: form.get("phone") || "",
    subject: form.get("subject") || "",
    message: form.get("message") || "",
    type: form.get("type") || "",
    date: new Date().toISOString(),
  };

  // Best effort only. On Netlify the filesystem is ephemeral and read-only,
  // so this write usually fails or is wiped on the next deploy. Email is the
  // real delivery path — never let a failed write lose the enquiry.
  try {
    const messages = await readMessages();
    messages.push({ id: Date.now(), ...msg });
    await writeMessages(messages);
  } catch (err) {
    console.error("Could not persist message to disk", err);
  }

  try {
    await sendEmail(msg);
  } catch (err) {
    // Previously this was swallowed, so a misconfigured EMAIL_USER/EMAIL_PASS
    // showed the visitor a thank-you page while the enquiry went nowhere.
    console.error("Contact email failed to send", err);
    return new NextResponse(
      "Sorry — we could not send your message. Please call us or email us directly.",
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }

  // Must be absolute: NextResponse.redirect rejects a relative URL.
  // 303 turns the POST into a GET so the browser does not re-post to /thank-you.
  return NextResponse.redirect(new URL("/thank-you", req.url), 303);
}
