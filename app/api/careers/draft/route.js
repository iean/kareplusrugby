import { NextResponse } from "next/server";
import { getOrCreateDraft, saveStep, resolveResumeToken, issueResumeToken } from "@lib/recruitment/store";
import { isDatabaseConfigured, databaseKind } from "@lib/recruitment/db";
import { rateLimit } from "@lib/rateLimit";
import { EMAIL_RE } from "@lib/recruitment/validation";

/**
 * Save-and-resume for the job application.
 *
 * POST { email, step, answers }        -> creates or updates the draft
 * POST { token }                       -> resumes an existing draft
 *
 * RECRUITMENT-SPEC.md makes save-and-resume mandatory: the form is long and
 * most applicants are on a phone, so progress is written after every step.
 *
 * This route deliberately returns 503 rather than pretending to save when no
 * database is configured. Accepting a step and dropping it would be the same
 * failure that was removed from this codebase earlier — routes that wrote to a
 * filesystem that was never writable — and here it would silently discard a
 * part-finished application.
 */

// Answers are merged server-side, so a single step's payload is small. This
// ceiling is generous for a step and still stops a client posting megabytes.
const MAX_ANSWERS_BYTES = 128 * 1024;

function unavailable() {
  console.error(
    `[apply-draft] NOT SAVED: no database configured (kind=${databaseKind()})`,
  );
  return NextResponse.json(
    {
      error:
        "We cannot save your progress at the moment, so we have not started an application. Please call us on 01788 422422 and we will take your details another way.",
    },
    { status: 503 },
  );
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: no human ever fills this.
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const limit = rateLimit(req, { max: 60, windowMs: 10 * 60 * 1000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  if (!isDatabaseConfigured() && process.env.NODE_ENV === "production") {
    return unavailable();
  }

  try {
    // --- resume an existing application -------------------------------
    if (body.token) {
      const app = await resolveResumeToken(body.token);
      if (!app) {
        return NextResponse.json(
          {
            error:
              "That link has expired or has already been used. Start a new application, or call us and we will help.",
          },
          { status: 404 },
        );
      }
      return NextResponse.json({
        ok: true,
        applicationId: app.id,
        reference: app.reference,
        email: app.email,
        step: app.current_step,
        answers: app.answers,
      });
    }

    // --- start or continue --------------------------------------------
    const email = String(body.email || "").trim();
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Enter an email address in the format name@example.com" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const answers = body.answers && typeof body.answers === "object" ? body.answers : {};
    if (JSON.stringify(answers).length > MAX_ANSWERS_BYTES) {
      return NextResponse.json({ error: "That step was too large to save." }, { status: 413 });
    }

    const draft = await getOrCreateDraft(email);
    const saved = await saveStep(draft.id, Number(body.step) || 0, answers);

    // The resume token is issued once, when the draft is created, and returned
    // so the caller can email it. It is never logged.
    let resumeToken = null;
    if (body.issueResumeLink) {
      resumeToken = (await issueResumeToken(saved.id)).token;
    }

    return NextResponse.json({
      ok: true,
      applicationId: saved.id,
      reference: saved.reference,
      step: saved.current_step,
      ...(resumeToken ? { resumeToken } : {}),
    });
  } catch (err) {
    // Metadata only - never log answers, which are personal data.
    console.error(`[apply-draft] save failed: ${err.message}`);
    return unavailable();
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
