# DRAFT — Recruitment privacy notice

> **This is a draft written by Claude for Alif to have reviewed. It is not
> legal advice and it must not be published as-is.**
>
> It needs review by someone competent in UK data protection — ideally whoever
> advises Kare Plus Rugby on GDPR, or the franchise's data protection contact —
> before it goes on the website. Several points below are marked
> **[DECISION NEEDED]** because they depend on facts only Alif knows.
>
> RECRUITMENT-SPEC.md Phase 6 asks for exactly this: a draft, clearly marked as
> a draft, covering what is collected, why, the lawful basis, how long it is
> kept, who it is shared with, referee data and where it came from, and how to
> request deletion.

---

## Who we are

Divergent Healthcare Limited, trading as Kare Plus Rugby. Registered in England
and Wales, company number 14277673. Registered office: 6a Davy Court, Castle
Mound Way, Central Park, Rugby, Warwickshire, CV23 0UZ.

We are the **data controller** for the information described here.

- Email: kp.rugby@kareplus.co.uk
- Phone: 01788 422422

**[DECISION NEEDED]** ICO registration number. Every organisation processing
personal data of this kind normally has to be registered with the Information
Commissioner's Office and pay the data protection fee. `config/site.json` has
had `ico_registration` as a `[TODO]` placeholder since before this work began.
If the registration exists, put the number here. If it does not, it needs to.

**[DECISION NEEDED]** Whether a Data Protection Officer is required. A DPO is
mandatory where an organisation carries out large-scale processing of special
category data. A care provider handling health data may cross that line. Worth
one conversation with an adviser.

---

## What we collect when you apply

### Information you give us

- **About you:** name, preferred name, email address, mobile number, town or
  city, postcode.
- **The role:** which locations you can work in, which role you want, contract
  type, hours, whether you drive and have a vehicle.
- **Eligibility declarations:** whether you have the right to work in the UK,
  whether you hold an enhanced DBS certificate, whether it is on the Update
  Service, and whether you are willing to undergo a check.
- **Availability:** which days and shifts you can work, how far ahead you can
  confirm, any fixed commitments you tell us about, your earliest start date.
- **Employment history:** the last five years — employers, job titles, dates,
  reasons for leaving, and whether each role was in health or social care.
- **Explanations of any gaps** longer than four weeks.
- **Qualifications**, and any certificates or CV you upload.
- **Your referees:** three people's names, contact details and your
  relationship to them.

### What we deliberately do NOT ask for at application stage

We do not collect, and the form has no field for: National Insurance number,
date of birth, passport or visa documents, DBS certificate number, bank
details, photographs, nationality, ethnicity, health conditions, or criminal
record detail.

If we offer you a job we will need some of those, and we will collect them
securely then — not through a web form.

### Information we generate

An application reference, timestamps, and a PDF of your application.

---

## Why we collect it, and our lawful basis

| What | Why | Lawful basis (UK GDPR) |
|---|---|---|
| Your application | To decide whether to offer you work | **Article 6(1)(b)** — steps taken at your request before entering a contract |
| Employment history, gap explanations, references | Because the law requires it for care roles | **Article 6(1)(c)** — legal obligation |
| Right to work and DBS declarations | To check we can lawfully employ you | **Article 6(1)(c)** — legal obligation |
| Keeping your details on file if you are not successful | So we can contact you about future roles | **Article 6(1)(f)** — legitimate interests |

The legal obligation is **Schedule 3 of the Health and Social Care Act 2008
(Regulated Activities) Regulations 2014**, which requires us to obtain, for
every care worker, a full employment history with written explanations of any
gaps, and satisfactory evidence of conduct in previous health or social care
employment. That is why the employment and reference sections are as thorough
as they are.

**[DECISION NEEDED] — special category data.** A reference can contain health
information (for example, a referee explaining an absence). Health data is
special category data under Article 9 and needs a *second* lawful basis, most
likely **Article 9(2)(b)** — employment, social security and social protection
law — supported by an **Appropriate Policy Document**, which the DPA 2018
requires and which we do not currently have. This needs an adviser's input.

---

## Your referees — where their details came from

If you have been asked for a reference: **the applicant gave us your name and
email address.** We did not obtain them from anywhere else.

This is what **Article 14** requires us to tell you, and the email you receive
says it too. We use your details only to ask for and record that one reference.
We do not add you to anything, and we do not contact you again after you
respond or decline.

What we keep from you: your name, job title, organisation, the email address we
wrote to, your answers, and whether you declined. We keep it with the
application it belongs to and delete it on the same schedule.

If you would rather not give a reference, the link in the email lets you say so
and we stop asking.

---

## How long we keep it

| Situation | Retention |
|---|---|
| Application not successful | **6 months** from submission, then deleted automatically |
| Application successful | Moves into your employment file, kept under our employment records policy |
| Part-finished application never submitted | Deleted on the same 6-month schedule |
| References | Deleted with the application they belong to |

Deletion is automatic — a scheduled job removes applications past their date,
and the deadline is recorded on each application when it is created rather than
worked out later.

**[DECISION NEEDED]** Is 6 months right? It is what the spec asked for and it
is a common choice, but 6 to 12 months is the usual range. Longer means more
candidates to draw on; shorter means less data to hold. The Equality Act
provides a 6-month window for discrimination claims, which is an argument for
at least 6 months.

**[DECISION NEEDED] — the email problem, and it is a real one.** Applications
and references are emailed to kp.rugby@kareplus.co.uk with PDF attachments.
**Deleting the database record does not delete those emails.** Unless someone
clears that mailbox on a schedule, personal data will persist there
indefinitely and the retention policy above will be true of the website and
untrue of the business. This needs either a mailbox retention rule or a
documented manual process.

---

## Who we share it with

- **Your referees** — they are told your name and the role you applied for, so
  they can give a reference. Nothing else from your application is shared.
- **Our recruitment team**, who read applications and references.
- **Our hosting and email providers**, who process data on our behalf under
  contract.

We do not sell your data, and we do not share it for marketing.

**[DECISION NEEDED]** This notice should name the processors — the hosting
provider, the database provider and the email provider — and confirm a data
processing agreement is in place with each. Some of that is not yet decided.

**[DECISION NEEDED]** Whether any provider stores data outside the UK or EEA.
If so, this notice must say so and name the safeguard relied on.

---

## Your rights

You can ask us to:

- give you a copy of what we hold about you
- correct anything wrong
- delete it
- restrict or object to how we use it
- give you your data in a portable form

**To delete your application yourself:** use the deletion form on our website
with your application reference and the email address you applied with. It is
deleted immediately and we email you to confirm.

For anything else, email kp.rugby@kareplus.co.uk or call 01788 422422. We
respond within one month.

If you are unhappy with how we have handled your data you can complain to the
Information Commissioner's Office at ico.org.uk or on 0303 123 1113.

---

## How we protect it

- Everything is sent over an encrypted connection (HTTPS).
- Applications are stored in a database that is not publicly reachable.
- Uploaded files are checked to confirm they are genuinely the type they claim
  to be, are stored under a randomly generated name, and are never served from
  a public web address.
- Reference links are single-use, expire after 30 days, and only a hash of each
  one is stored — so even we cannot reconstruct a link from our own records.
- The recruitment status page is password-protected.

**[DECISION NEEDED]** The status page uses a single shared password. That is
workable for a small team but cannot tell you *who* looked at an application,
and cannot be revoked for one person without changing it for everyone. For a
page showing candidate names alongside safeguarding flags, per-user logins with
an access log would be better.

---

## Automated decision-making

We do not make automated decisions about you. Every application is read by a
person. The form checks things like employment gaps and referee email addresses
so it can prompt you, but it does not score, rank or reject anyone.

---

## Changes

If we change this notice we will update it here.

Last drafted: 23 August 2026. **Not yet reviewed or approved.**
