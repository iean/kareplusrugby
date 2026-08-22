# Recruitment system spec — Kare Plus Rugby

Read this file completely before writing any code. This supersedes section 3a of
`WEBSITE-WORK-PLAN.md`. All Hard Rules in that file still apply.

Build this in the phases below. Stop at the end of each phase, run the checks,
and commit. Do not build phases 3 and 4 until phase 2 works end to end.

---

## What this is

A job application system for a CQC-registered care provider recruiting in
**Coventry, Rugby, Leicester and Northampton**.

It must satisfy Schedule 3 of the Health and Social Care Act 2008 (Regulated
Activities) Regulations 2014, which requires for each care worker: a full
employment history with written explanations of any gaps, and satisfactory
evidence of conduct in previous health or social care employment.

That regulation is why the employment history and reference sections below are
strict. Do not simplify them.

---

## Critical constraints

### This system stores personal data
Unlike the other forms on this site, this one persists data — the reference loop
is impossible without it. That means:

- A database on the VPS. Use **SQLite via better-sqlite3** unless I say otherwise:
  single server, low volume, trivial to back up. Store the file outside the web
  root and outside the repo.
- Uploaded files stored outside the web root and never publicly servable. Serve
  them only through an authenticated route. Never commit them.
- Add the database file, the upload directory and any `.env` to `.gitignore`
  before writing a single row. Verify with `git status`.
- Automatic deletion of unsuccessful applications after **6 months**. Build the
  deletion job at the same time as the storage, not later.

### Data minimisation — do NOT collect at application stage
Do not ask for, and do not build fields for: National Insurance number, date of
birth, passport or visa document uploads, DBS certificate number, bank details,
photographs, nationality, ethnicity, health conditions, or criminal record
detail. All of that belongs at offer stage, collected through a secure channel,
not a public web form. If you think one is needed, add a `TODO:` and ask me.

### Right to work
The form collects a **declaration only**. Add visible text near that field:
this is not a right to work check and a full Home Office check will be carried
out before employment. Never label it, name it, or store it as a completed check.

---

## Phase 1 — Jobs page

Route: `/careers`

- Vacancies driven by markdown files in `content/vacancies/` so they can be added
  without touching code. Each file: title, location, role type, hours, closing
  date, description. Create the structure and one example clearly marked EXAMPLE.
- Filter by location: Coventry, Rugby, Leicester, Northampton.
- Prominent "Apply now" button on each vacancy and one general application route
  for people not matching a specific vacancy.
- Must work at 375px width and at 200% zoom.

---

## Phase 2 — The application form

Route: `/careers/apply` — multi-step, one section per screen, progress indicator.

**Save and resume is mandatory.** This form is long and most applicants are on a
phone. Save progress server-side after each step, keyed to their email, and email
them a resume link. Losing a half-finished application loses you the candidate.

### Section 1 — About you
Full name, preferred name, email, mobile, town/city, postcode.
(Full address is not needed at this stage.)

### Section 2 — The role
- Which location(s) they can work: Coventry / Rugby / Leicester / Northampton (multi-select)
- Which role they're applying for (pull from vacancies, plus "general application")
- Full time / part time / bank / flexible
- Hours per week they want: under 16 / 16–24 / 25–34 / 35+ / flexible
- Do you have a full UK driving licence? yes / no
- Do you have access to your own vehicle? yes / no

### Section 3 — Eligibility (declarations)
- Do you have the right to work in the UK? yes / no / prefer to discuss
  (with the disclaimer text described above)
- Do you have an enhanced DBS certificate? yes / no / applied for
- Is it registered on the DBS Update Service? yes / no / not sure
  (show only if the previous answer is yes)
- Are you willing to undergo an enhanced DBS check? yes / no

### Section 4 — Availability
- A grid: Monday–Sunday across, and Morning / Afternoon / Evening / Night down.
  Checkboxes. Must be fully keyboard operable and screen-reader labelled — a
  naked checkbox grid is an accessibility trap, so label every cell properly.
- How far ahead can you confirm your availability?
  fixed weekly pattern / a week at a time / two weeks at a time / month at a time / varies
- Any fixed commitments we should know about? (free text, e.g. school runs, study days)
- Earliest start date.

### Section 5 — Employment history (last 5 years)
Repeatable block, newest first: employer name, job title, start month/year,
end month/year (or "current"), reason for leaving, was this a health or social
care role? yes/no.

**Gap detection is required.** After each block is entered, calculate gaps
between the end of one role and the start of the next. Any gap over **4 weeks**
must trigger a required explanation field for that specific gap. Also check for a
gap between the most recent end date and today. Do not let them submit with an
unexplained gap — show clearly which gap needs explaining and why.

### Section 6 — Qualifications and certificates
- Free-text list of qualifications
- Multiple file upload: PDF, JPG, PNG, DOC, DOCX. 5MB per file, 25MB total,
  10 files max. Validate the actual file type by magic bytes, not just extension.
- CV upload (optional but encouraged)

### Section 7 — References
Three referees required.

**Two professional referees:**
- Name, job title, organisation, work email, phone, relationship to applicant,
  dates they worked together
- The most recent one must be their current or most recent employer. If their most
  recent role was in health or social care, at least one professional referee
  must be from that employer. Enforce this against what they entered in Section 5.
- **Work email validation:** reject free email providers (gmail, googlemail,
  hotmail, outlook, live, msn, yahoo, ymail, icloud, me.com, aol, gmx, mail.com,
  proton, protonmail, zoho, yandex). Show a clear, non-accusatory message
  explaining we need a work email address so we can verify the reference.

**One character referee:**
- Name, how they know the applicant, how long they've known them, email, phone
- Required checkbox: "I confirm this person is not a friend or family member"
- Explanatory text: a character referee should be someone who knows you in a
  responsible capacity — a tutor, a volunteer coordinator, a former colleague,
  a community or faith leader.

**Validation across all three:**
- All three emails must be different from each other
- None may match the applicant's own email
- Flag if a referee email domain matches the applicant's email domain

### Section 8 — Declarations
- Confirmation that the information is true and complete
- Consent to contact the referees named
- Link to the privacy notice, with a short summary of what happens to their data
  and how long it's kept
- Do not bundle these into one checkbox. Separate consent from confirmation.

### Section 9 — Review
Show everything back to them on one page, with an edit link per section, before
they can submit. This is not optional — it is the main defence against errors in
a form this long.

---

## Phase 3 — What happens on submit

In this order:

1. Save the complete application to the database with status `submitted`.
2. **Generate a PDF** containing every answer, laid out clearly with section
   headings, plus a list of attached files. Use `pdfkit` — do not install
   puppeteer or headless Chrome on this VPS. Include the reference section
   showing all three referees and their status as "awaiting response".
3. **Email the recruitment inbox**: the PDF attached, plus every uploaded
   certificate and CV attached. Subject line should include applicant name,
   role and location. `TODO:` — I will give you the recruitment email address.
4. **Email the applicant** a confirmation: what happens next, roughly how long,
   that their referees are being contacted now, and who to contact with questions.
   Attach their PDF so they have a copy.
5. **WhatsApp notification** — see Phase 5. Content must be exactly: a new
   application has been received, the role, the location, and nothing else.
   No name, no contact details, no personal data of any kind.
6. Trigger the reference emails (Phase 4).

If any step after step 1 fails, the application must still be saved and the
failure logged and reported. Never lose a submission because an email bounced.

---

## Phase 4 — The reference loop

This is the part most likely to go wrong. Build it carefully.

### Sending
- Generate a cryptographically random token per referee (`crypto.randomBytes(32)`).
  Store only a hash of it. Expiry: 30 days.
- Email each referee a unique link: `/reference/[token]`
- The email must explain: who named them, which company is asking, why, what the
  role involves, roughly how long the form takes, and how to decline.
- **GDPR Article 14 applies.** The referee did not give you their data — the
  applicant did. The email must tell them where their details came from and link
  to the privacy notice. This is a legal requirement, not a nicety.

### The reference form
No login. The token is the authentication. Keep it short — a long form gets
abandoned and you get no reference.

**Professional reference:**
- Confirm applicant's job title, employment dates, reason for leaving
- Would you re-employ this person? yes / no / with reservations
- Reliability and attendance: brief rating plus optional comment
- Are you aware of any safeguarding concerns, disciplinary action, or any reason
  this person should not work with vulnerable adults? yes / no, with a required
  free-text box if yes
- Free-text comments
- Referee's name, job title and confirmation they are authorised to give this reference

**Character reference:**
- How long and in what capacity they have known the applicant
- Confirm they are not a friend or family member
- Comment on honesty, reliability and suitability for care work
- Any reason this person should not work with vulnerable adults? yes / no + free text
- Free-text comments

### On reference submission
1. Save, mark that referee `completed`, timestamp it.
2. Generate a PDF of that reference.
3. Email it to the recruitment inbox, subject naming the applicant and which
   reference it is (professional 1 / professional 2 / character).
4. Invalidate the token — one use only.
5. If a reference contains a safeguarding or "would not re-employ" answer, flag
   it clearly in the email subject line so it cannot be missed in a busy inbox.
6. When all three are in, email the recruitment inbox a completion summary with
   all three PDFs attached.

### Chasing
- Automatic reminder to any referee who hasn't responded after 5 days, and again
  after 10 days. Stop after two reminders.
- Weekly digest email to the recruitment inbox listing applications with
  outstanding references and how long they've been waiting.

### Status
Build a simple password-protected page at `/careers/status` listing applications
and their reference progress. Basic HTTP auth or a single shared password in an
environment variable is acceptable for now — but never commit the password, and
put a `TODO:` telling me to change it. If you think this needs to be more
robust, say so in your notes rather than over-engineering it now.

---

## Phase 5 — Email and WhatsApp delivery

### Email — do this before anything else in phases 3 and 4
Sending from the VPS directly will land in spam and the reference loop will
silently fail. Required:
- Send through a real transactional provider or the company's existing mail
  provider over authenticated SMTP. Do not send unauthenticated from the server.
- `TODO:` — I will supply SMTP credentials. Read them from environment variables
  only. Never hardcode. Never commit.
- Tell me exactly what SPF, DKIM and DMARC DNS records need to exist on
  `kareplusrugby.co.uk`, written plainly enough that I can hand them to whoever
  manages the domain.
- Build a test route I can hit to send a test email to myself and confirm
  delivery before we rely on it.

### WhatsApp
- Requires Meta Cloud API or Twilio, with a pre-approved template message.
- Implement it behind a feature flag, default **off**, so the rest works without it.
- `TODO:` — ask me which provider before writing any of it.
- The message contains no personal data. It is a doorbell, not a report.

---

## Phase 6 — Security and data protection

- Rate limit submissions per IP and per email address.
- Honeypot field. No third-party CAPTCHA without asking me.
- Server-side validation of every field. Never trust the client.
- Sanitise all input before it reaches the PDF generator or an email body.
- Uploaded files: validate real type by magic bytes, cap size, generate a random
  stored filename, never execute, never serve from a public path.
- All application routes over HTTPS only.
- Write a `PRIVACY-RECRUITMENT.md` draft covering: what is collected, why, the
  lawful basis, how long it is kept, who it is shared with, referee data and
  where it came from, and how to request deletion. Mark it clearly as a draft
  for me to have reviewed — do not publish it as final.
- Add a data deletion route so an applicant can request removal.
- Write down, in your notes, everything about this system that you think needs a
  human decision on data protection. Be thorough. I would rather have a long list.

---

## Phase 7 — Re-check, repeatedly

Run every pass fully. Record the result of each in `OVERNIGHT-NOTES.md`,
including passes where you find nothing.

**Pass 1 — Build.** `npm run build` and `npm run lint`, zero errors.

**Pass 2 — Leakage.** Run `git status` and confirm no database file, no uploaded
file, no `.env`, no credential and no test personal data is tracked. Check
`.gitignore` covers all of them. This pass matters more than any other.

**Pass 3 — End to end, twice.** Submit a complete test application yourself.
Confirm: it saves, the PDF generates and contains every answer, the office email
arrives with all attachments, the applicant confirmation arrives, and all three
referee emails send. Then open each referee link, submit each reference form, and
confirm each PDF arrives and each token is invalidated. Do it a second time with
deliberately awkward input: apostrophes in names, a 4-month employment gap, a
gmail address in a professional referee field, an oversized upload, a duplicate
referee email. Report what broke.

**Pass 4 — Regulation.** Re-read the Schedule 3 requirements at the top of this
file. Confirm the form genuinely captures full 5-year history, forces explanation
of every gap over 4 weeks, and obtains conduct evidence from the most recent
care employer. List anything it does not fully satisfy.

**Pass 5 — Data minimisation.** Re-read the "do NOT collect" list. Search the
whole system for any of those fields creeping in. Remove any you find.

**Pass 6 — Accessibility.** Full keyboard run through every step of the form
with no mouse. Then the availability grid specifically with a screen reader —
that grid is the highest-risk component on the site. Then at 200% zoom. Then at
375px width. Fix what you find.

**Pass 7 — Three readers.** Re-read as: a 22-year-old with no care experience on
a phone with patchy signal; a 50-year-old returning to work after 3 years caring
for a relative, who will hit the gap-explanation logic; a busy ward manager
giving a reference in 3 minutes between shifts. Fix what each exposes.

**Pass 8 — Failure modes.** Deliberately break things: kill the SMTP connection
mid-submit, submit with the database locked, use an expired token, use a token
twice, upload a file with a fake extension. Confirm nothing is lost and every
failure produces a clear message rather than a blank screen.

**Pass 9 — Final build and full end-to-end run one more time.**

---

## Phase 8 — Report

Write `OVERNIGHT-NOTES.md` with, in this order:

1. **Every `TODO:` and every decision you need from me**, with file and line.
2. Everything you could not complete, and why.
3. Every data protection question you flagged in Phase 6.
4. The exact DNS records needed for email delivery.
5. What you built, by phase, with commit hashes.
6. Results of all nine re-check passes.
7. What you would do next.

Then stop. Do not merge. Do not push to `main`.

---

## Ask me, don't guess

- The recruitment email address
- SMTP credentials and provider
- WhatsApp provider, if any
- The real job vacancies for each of the four locations
- Whether 6 months is the right retention period for you
- Whether you want salary or hourly rates published on vacancies
- Whether a general application (no specific vacancy) should be allowed
- Who reviews and signs off the privacy notice
