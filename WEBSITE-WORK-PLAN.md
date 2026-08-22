# Website work plan — Kare Plus Rugby

Read this file completely before doing anything. Follow it in order.
Do not skip phases. Do not reorder them.

---

## Context you need

This is the website for Kare Plus Rugby Ltd, a CQC-registered domiciliary care,
supported living and temporary staffing provider based in Rugby, Warwickshire.

The company already runs these systems. **Do not rebuild or duplicate them:**

- **OneTouch Health** — staff rostering, scheduling, visit management
- **A separate payroll subscription**
- **FlexiBee** — staff training

The website's job is everything *before* a person enters those systems:
enquiries from families, referrals from professionals, and job applications
from carers. The website hands off to the systems above; it does not replace them.

Tech stack: Next.js 14, React 18, Tailwind, markdown content via gray-matter /
marked / next-mdx-remote, nodemailer for email, swiper for carousels, sharp for images.

---

## Hard rules — these override everything else

### Never
- Never merge into `main`. Never push to `main`. Work only on `main-kare-plus`.
- Never invent testimonials, reviews, ratings, star counts or client quotes.
- Never invent or alter CQC text, registration details or inspection status.
  The current status is "We haven't inspected this service yet." Leave it exactly as is.
- Never invent prices, staff names, staff photos, qualifications, statistics,
  years of experience, or numbers of clients served.
- Never claim carers are DBS-checked, trained, insured or qualified unless you
  find that claim already written elsewhere on the site or I have confirmed it.
- Never change the phone number `01788 422422`, the email addresses, or the
  address `6A Davy Court, Castle Mound Way, Central Park, Rugby, CV23 0UZ`.
- Never delete the privacy policy, terms and conditions, or personal data request pages.
- Never add analytics, tracking pixels, chat widgets, or any third-party script
  without asking me first.
- Never store personal data on the server, in a database, in a log file, or in
  the repository. Forms email their contents and retain nothing.

### Always
- Commit after each numbered item, with a clear message.
- Where real content is missing, insert a clearly visible `TODO:` placeholder
  and add it to the questions list. Never fill a gap with invented text.
- Body text 16px minimum. WCAG 2.2 AA contrast minimum. The layout must survive
  200% browser zoom without breaking — many readers are elderly and will zoom.
- Run `npm run build` after each phase. Fix all errors before continuing.
- Run `npm run lint` and fix what it reports.
- Write everything you did to `OVERNIGHT-NOTES.md` as you go, not at the end.

---

## Phase 0 — Confirm your starting position

1. Confirm you are on branch `main-kare-plus`. If you are not, stop and tell me.
2. Confirm `git status` is clean. If it is not, stop and tell me what is uncommitted.
3. Confirm `npm run build` currently succeeds. If it does not, fix that first
   and commit before doing anything else.

Do not proceed until all three are true.

---

## Phase 1 — Audit only, change nothing

Read every page and component. Produce a file called `AUDIT.md` listing what you find.
Do not edit a single file during this phase.

Look for and record:

- Every internal link that 404s or points somewhere wrong
- Every image missing `alt` text, and every image with unhelpful alt text
- Every text element below 16px
- Every text/background colour pair below WCAG AA contrast
- Every form input missing a visible, associated `<label>`
- Every page missing a unique `<title>` and meta description
- Duplicated content blocks and repeated sections
- Hardcoded content that should live in markdown
- Any placeholder or lorem ipsum text left in the codebase
- Any commented-out or dead code
- Any console errors or React warnings during build
- Any hardcoded phone numbers, emails or addresses that disagree with the
  correct ones listed above
- Any page that does not work at 375px width (small phone)

Commit `AUDIT.md`. Then continue.

---

## Phase 2 — Fix the known faults

These are confirmed problems. Fix each one, committing separately.

1. **Duplicated homepage hero.** "Supported Living Solutions" and "Domiciliary
   Care Services" each appear twice in the top carousel. Fix so each service
   appears exactly once.

2. **Broken footer address link.** It currently points to
   `kareplusrugby.co.uk/6A Davy Court...` which is a 404. Make it open Google
   Maps in a new tab, with `rel="noopener noreferrer"`.

3. **Broken social sharing tags.** `og:image` is `/`, `og:url` is `//`, and
   `twitter:image` is `/`. Set `og:url` to the real canonical URL per page. For
   the image, use the existing Kare Plus logo at a proper size (1200x630) or, if
   no suitable image exists, add a `TODO:` and tell me — do not ship a broken tag.

4. **Generic meta description.** Currently "Professional caregiving services".
   Rewrite it to name the services and the location (Rugby, Warwickshire).
   Then write a unique description for every other page too.

5. **"Cloud Support" feature card.** This is jargon aimed at nobody. Replace it
   with something a worried family member actually wants to know. Do not assert
   DBS checks or vetting standards unless already stated elsewhere on the site —
   if not, write the card with a `TODO:` for the specific claim and ask me.

6. **Raw social URLs in the footer.** Facebook, Instagram and LinkedIn URLs are
   printed as literal text. Replace with labelled icon links, each with an
   `aria-label` naming the platform.

7. **Inconsistent service URLs.** Supported Living is linked as both
   `/supported-living` and `/services/supported-living`. Pick one, redirect the
   other, and make every link consistent.

8. Fix everything else you recorded in `AUDIT.md`.

---

## Phase 3 — Build the new pages

### 3a. Careers page at `/careers`

The single highest-value addition. Roughly half the site's traffic will be
carers looking for work, and there is currently nothing for them.

Include:
- What it's like to work for Kare Plus Rugby (`TODO:` for real detail)
- Current vacancies section, driven by markdown files so it can be updated
  without code. Create the structure with one example file clearly marked
  as an example.
- An application form with these fields:
  - Full name, email, phone
  - Which role they're applying for
  - Do you have the right to work in the UK? (yes / no)
  - Do you have a current enhanced DBS on the update service? (yes / no / not sure)
  - Do you have a driving licence and access to a car? (yes / no)
  - Care experience (none / under 1 year / 1–3 years / 3+ years)
  - Availability (checkboxes: weekday mornings, weekday evenings, weekends,
    nights, live-in)
  - CV upload (PDF or Word, 5MB max)
  - Free-text: anything else you'd like us to know
- Add `/careers` to the main navigation.

### 3b. Improve the enquiry form

Replace whatever generic contact form exists with one that captures a full
picture, so the coordinator doesn't need five emails to understand a case:
- Who is the care for? (myself / parent / partner / other relative / client I represent)
- Type of support needed (domiciliary / supported living / live-in / respite / not sure)
- Postcode or area
- How soon is support needed? (urgently / within 2 weeks / within a month / just researching)
- How will care be funded? (self-funded / local authority / NHS / direct payment / not sure)
- Best way and time to contact them
- Free-text description
- Name, phone, email

Make every field except name and one contact method optional. A long compulsory
form loses enquiries from people already under stress.

### 3c. Referral page at `/referrals`

For social workers, discharge teams, district nurses and case managers. Almost
no small provider has one. Similar to the enquiry form but with: referrer name,
organisation, professional role, their contact details, client initials only
(**not** full name — no identifiable client data through a web form), area,
support type needed, and urgency. Add a clear line telling professionals to
phone for anything urgent or clinically detailed rather than using the form.

### 3d. FAQ page at `/faq`

Structure it with real questions but `TODO:` for every answer I need to supply:
how much does care cost, how do we get started, how quickly can care begin, are
carers DBS-checked and trained, will we see the same carer, what areas do you
cover, what happens if a carer is off sick, how do I complain, can I change or
cancel. Add FAQ structured data once the answers are real — not before.

### 3e. Staff section at `/staff`

Do **not** build rota, timesheet or training features. Those live in OneTouch
Health, payroll, and FlexiBee. This page is a signposting hub only: clearly
labelled links out to those three systems, plus downloadable policies and the
staff handbook (`TODO:` — I will supply the files). Nothing behind a login,
nothing storing data.

### Form implementation rules

- Use the existing nodemailer setup.
- Email the submission. Store nothing — no database, no log file, no repo file.
- Server-side validation on every field, not just client-side.
- Basic spam protection: a honeypot field and a simple rate limit. No third-party
  CAPTCHA without asking me.
- Show a real success message and a real error message. Never a silent failure.
- Every field needs a visible `<label>`. Placeholder text is not a label.
- Errors must be announced to screen readers (`aria-live`) and describe how to fix.
- Add a short line above each form saying what happens to the information and
  linking to the privacy policy.
- Add `TODO:` for which email address each form should send to — do not guess.
- Test that each form actually sends before marking it done. If you cannot test
  sending, say so plainly in your notes rather than claiming success.

---

## Phase 4 — Local SEO

1. Add `LocalBusiness` structured data with the real name, address, phone,
   opening hours (Mon–Fri 9–5, 24/7 on-call) and service area.
2. Unique title and meta description on every page, naming Rugby or Warwickshire
   where it reads naturally. No keyword stuffing.
3. Generate `sitemap.xml` and a sensible `robots.txt`.
4. One `<h1>` per page, and a heading hierarchy that doesn't skip levels.
5. Canonical URLs on every page.

---

## Phase 5 — Accessibility and performance

This matters more here than on most sites. Assume a 78-year-old on an iPad at
200% zoom, and a family member reading on a phone in a hospital corridor.

- Every image has meaningful `alt` text; decorative images get `alt=""`.
- Full keyboard navigation, with a visible focus indicator on every interactive
  element. Test tab order.
- No information conveyed by colour alone.
- Tap targets 44x44px minimum.
- The carousel must be pausable and keyboard-operable, and must not auto-advance
  faster than a slow reader can read it.
- Test at 200% and 400% zoom. Nothing may overlap or become unreachable.
- Test at 375px width.
- Respect `prefers-reduced-motion`.
- Convert images to modern formats via `sharp`; lazy-load below-fold images;
  set explicit width and height to prevent layout shift.
- Aim for Lighthouse accessibility 95+ and performance 90+. Report the real
  scores you achieved, not the ones you were aiming for.

---

## Phase 6 — Re-check, repeatedly

Do not skip this. Run each pass fully and separately. Record the result of each
pass in `OVERNIGHT-NOTES.md`, including passes where you found nothing.

**Pass 1 — Build.** `npm run build` and `npm run lint`. Zero errors. Fix and repeat
until clean.

**Pass 2 — Rules.** Re-read the Hard Rules section at the top of this file. Then
re-read every file you changed and check each one against those rules line by
line. List any violation you find and fix it.

**Pass 3 — Invented content.** Search everything you wrote for claims that are
not verifiable from existing site content or from me. Any statistic, credential,
testimonial, price, timescale or qualification you cannot source: remove it and
replace with a `TODO:`. Be strict — this is the pass that matters most.

**Pass 4 — Links.** Check every internal link resolves. Check every external link
opens correctly with `rel="noopener noreferrer"`. Check every `tel:` and `mailto:`
uses the correct real values.

**Pass 5 — Three readers.** Re-read the whole site three times, once as each of:
- A daughter looking for urgent care for her mother. Can she find the phone
  number in under five seconds? Does she learn what it costs? Does she know who
  is accountable?
- The elderly person the care is for, reading at 200% zoom. Is anything written
  *to* them rather than only *about* them? Can they read it?
- A carer looking for a job. Can they find the vacancies and apply in under two
  minutes on a phone?

Fix what each reading exposes. Note what you changed.

**Pass 6 — Fresh eyes.** Re-read `AUDIT.md`. Confirm every item is either fixed
or explicitly listed as outstanding with a reason. Nothing silently dropped.

**Pass 7 — Final build.** Full clean build one more time. Confirm the site still
runs with `npm run dev`.

---

## Phase 7 — Report

Write `OVERNIGHT-NOTES.md` containing:

1. Every change made, grouped by phase, with commit hashes.
2. Everything you attempted but could not complete, and why.
3. **Every `TODO:` placeholder**, with its file, its line, and exactly what
   information you need from me. This is the most important section — put it
   near the top where I'll see it.
4. Every question you had to make a judgement call on.
5. The real Lighthouse scores.
6. Anything you noticed that is out of scope but I should know about.
7. What you would do next.

Then stop. Do not merge. Do not push to `main`. The pull request is mine to open.

---

## Things to ask me rather than guess

Add these to your questions list as you hit them:
- Which email address should each form send to?
- Are carers DBS-checked, and to what standard? Can we say so publicly?
- Do you want to publish any pricing or cost ranges?
- What are the real answers to the FAQ questions?
- Which areas around Rugby do you actually cover?
- Do you have photos of real staff we can use, with their consent?
- Do you have written consent for any client testimonials?
- What current vacancies should the careers page list?
