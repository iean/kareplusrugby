import { createTransport, mailFrom, sendToBusiness, MAIL_TO, isMailConfigured } from "@lib/mailer";
import site from "@config/site.json";

/**
 * Emails to and about referees. RECRUITMENT-SPEC.md Phase 4.
 *
 * GDPR ARTICLE 14 APPLIES, and the spec is emphatic that this is a legal
 * requirement rather than a courtesy. The referee did not give us their
 * details — the applicant did — so the first message they receive from us must
 * tell them where their data came from, who we are, why we are contacting
 * them, and where the privacy notice is. All of that is in the email below,
 * near the top, in plain words rather than buried in a footer.
 *
 * It also has to be easy to decline. A referee who cannot find a way out
 * either ignores the email, which stalls the application silently, or replies
 * angrily to a business inbox. Declining is a normal outcome and is offered on
 * the form itself.
 */

const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const BASE = () => (site.seo.base_url || "").replace(/\/$/, "");

const SIGNOFF = `
  <p>Thank you — it genuinely helps someone get into care work.</p>
  <p><strong>${esc(site.business.trading_name)}</strong><br>
  ${esc(site.business.phone)} · ${esc(MAIL_TO)}</p>
`;

/**
 * The Article 14 block. Kept as one function so it cannot drift between the
 * first request and the reminders.
 */
const whereYourDetailsCameFrom = (applicantName) => `
  <div style="background:#F1F6FD;border-left:4px solid #12469B;padding:14px;margin:18px 0">
    <p style="margin:0 0 8px"><strong>Where we got your details</strong></p>
    <p style="margin:0 0 8px">
      ${esc(applicantName)} gave us your name and email address as one of their
      referees when they applied for a job with us. We have not obtained them
      from anywhere else, and we will not use them for anything other than this
      reference request.
    </p>
    <p style="margin:0">
      We keep your response with their application and delete it on the same
      schedule. You can ask us what we hold about you, or ask us to delete it,
      by emailing <a href="mailto:${esc(MAIL_TO)}">${esc(MAIL_TO)}</a>.
      <a href="${BASE()}/privacy-policy">Read our privacy notice</a>.
    </p>
  </div>
`;

function requestBody({ referee, applicantName, role, token, isReminder, reminderNumber }) {
  const link = `${BASE()}/reference/${token}`;
  const isCharacter = referee.kind === "character";

  const chaser = isReminder
    ? `<p style="background:#FEF7E0;border-left:4px solid #A8710A;padding:12px">
         <strong>A reminder.</strong> We asked you about this
         ${reminderNumber === 2 ? "a couple of weeks" : "a few days"} ago and have
         not heard back. If you would rather not give a reference, please use the
         link and choose "I would rather not" — that tells us to stop asking, and
         we will not email you about it again.
       </p>`
    : "";

  return `
    <p>Hello ${esc(referee.name)},</p>
    ${chaser}
    <p>
      <strong>${esc(applicantName)}</strong> has applied for a job with
      ${esc(site.business.trading_name)} as
      <strong>${esc(role || "a care worker")}</strong>, and has named you as
      ${isCharacter ? "a character referee" : "a professional referee"}.
    </p>
    <p>
      We are a care provider registered with the Care Quality Commission. For
      care roles the law requires us to take up references before someone can
      start work, including evidence of conduct in any previous health or social
      care job. That is why we are asking.
    </p>

    ${whereYourDetailsCameFrom(applicantName)}

    <p><strong>What we are asking for</strong></p>
    <ul>
      ${
        isCharacter
          ? `<li>How long and in what capacity you have known them</li>
             <li>Your view of their honesty, reliability and suitability for care work</li>
             <li>Whether you know any reason they should not work with vulnerable adults</li>`
          : `<li>Confirmation of their job title, dates and reason for leaving</li>
             <li>Whether you would re-employ them</li>
             <li>Their reliability and attendance</li>
             <li>Whether you are aware of any safeguarding concern or disciplinary matter</li>`
      }
    </ul>
    <p>It takes about <strong>three minutes</strong>. There is nothing to sign up for.</p>

    <p style="margin:26px 0">
      <a href="${link}"
         style="background:#12469B;color:#ffffff;padding:14px 26px;border-radius:999px;text-decoration:none;font-weight:bold;display:inline-block">
        Give the reference
      </a>
    </p>
    <p style="font-size:13px;color:#555">
      Or paste this into your browser:<br>
      <span style="word-break:break-all">${link}</span>
    </p>
    <p style="font-size:13px;color:#555">
      This link is unique to you, works once, and expires in 30 days.
      <strong>Please do not forward it</strong> — if it has reached the wrong
      person, tell us at <a href="mailto:${esc(MAIL_TO)}">${esc(MAIL_TO)}</a>.
    </p>
    <p style="font-size:13px;color:#555">
      Would rather not? Use the same link and choose "I would rather not give a
      reference". You do not have to give a reason.
    </p>
    ${SIGNOFF}
  `;
}

/** First request to one referee. */
export async function sendReferenceRequest({ referee, applicantName, role, token }) {
  if (!isMailConfigured()) throw new Error("No mail transport configured");
  const transporter = createTransport();
  await transporter.sendMail({
    from: mailFrom(),
    to: referee.email,
    replyTo: MAIL_TO,
    subject: `Reference request for ${applicantName} — ${site.business.trading_name}`,
    html: requestBody({ referee, applicantName, role, token, isReminder: false }),
  });
}

/** Reminder, at 5 and 10 days. Same link, same token. */
export async function sendReferenceReminder({ referee, applicantName, role, token, reminderNumber }) {
  if (!isMailConfigured()) throw new Error("No mail transport configured");
  const transporter = createTransport();
  await transporter.sendMail({
    from: mailFrom(),
    to: referee.email,
    replyTo: MAIL_TO,
    subject: `Reminder: reference request for ${applicantName} — ${site.business.trading_name}`,
    html: requestBody({ referee, applicantName, role, token, isReminder: true, reminderNumber }),
  });
}

/**
 * One completed reference to the recruitment inbox.
 *
 * A flagged reference says so in the SUBJECT LINE. The spec is explicit: it
 * must be impossible to miss in a busy inbox, and by the time someone opens a
 * PDF attachment it is already possible to have skimmed past it.
 */
export async function sendCompletedReference({ referee, applicant, applicationReference, pdf }) {
  const which =
    referee.kind === "character" ? "character reference" : `professional reference ${referee.position}`;

  const subject = referee.flagged
    ? `** REQUIRES REVIEW ** ${which} for ${applicant.fullName} — ${applicationReference}`
    : `${which.charAt(0).toUpperCase() + which.slice(1)} received for ${applicant.fullName} — ${applicationReference}`;

  await sendToBusiness({
    subject,
    html: `
      <h2>${referee.flagged ? "Reference received — REQUIRES REVIEW" : "Reference received"}</h2>
      ${
        referee.flagged
          ? `<p style="background:#FDECEA;border-left:4px solid #B3261E;padding:12px">
               <strong>This referee reported a safeguarding concern, a reason this
               person should not work with vulnerable adults, or that they would
               not re-employ them.</strong> Read the attached reference in full
               before making any offer.
             </p>`
          : ""
      }
      <p><strong>Applicant:</strong> ${esc(applicant.fullName)} (${esc(applicationReference)})</p>
      <p><strong>Reference:</strong> ${esc(which)}</p>
      <p><strong>Given by:</strong> ${esc(referee.name)}${referee.organisation ? `, ${esc(referee.organisation)}` : ""}</p>
      <p>The full reference is attached.</p>
    `,
    attachments: [{ filename: `reference-${applicationReference}-${referee.kind}-${referee.position}.pdf`, content: pdf }],
  });
}

/** All three in: a summary with every PDF attached. */
export async function sendReferenceSetComplete({ applicant, applicationReference, referees, pdfs }) {
  const flagged = referees.filter((r) => r.flagged);
  const declined = referees.filter((r) => r.status === "declined");

  await sendToBusiness({
    subject: flagged.length
      ? `** REQUIRES REVIEW ** All references in for ${applicant.fullName} — ${applicationReference}`
      : `All references in for ${applicant.fullName} — ${applicationReference}`,
    html: `
      <h2>All references are in</h2>
      <p><strong>Applicant:</strong> ${esc(applicant.fullName)} (${esc(applicationReference)})</p>
      ${
        flagged.length
          ? `<p style="background:#FDECEA;border-left:4px solid #B3261E;padding:12px">
               <strong>${flagged.length} of these ${flagged.length === 1 ? "references requires" : "references require"} review before any offer.</strong>
             </p>`
          : ""
      }
      ${
        declined.length
          ? `<p><strong>${declined.length} referee ${declined.length === 1 ? "declined" : "declined"}.</strong>
               For a care role you will need a replacement before this can proceed.</p>`
          : ""
      }
      <ul>
        ${referees
          .map(
            (r) =>
              `<li>${esc(r.name)} — ${esc(r.kind === "character" ? "character" : `professional ${r.position}`)} — <strong>${esc(r.status)}</strong>${r.flagged ? " — REQUIRES REVIEW" : ""}</li>`,
          )
          .join("")}
      </ul>
      <p>Every completed reference is attached.</p>
    `,
    attachments: pdfs,
  });
}

/** Weekly digest of applications still waiting. */
export async function sendWeeklyDigest(rows) {
  if (!rows.length) {
    await sendToBusiness({
      subject: "Recruitment: no outstanding references",
      html: `<h2>Nothing outstanding</h2><p>Every submitted application has all of its references in.</p>`,
    });
    return;
  }

  await sendToBusiness({
    subject: `Recruitment: ${rows.length} application${rows.length === 1 ? "" : "s"} waiting on references`,
    html: `
      <h2>Applications waiting on references</h2>
      <table cellpadding="6" style="border-collapse:collapse" border="1">
        <tr>
          <th align="left">Applicant</th><th align="left">Ref</th><th align="left">Role</th>
          <th align="left">In</th><th align="left">Waiting</th><th align="left">Flagged</th>
        </tr>
        ${rows
          .map(
            (r) => `<tr>
              <td>${esc(r.applicantName)}</td>
              <td>${esc(r.reference)}</td>
              <td>${esc(r.role)}</td>
              <td>${r.completed}/${r.total}${r.declined ? ` (${r.declined} declined)` : ""}</td>
              <td>${r.waitingDays} day${r.waitingDays === 1 ? "" : "s"}</td>
              <td>${r.anyFlagged ? "YES" : ""}</td>
            </tr>`,
          )
          .join("")}
      </table>
      <p style="font-size:13px;color:#555">
        Referees are chased automatically after 5 and 10 days, then not again.
        Anything on this list beyond that needs a phone call.
      </p>
    `,
  });
}
