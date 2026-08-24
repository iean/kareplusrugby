# SEO spec — Kare Plus Rugby recruitment search

Read this file completely before writing any code.

Works alongside `WEBSITE-WORK-PLAN.md`, `RECRUITMENT-SPEC.md` and
`WEBSITE-CONTENT-UPDATE.md`. Every Hard Rule in `WEBSITE-WORK-PLAN.md` still applies:
work only on `main-kare-plus`, never merge to `main`, never invent anything.

---

## The goal, stated honestly

We want to be found by people searching for care work in **Coventry, Rugby, Leicester
and Northamptonshire**.

We are **not** trying to outrank Indeed, Reed, Totaljobs or CV-Library on broad queries
like "care jobs Coventry". Those sites have two decades of authority and we will not
beat them. Do not build a strategy around that and do not report success against it.

We are doing two winnable things:

1. **Getting into Google for Jobs** — the job widget that appears *above* the normal
   search results. It is free, and entry is purely technical: valid JobPosting
   structured data on crawlable job pages. This is the single highest-value item in
   this file. If you only do one phase, do Phase 2.
2. **Owning specific location-plus-role queries** — "healthcare assistant jobs Rugby",
   "care home agency work Leicester", "domiciliary carer Northampton". Long-tail,
   lower volume, far higher intent, and poorly served by the aggregators.

---

## Target queries

Roles we recruit for:
- Healthcare assistant / HCA
- Care assistant / care worker
- Support worker
- Registered nurse (RGN)

Areas: **Coventry, Rugby, Leicester, Northampton**

Work types: care home agency shifts, domiciliary care, bank/flexible, full time, part time

`TODO:` — ask me which specific towns in Northamptonshire we cover. "Northamptonshire"
is two councils and a lot of ground. Do not invent a town list.

---

## Critical warning — read before Phase 2

Google's job posting policies require postings to be **real, current vacancies**.

- Never publish a JobPosting for a role that does not exist.
- Never leave an expired posting live. Every posting needs a `validThrough` date, and
  expired ones must be removed or marked closed.
- Never mark up content that is not visible on the page.
- Structured data must be a true representation of what a person sees.

Breaking these earns a manual action, which removes us from Google for Jobs entirely
and is painful to reverse. Build the expiry handling **at the same time** as the
posting system, not afterwards.

If we do not currently have real vacancies to publish, say so in your notes and build
the system with one clearly-marked example that is `noindex` until I supply real ones.

---

## Phase 1 — Technical foundation

Nothing else works if the site cannot be crawled properly.

1. Confirm every page returns 200 and is indexable. Find and report any accidental
   `noindex`, `nofollow`, or `robots.txt` block.
2. Generate a correct `sitemap.xml` with accurate `lastmod` values. Job pages get their
   own sitemap section.
3. Sensible `robots.txt`, referencing the sitemap.
4. Canonical URL on every page. Resolve the duplicate service URLs noted in
   `WEBSITE-WORK-PLAN.md` — Supported Living currently resolves at two paths, which
   splits ranking signals.
5. One `<h1>` per page. No skipped heading levels.
6. Core Web Vitals: report real Lighthouse scores. Fix render-blocking resources,
   unsized images and layout shift. Most care job searches happen on a phone — mobile
   performance matters more than desktop here.
7. HTTPS everywhere, no mixed content, no redirect chains.

---

## Phase 2 — Google for Jobs (the priority)

### Structure
- One page per vacancy, at a stable URL: `/jobs/[slug]`
- Each page must contain the full job description **visible to the reader**, not just
  in the structured data
- Vacancies driven by markdown files so the office can add them without code
- An index page at `/jobs` listing all live vacancies, filterable by location and role
- Job pages must be reachable by crawler through normal links, not only through JavaScript

### JSON-LD on every job page

Required properties — a posting missing any of these is not eligible:
- `title` — the job title alone. Not "Apply now — HCA — great pay!" Just
  "Healthcare Assistant".
- `description` — the complete description in HTML. Use `<p>`, `<ul>`, `<li>`, `<h3>`.
  Must match what is on the page.
- `hiringOrganization` — name "Kare Plus Rugby", `sameAs` the site URL, `logo` an
  absolute URL to the logo.
- `jobLocation` — a `Place` with a full `PostalAddress`: street, locality, region,
  postal code, `addressCountry: "GB"`.
- `datePosted` — ISO 8601.

Strongly recommended — include all of these:
- `validThrough` — ISO 8601 with a time. **Every posting must have one.**
- `employmentType` — `FULL_TIME`, `PART_TIME`, `CONTRACTOR`, `TEMPORARY`, `PER_DIEM`
- `baseSalary` — a `MonetaryAmount` with `currency: "GBP"`, a `QuantitativeValue`
  with `value` or `minValue`/`maxValue`, and `unitText` of `HOUR` or `YEAR`
- `identifier` — our own reference for the role
- `directApply` — set to `true` only if the application can be completed on our own
  site without being sent elsewhere. With the form from `RECRUITMENT-SPEC.md`, it can.

**Salary decision — raise this with me.** Google's own guidance is that users prefer
postings with a stated salary, and postings with one perform better. Publishing hourly
rates is a commercial decision I have not made. Add a `TODO:` and do not guess a figure.

### Validation
- Validate every job page against Google's Rich Results Test and the Schema.org
  validator. Report actual pass/fail per page — do not assume.
- Report any warning as well as any error.
- Confirm the JSON-LD parses and that no property contains a placeholder.

---

## Phase 3 — Location and role landing pages

Separate from individual vacancies. These rank when we have no live jobs.

Create a page for each meaningful role-and-area combination, at
`/jobs/[role]-[location]`, for example:
- `/jobs/healthcare-assistant-coventry`
- `/jobs/care-assistant-rugby`
- `/jobs/support-worker-leicester`
- `/jobs/care-jobs-northampton`

Each page needs, at minimum:
- An `<h1>` naming the role and the location
- Genuinely local content: which types of setting we staff there, the kind of shifts
  available, how travel works. `TODO:` anything you do not know — a page of filler will
  be treated as thin content and will not rank.
- A list of current vacancies in that area, pulled live, with a clear message when
  there are none
- A clear application call to action
- Unique title and meta description containing both role and location
- Internal links to the other area pages and to the main careers page

**Do not generate twelve near-identical pages by swapping the town name.** Doorway
pages are a Google violation and they will not rank. If you cannot write genuinely
distinct content for a combination, build fewer pages and tell me which ones you
skipped and why.

---

## Phase 4 — On-page and local signals

1. Unique title and meta description on every page. Put the location in the title where
   it reads naturally.
2. `Organization` and `LocalBusiness` JSON-LD on the site: real name, address, phone,
   opening hours (9am–5pm Monday to Friday), service area covering the four locations.
3. **NAP consistency.** Name, address and phone must be byte-identical everywhere on
   the site and match what we publish elsewhere. Inconsistency dilutes local trust.
   Audit every occurrence and report mismatches.
4. Internal linking: careers page links to every area page; every area page links to
   live vacancies and back. No orphan pages.
5. Descriptive `alt` text on images.
6. Breadcrumbs with `BreadcrumbList` schema on job and area pages.

---

## Phase 5 — Content for candidates

Search traffic comes from questions, not just job titles. Build a simple articles
section and create the *structure* plus outlines. Do not write finished articles
containing facts I have not confirmed.

Suggested topics — candidate side:
- What does a healthcare assistant actually do on a shift?
- Do I need experience to become a care worker?
- What is an enhanced DBS and how do I get one?
- Care home work versus domiciliary care — which suits you?
- What is the Care Certificate?
- Agency care work explained: how shifts and pay work

Mark every factual claim needing confirmation with a `TODO:`. Especially anything about
our pay, our shift patterns, or our training.

---

## Phase 6 — Verification

Do each pass fully. Record results in `OVERNIGHT-NOTES.md`, including passes that find
nothing.

**Pass 1** — `npm run build` and `npm run lint`, zero errors.

**Pass 2 — Structured data.** Every job page and every area page validated. Report the
actual result per URL in a table. Any error means that page is not eligible; fix it.

**Pass 3 — Crawlability.** Confirm every job page and area page is in the sitemap,
returns 200, is indexable, and is reachable by following links from the homepage
without JavaScript.

**Pass 4 — Duplication.** Compare the area pages against each other. If any two are
substantially the same text with the town swapped, that is a doorway page. Rewrite or
remove it and tell me.

**Pass 5 — Expiry.** Confirm every posting has a `validThrough`, and that an expired
posting is actually removed from the sitemap and either delisted or marked closed.
Test this by setting a date in the past.

**Pass 6 — Honesty.** Re-read every job page and area page. Confirm every claim traces
back to `WEBSITE-CONTENT-UPDATE.md` Part 1 or to a `TODO:`. Remove anything else.

**Pass 7 — Mobile.** Every job and area page at 375px width and at 200% zoom. Report
real Lighthouse mobile scores.

---

## Phase 7 — Report

Append to `OVERNIGHT-NOTES.md`:

1. Every `TODO:` and every decision needed from me, with file and line
2. The Phase 6 validation tables
3. Which area pages you built, and which you skipped for lack of real content
4. Real Lighthouse scores, mobile and desktop
5. **A plain-English list of what I must do outside the website**, since some of the
   most valuable actions are not code
6. What you would do next

Then stop. Do not merge. Do not push to `main`.

---

## Ask me, don't guess

- Which towns in Northamptonshire do we cover?
- Do we publish hourly rates? (This materially affects Google for Jobs performance.)
- Do we have real, current vacancies to publish right now?
- What is the recruitment email address?
- Are we already listed on Indeed, Reed or Totaljobs?
- Do we have a Google Business Profile, and is it claimed?
- What makes working for us different from the agency down the road? I need to give
  you this — you cannot invent it, and without it the area pages will be thin.
