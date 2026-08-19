import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import nodemailer from "nodemailer";
import config from "@config/config.json";

const dataRequestsFile = path.join(process.cwd(), "data", "data-requests.json");

async function readDataRequests() {
  try {
    const data = await fs.readFile(dataRequestsFile, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

async function writeDataRequests(requests) {
  await fs.mkdir(path.dirname(dataRequestsFile), { recursive: true });
  await fs.writeFile(dataRequestsFile, JSON.stringify(requests, null, 2));
}

async function sendEmail(formData) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
    <h2>New Data Request Submission</h2>
    <p><strong>Name:</strong> ${formData.name}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Phone:</strong> ${formData.phone || "Not provided"}</p>
    <p><strong>Request Type:</strong> ${formData.requestType}</p>
    <p><strong>Additional Information:</strong> ${formData.additionalInfo || "None provided"}</p>
    <p><strong>Proof of Identity:</strong> ${formData.identification || "Not provided"}</p>
    <p><strong>Consent Given:</strong> ${formData.consent ? "Yes" : "No"}</p>
    <p><strong>Submission Date:</strong> ${new Date().toLocaleString("en-GB")}</p>
    <p><strong>Request ID:</strong> DR-${Date.now()}</p>

    <div style="background-color: #F1F6FD; padding: 15px; margin: 20px 0; border-left: 4px solid #12469B;">
      <h3 style="color: #12469B; margin-top: 0;">UK GDPR Compliance Notice</h3>
      <p style="margin-bottom: 10px;"><strong>Response Deadline:</strong> 30 days from submission date</p>
      <p style="margin-bottom: 10px;"><strong>Required Actions:</strong></p>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Verify the identity of the requester</li>
        <li>Locate and review all relevant personal data</li>
        <li>Prepare response within statutory timeframe</li>
        <li>Consider any exemptions or restrictions</li>
        <li>Document the request and response process</li>
      </ul>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    // GDPR requests carry a 30-day statutory deadline, so they must reach a
    // monitored inbox. Set PRIVACY_EMAIL in Netlify to route them somewhere
    // dedicated; otherwise they fall back to the main contact address.
    to: process.env.PRIVACY_EMAIL || config.params.contact_email,
    subject: `Data Request - ${formData.requestType} - ${formData.name}`,
    html,
  });
}

export async function GET() {
  const requests = await readDataRequests();
  return NextResponse.json(requests);
}

export async function POST(req) {
  try {
    const formData = await req.json();

    const request = {
      id: `DR-${Date.now()}`,
      name: formData.name || "",
      email: formData.email || "",
      phone: formData.phone || "",
      requestType: formData.requestType || "",
      additionalInfo: formData.additionalInfo || "",
      identification: formData.identification || "",
      consent: formData.consent || false,
      status: "pending",
      submissionDate: new Date().toISOString(),
      responseDeadline: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      ).toISOString(), // 30 days
    };

    // Save to file
    const requests = await readDataRequests();
    requests.push(request);
    await writeDataRequests(requests);

    // Send email notification
    try {
      await sendEmail(formData);
    } catch (err) {
      console.error("Email failed", err);
      return NextResponse.json(
        { error: "Request saved but email notification failed" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      requestId: request.id,
      message:
        "Your data request has been submitted successfully. We will respond within 30 days as required by UK GDPR.",
    });
  } catch (error) {
    console.error("Data request submission error", error);
    return NextResponse.json(
      { error: "Failed to process data request" },
      { status: 500 },
    );
  }
}
