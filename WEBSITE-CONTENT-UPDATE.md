# Website content update — Kare Plus Rugby

Read this file completely before writing any code.

This works **alongside** `WEBSITE-WORK-PLAN.md` and `RECRUITMENT-SPEC.md`, it does not
replace them. Every Hard Rule in `WEBSITE-WORK-PLAN.md` still applies — especially:
work only on `main-kare-plus`, never merge to `main`, and never invent anything.

The purpose of this file is different from the other two. Those told you *what to build*.
This one tells you *what is true about the company*, so the website finally says it.

---

## Part 1 — Confirmed company facts

Everything in this section has been confirmed by the business owner. Use it freely.
Anything NOT in this section is not confirmed — do not invent it, ask instead.

### Identity
- Legal/trading name: **Kare Plus Rugby**
- Part of the Kare Plus franchise network. Strapline on the logo: **"The Caring Company"**
- Office: 6A Davy Court, Castle Mound Way, Central Park, Rugby, CV23 0UZ
- Phone: **01788 422422**
- CQC status: **"We haven't inspected this service yet."** Do not change, soften, or
  embellish this. Do not add a rating, a star, or a badge.

### Brand colours (taken from the official logo)
- Navy: `#1A3E78` — primary, dominant
- Green: `#A0C080` — accent
- Darker navy for depth: `#112A55`
- Darker green for small text on white: `#6E8F47` (the light green fails contrast at small sizes)
- The site should use these. Replace any leftover template colours.

### What the company actually does — three services
1. **Care home staffing (agency)** — supplying carers to care homes on a temporary/agency basis.
   This is the largest part of the business.
2. **Domiciliary care** — care delivered in people's own homes.
3. **Registered nurse supply** — nurses supplied to care homes and healthcare settings.

The current homepage does not present the business this way. Fix that.

### Recruitment areas
Actively recruiting in: **Coventry, Rugby, Leicester, Northampton.**

### Contacting the office — publish this exactly
- Call **01788 422422**, 9am to 5pm, Monday to Friday
- Outside those hours: **text the same number**
- Only call outside those hours **in an emergency**

This applies to staff. Confirm with me before applying the same wording to
client/family enquiries — a family in crisis may need different guidance.

### Team
- **Julia Lazar** — Registered Manager and Safeguarding Lead
- **Rakib Alif** — Care Coordinator
- **Eva Darkwa** — Care Coordinator

Publish the Registered Manager (normal and expected for a CQC-registered provider).
**Add a `TODO:` asking me to confirm written consent before publishing the two
coordinators' names.** Do not publish photographs of anyone without a `TODO:` first.

### Internal systems — mention only where useful to applicants, never expose
- **OneTouch Health** — staff rostering and scheduling
- **FlexiBee** — staff training platform
- A separate payroll subscription

Do not build rota, timesheet or training features. Those live in the systems above.
The website may link out to them from a staff page, nothing more.

### Local authority adult safeguarding numbers for the areas covered
| Area | Number | Notes |
|---|---|---|
| Rugby & Warwickshire | 01926 412080 | Out of hours 01926 886922 |
| Coventry | 024 7683 3003 | Out of hours 024 7683 2222 |
| Leicester City | 0116 454 1004 | 24 hours |
| Leicestershire County | 0116 305 0004 | Out of hours 0116 305 0888 |
| West Northamptonshire | 0300 126 7000 | |
| North Northamptonshire | 0300 126 3000 | |

Publish these on a safeguarding page. Add a visible line that these numbers can change
and should be verified with the council. Leicester City and Leicestershire County are
**separate authorities** — say so, don't merge them.

### Training and standards the company provides
- Care Certificate for those new to care
- Mandatory refresher training: safeguarding, moving and handling, medication,
  infection control, fire, first aid
- Online training via FlexiBee
- Regular supervision, spot checks, annual appraisal
- Someone reachable on call out of hours

Write these as facts about what staff receive. **Do not** turn them into claims about
every carer being fully trained, DBS-checked or qualified — those are claims about
individuals and need my confirmation first.

---

## Part 2 — Do not publish

- Any testimonial, review, rating, star count or client quote. None have been supplied.
- Any price, hourly rate or salary figure.
- Any statistic: number of clients, years in business, number of staff, satisfaction rates.
- Any claim about DBS status, vetting standards or training completion rates.
- Any client name, initial, photo or identifying detail.
- Any content copied from Bluebird Care, Helping Hands, Caremark, Radfield, Newcross
  or any other provider. Layout ideas are fine. Their words are not.

Where the page needs one of these to work, insert a `TODO:` and list it for me.

---

## Phase 1 — Audit before changing anything

Produce `CONTENT-AUDIT.md`. Change no files in this phase.

For every fact in Part 1, record one of: **present and correct**, **present but wrong**,
or **missing entirely**. Be specific — give the file and line for each.

Pay particular attention to:
- Is the business described as three services, or still as something else?
- Does the site say anywhere that we supply staff to care homes? (This is the biggest
  part of the business and I suspect it barely appears.)
- Does the phone number appear correctly everywhere?
- Does the address appear correctly everywhere?
- Are the contact hours stated anywhere?
- Is any team member named?
- Do the brand colours match, or are they template leftovers?
- Is there anything on the site that contradicts Part 1?
- Is there anything on the site making a claim Part 2 forbids?

That last one matters most. Report anything the site currently claims that I have not
confirmed — invented statistics, testimonials from the template, fake team members.
List them; do not delete them yet.

Commit `CONTENT-AUDIT.md`, then continue.

---

## Phase 2 — Correct what is wrong

1. Remove or replace anything found in the audit that contradicts Part 1.
2. Remove anything that breaks a Part 2 rule. If a template testimonial or fake
   statistic is on the site, take it out now — do not wait to ask.
3. Fix the phone number, address and business description everywhere they appear.
4. Apply the brand colours from Part 1 across the site. Check contrast as you go:
   the light green is for fills and accents, not small text.

---

## Phase 3 — Restructure the services

The homepage should present the three services from Part 1 clearly and separately,
because they serve completely different audiences:

- **Care homes** are a business audience. They want to know reliability, how fast we
  can fill a shift, what checks staff have, and how to book.
- **Families** are an emotional audience. They want to know who comes to the house,
  what it costs, and how to start.
- **Carers and nurses** want to know pay, areas, shifts, and how to apply.

Give each service its own page, with its own meta title and description, written for
that audience. Use `TODO:` wherever you need detail I have not supplied — particularly
around response times, booking process, and what makes us different.

**Ask me before touching Supported Living.** It currently appears on the site but I have
not confirmed whether it is still offered. Do not delete it and do not promote it —
raise it as a question.

---

## Phase 4 — New pages

### `/safeguarding`
Public safeguarding page. Include the council table from Part 1, a plain statement
that concerns can be raised directly with the local authority or CQC without going
through us, and how to raise a concern with us. This page is unusual for a small
provider and it is exactly the kind of thing an inspector notices.

### `/about` or `/team`
Julia Lazar as Registered Manager and Safeguarding Lead. `TODO:` for the coordinators'
consent. `TODO:` for photographs. `TODO:` for a short paragraph about the company's
history and the Kare Plus franchise relationship.

### `/careers`
Already specified in `RECRUITMENT-SPEC.md` — do not rebuild it. Update it only to
reflect the four recruitment areas and the three role types (care home carer,
domiciliary carer, registered nurse).

### `/contact`
Publish the contact rules from Part 1 exactly. Make the phone number a working
`tel:` link and the address a working Google Maps link.

### `/faq`
Real questions, `TODO:` for every answer. Do not invent answers.

---

## Phase 5 — Verification pass

This is the part I actually asked for. Do it properly.

Go back through **every single fact in Part 1**, one at a time, and confirm it now
appears on the live site correctly. Produce a table in your notes:

| Fact | Where it now appears | Correct? |
|---|---|---|

Then check the reverse: crawl every page and list **every factual claim the site makes**.
For each, state whether it is backed by Part 1 or not. Anything not backed by Part 1
is either a `TODO:` or it comes out. There is no third option.

Then run these checks:
1. `npm run build` and `npm run lint` — zero errors
2. Every internal link resolves; every `tel:` and `mailto:` is correct
3. Every page has a unique title and meta description
4. Brand colours applied consistently; all text passes WCAG AA contrast
5. Site works at 375px width and at 200% zoom
6. `git status` clean of anything that should not be committed

---

## Phase 6 — Report

Append to `OVERNIGHT-NOTES.md`, with this at the top:

1. **Every `TODO:` and every question**, with file and line
2. Anything the site claimed that I never confirmed, and what you did about it
3. The Phase 5 verification table
4. Anything in Part 1 you could not get onto the site, and why
5. What you would do next

Then stop. Do not merge. Do not push to `main`.

---

## Ask me, don't guess

- Is **Supported Living** still an active service?
- Do Rakib and Eva consent to being named publicly?
- Which areas do we **deliver care** in? (I have given you recruitment areas — those
  may not be the same thing.)
- What grades of nurse do we supply — RGN, RMN, both?
- Is 01788 422422 used for client enquiries as well as staff, or is there another number?
- Should the "text out of hours" rule appear on the public contact page, or is it
  staff-only?
- Do we have any photographs of real staff or offices we are allowed to use?
- What should each form email address be?
