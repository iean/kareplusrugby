import PDFDocument from "pdfkit";

/**
 * PDF of one completed reference. RECRUITMENT-SPEC.md Phase 4.
 *
 * Kept separate from the application PDF because it is a different document
 * with a different audience and a different retention question: a reference
 * contains a third party's opinion about the applicant, and in the flagged
 * case it can contain a safeguarding disclosure.
 *
 * A flagged reference says so at the top, in words, not just in the email
 * subject. The PDF outlives the email thread it arrived in.
 */

// Control characters (C0/C1) except tab and newline, and bidirectional
// overrides. Written as \u escapes rather than literal characters so this file
// stays plain text - with the literals in place, grep and other tools treat the
// source as binary and silently skip it.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;
const BIDI_OVERRIDES = /[\u202A-\u202E\u2066-\u2069\u200E\u200F]/g;

const clean = (v) =>
  v === null || v === undefined
    ? ""
    : String(v).replace(CONTROL_CHARS, "").replace(BIDI_OVERRIDES, "").trim();

export async function buildReferencePdf({ referee, applicant, applicationReference, compress = true }) {
  const r = referee.response || {};
  const isCharacter = referee.kind === "character";

  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
    compress,
    info: {
      Title: `Reference for ${clean(applicant.fullName)} - ${applicationReference}`,
      Author: "Kare Plus Rugby website",
    },
  });

  const chunks = [];
  doc.on("data", (c) => chunks.push(c));
  const done = new Promise((resolve) => doc.on("end", () => resolve(Buffer.concat(chunks))));

  const H1 = (t) =>
    doc.moveDown(0.8).fontSize(15).fillColor("#0E3F89").font("Helvetica-Bold").text(t).moveDown(0.3);
  const row = (label, value) => {
    const v = clean(value);
    if (!v) return;
    doc.fontSize(10).font("Helvetica-Bold").fillColor("#333333").text(`${label}: `, { continued: true });
    doc.font("Helvetica").fillColor("#000000").text(v);
  };
  const para = (t) => doc.fontSize(10).font("Helvetica").fillColor("#000000").text(clean(t));
  const note = (t) =>
    doc.fontSize(9).font("Helvetica-Oblique").fillColor("#666666").text(t).fillColor("#000000");

  /* -------- header -------- */
  doc.fontSize(19).font("Helvetica-Bold").fillColor("#0E3F89")
    .text(isCharacter ? "Character reference" : `Professional reference ${referee.position}`);
  doc.fontSize(11).font("Helvetica").fillColor("#000000")
    .text(`For ${clean(applicant.fullName)} - application ${applicationReference}`);
  doc.fontSize(10).fillColor("#666666")
    .text(`Given by ${clean(referee.name)} on ${new Date(referee.completed_at || Date.now()).toLocaleString("en-GB")}`);
  doc.fillColor("#000000");

  /* -------- the flag, unmissable -------- */
  if (referee.flagged) {
    doc.moveDown(0.8);
    const y = doc.y;
    doc.rect(50, y - 6, 495, 46).fill("#FDECEA");
    doc.fillColor("#B3261E").fontSize(12).font("Helvetica-Bold")
      .text("REQUIRES REVIEW BEFORE ANY OFFER", 58, y + 2);
    doc.fontSize(9).font("Helvetica")
      .text(
        "This referee reported a safeguarding concern, a reason this person should not work with vulnerable adults, or that they would not re-employ them. Read the answers below in full.",
        58,
        doc.y + 2,
        { width: 480 },
      );
    doc.fillColor("#000000").moveDown(1.2);
  }

  /* -------- who gave it -------- */
  H1("About the referee");
  row("Name", referee.name);
  row("Job title", r.refereeJobTitle || referee.job_title);
  row("Organisation", referee.organisation);
  row("Email the request was sent to", referee.email);
  row("Phone given by the applicant", referee.phone);
  if (!isCharacter) {
    row("Confirmed authorised to give this reference", r.authorised === true || r.authorised === "Yes" ? "Yes" : "No");
  }

  /* -------- the reference -------- */
  if (isCharacter) {
    H1("The reference");
    row("How long they have known the applicant", r.howLongKnown);
    row("In what capacity", r.capacity);
    row("Confirmed not a friend or family member", r.notFamily === true || r.notFamily === "Yes" ? "Yes" : "No");
    H1("Honesty, reliability and suitability for care work");
    para(r.suitability || "No comment given.");
  } else {
    H1("Employment confirmed");
    row("Job title", r.jobTitle);
    row("Employment dates", r.employmentDates);
    row("Reason for leaving", r.reasonForLeaving);
    row("Confirms what the applicant told us", r.detailsMatch);

    H1("Conduct and performance");
    row("Would you re-employ this person?", r.wouldReEmploy);
    row("Reliability and attendance", r.reliability);
    if (r.reliabilityComment) row("Comment", r.reliabilityComment);
  }

  /* -------- safeguarding, always present -------- */
  H1("Safeguarding");
  row(
    isCharacter
      ? "Any reason this person should not work with vulnerable adults?"
      : "Aware of safeguarding concerns, disciplinary action, or any reason this person should not work with vulnerable adults?",
    isCharacter ? r.anyReasonNotToWork : r.safeguardingConcerns,
  );
  const detail = isCharacter ? r.anyReasonDetail : r.safeguardingDetail;
  if (detail) {
    doc.moveDown(0.2);
    row("Details given", "");
    para(detail);
  }

  /* -------- free text -------- */
  H1("Anything else the referee wanted to add");
  para(r.comments || "Nothing further was added.");

  doc.moveDown(1);
  note(
    "Collected through the Kare Plus Rugby website using a single-use link sent to the referee. " +
      "Contains personal data about both the applicant and the referee - handle in line with the " +
      "recruitment privacy notice.",
  );

  doc.end();
  return done;
}
