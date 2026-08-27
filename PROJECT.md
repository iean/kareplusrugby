# Heart & Haven Care — Project Tracker

> **This is the single source of truth for this project.**
> If you are an AI assistant or a new developer starting a fresh session, read this file top to bottom before touching anything. It tells you what the site is, what state it's in, what has been done, what's next, and how we work.

**Last updated:** 2026-08-07
**Repo:** https://github.com/iean/healthcare
**Branch:** `main`

---

## 1. Project Overview

**Heart & Haven Care** is a UK healthcare business website. It serves three business lines:

1. **Domiciliary Care** — care delivered in clients' own homes
2. **Temporary Staffing** — supplying care staff to other organisations
3. **Supported Living** — *advertised in the nav but the page does not exist yet* (see §7 P0)

The site does double duty: it markets services to **clients and their families**, and recruits **care workers** through job listings and careers pages.

**The goal of this project:** make the site look substantially better, and change/replace topics and content as Alif decides. Work happens across many sessions, so this file exists to carry the context between them.

**Origin:** built on the *Bigspring Light* Next.js template by Themefisher, then heavily extended. Much of the extension work was done by AI agents — there are 30+ `codex/*` branches on the remote. That history matters because it explains the duplication and inconsistency noted in §7.

**Credited developer:** the footer currently reads "Designed and Developed By [Sofgent](https://sofgent.com/)".

---

## 2. Tech Stack & How to Run It

| Thing | Value |
|---|---|
| Framework | **Next.js 14.2** (App Router) |
| UI | **React 18.3** |
| Styling | **Tailwind CSS 3.4** + SCSS in [styles/](styles/) |
| Content | Markdown / MDX via `gray-matter` + `next-mdx-remote` |
| Email | `nodemailer` (Gmail transport) |
| Carousel | `swiper` 8 |
| Icons | `react-icons` |
| Package manager | **pnpm** locally (`pnpm-lock.yaml` is committed). ⚠️ **The server uses `npm install`** — see below. |
| Deploy | **Self-hosted VPS** at `46.252.193.48`, pm2 process `heartandhaven` |

### Deployment — it is NOT Netlify

`netlify.toml` exists but is a leftover. The real pipeline is [.github/workflows/deploy.yml](.github/workflows/deploy.yml):

**every push to `main` SSHes into the VPS, runs `git pull`, `npm install`, `npm run build`, and restarts pm2.** There is no staging step and no approval. A push is a production deploy.

**Live URL:** `http://46.252.193.48:3000`

⚠️ **`heartandhavencare.co.uk` does not resolve** — NXDOMAIN from both the local resolver and 8.8.8.8 (checked 2026-08-07), despite being referenced in the site content. The domain is unregistered, expired, or never pointed anywhere.

⚠️ **The site is served over plain HTTP on port 3000.** No TLS, no reverse proxy, no domain. Care enquiries containing names, phone numbers and health details are submitted unencrypted. See §7 P0.

Known problems with the pipeline:

- **The server runs `npm install`, not pnpm**, so `pnpm-lock.yaml` is ignored in production and versions can drift from local. (There is a commit literally titled "fix npm".) `pnpm-workspace.yaml` has no effect on the server either.
- **The deploy script has no `set -e`.** Commands inside the heredoc can fail and the workflow still reports success — so a green tick does not prove a deploy worked.
- **`data/*.json` are tracked in git *and* written to at runtime.** Once the server has local changes to `data/messages.json`, `git pull` will refuse to merge and every future deploy silently stops updating the code.

### Local toolchain (installed 2026-08-07)

Node **v24.19.0** (LTS), npm 11.17.0, pnpm 11.20.0. Installed without sudo by extracting the official arm64 tarball (SHA-256 verified) to `~/.local/node`; `~/.zshrc` puts `~/.local/node/bin` on `PATH`. pnpm comes from corepack.

```bash
cd ~/Desktop/website
pnpm install
pnpm dev                # → http://localhost:3000
```

Other scripts: `pnpm build`, `pnpm start`, `pnpm lint`.

**[pnpm-workspace.yaml](pnpm-workspace.yaml)** exists solely to fix this: pnpm 11 refuses to run a dependency's install scripts until they're approved, and its pre-run check then aborts `pnpm build` with `ERR_PNPM_IGNORED_BUILDS`. The file allows `sharp`, `swiper`, `@parcel/watcher` and `unrs-resolver` — all long-standing dependencies already pinned in the lockfile. Delete it and the build breaks again on pnpm 11.

Note the setting **moved** in pnpm 11: a `pnpm.onlyBuiltDependencies` block in `package.json` is silently ignored. It has to be `allowBuilds` in `pnpm-workspace.yaml`.

### Do not put a `.env` in this repo

Next.js auto-loads `.env` and reports `Environments: .env` at startup, so anything in it becomes a server-side environment variable. Alif's GitHub token briefly lived there and was being loaded into the dev server on every run. It now sits at `~/.website-github.env`, outside the project, and the token is in the macOS Keychain — `git push` works without any file. Real app secrets belong on the VPS, in the pm2 environment.

### Environment variables

Not committed (correctly). **Set these on the VPS**, not in any hosting dashboard — there isn't one. They need to be in the pm2 environment (an ecosystem file, `pm2 set`, or a `.env` on the server), then `pm2 restart heartandhaven --update-env`.

| Variable | Required | Purpose |
|---|---|---|
| `EMAIL_USER` | **Yes** | Gmail address used to send form notifications |
| `EMAIL_PASS` | **Yes** | Gmail **app password**, not the account password |
| `ADMIN_USER` | **Yes** | Username for the admin login |
| `ADMIN_PASSWORD` | **Yes** | Password for the admin login |
| `PRIVACY_EMAIL` | No | Where GDPR data requests go. Falls back to `params.contact_email`. |

⚠️ **`ADMIN_USER` and `ADMIN_PASSWORD` are not set on the server as of 2026-08-07** — `http://46.252.193.48:3000/admin` returns 401 to everyone, Alif included. [middleware.js](middleware.js) fails closed by design: an unset variable locks the door rather than silently leaving it open. **The admin area is unusable until these are set on the VPS.**

⚠️ Without `EMAIL_USER`/`EMAIL_PASS` the contact form now returns a visible error instead of failing silently.

### GitHub credentials

Alif's token is in the **macOS Keychain**; `git push` works with no file present. A copy of the values sits at `~/.website-github.env`, outside the repo. `.env` and `.DS_Store` are in `.git/info/exclude` (a local ignore) because the repo's own `.gitignore` covers `.env.local` but **not** plain `.env`.

---

## 3. Site Map & Topics

Status key: **Keep** (leave alone) · **Redesign** (same topic, better looks) · **Rewrite** (change the topic/content) · **Remove** (delete) · **Build** (doesn't exist yet)

### Main site

| Page | Route | Topic | Status |
|---|---|---|---|
| Home | `/` | Overview of all three service lines | _TBD_ |
| Domiciliary Care hub | `/domiciliary` | Care at home | _TBD_ |
| Temporary Staffing hub | `/staffing` | Staff supply | _TBD_ |
| **Supported Living** | `/supported-living` | — | **Build** — in nav, page missing → 404 |
| Domiciliary Care Home | `/domiciliary-care-home` | Care home services | _TBD_ |
| How We Work | `/how-we-work` | Process explainer | _TBD_ |
| Contact | `/contact` | Contact form | _TBD_ |
| Blog index | `/blogs` | 5 posts, paginated | _TBD_ |
| Blog post | `/blogs/[single]` | Individual article | _TBD_ |
| Get Started (thank you) | `/thank-you` | Post-submit confirmation | _TBD_ |
| Privacy Policy | `/privacy-policy` | Legal | _TBD_ |
| Terms & Conditions | `/terms-and-conditions` | Legal | _TBD_ |
| Request Personal Data | `/request-personal-data` | GDPR subject access | _TBD_ |
| 404 | `not-found.js` | Error page | _TBD_ |

### Domiciliary section (own nav — `config/menu-domiciliary.json`)

| Page | Route | Status |
|---|---|---|
| Domiciliary Home | `/domiciliary` | _TBD_ |
| About Us | `/domiciliary/about` | _TBD_ — **in the menu** |
| About Us (orphan) | `/domiciliary/about-us` | **Remove** — duplicate, not in menu, still public |
| Care Services | `/domiciliary/care-services` | _TBD_ |
| How We Work | `/domiciliary/how-we-work` | _TBD_ |
| Available Jobs | `/domiciliary/available-jobs` | _TBD_ |
| Our Careers | `/domiciliary/our-careers` | _TBD_ |
| Contact Us | `/domiciliary/contact-us` | _TBD_ |
| Get Started | `/domiciliary/get-started` | _TBD_ |
| Jobs | `/domiciliary/jobs` | _TBD_ — possible duplicate of available-jobs |

### Staffing section (own nav — `config/menu-staffing.json`)

| Page | Route | Status |
|---|---|---|
| Staffing Home | `/staffing` | _TBD_ |
| About Us | `/staffing/about-us` | _TBD_ |
| Staffing Services | `/staffing/care-services` | _TBD_ |
| How We Work | `/staffing/how-we-work` | _TBD_ |
| Available Jobs | `/staffing/available-jobs` | _TBD_ |
| Contact Us | `/staffing/contact-us` | _TBD_ |

### Admin (behind Basic Auth in [middleware.js](middleware.js) — returns 401 until `ADMIN_USER`/`ADMIN_PASSWORD` are set in Vercel)

| Page | Route |
|---|---|
| Admin home | `/admin` |
| Messages | `/admin/messages` |
| Jobs manager | `/admin/jobs` |

### API routes

`/api/messages` · `/api/jobs` · `/api/get-started` · `/api/request-data`

### Markdown content

Lives in [content/](content/) — `_index.md`, `contact.md`, `faq.md`, `pricing.md`, `404.md`, `elements.md`, `blogs/blog-1..5.md`, `home/banner.json`.

Any file added to `content/` automatically becomes a route via the catch-all at [app/[regular]/page.js](app/[regular]/page.js). The `layout:` field in its frontmatter picks the renderer (`contact`, `pricing`, `faq`, `404`, or default).

---

## 4. Design System

**Read this before writing any CSS.** These are the real current values, pulled from [config/theme.json](config/theme.json) and [tailwind.config.js](tailwind.config.js). Do not invent new colors or sizes — extend this section instead.

### Colors

⚠️ **Naming trap:** in `theme.json` the gold is called `primary` and the purple `secondary`. Tailwind **swaps them**. Always go by the Tailwind name.

| Tailwind class | Hex | Role |
|---|---|---|
| `primary` | `#5a2671` | Deep purple — main brand color |
| `accent` | `#b9892f` | Gold — buttons, highlights |
| `brandText` | `#5a2671` | Purple body headings |
| `background` | `#f9f7fc` | Very light purple tint, section backgrounds |
| `body` | `#ffffff` | White page background |
| `border` | `#e0e0e0` | Light grey borders |
| `light` | `#7a4b91` | Light purple |
| `dark` | `#2e1540` | Near-black purple |

Text colors: default `#5a2671`, light `#7a4b91`, dark `#2e1540`.

### Typography

- **Primary:** Poppins — weights 400, 500, 600, 700 (headings + UI)
- **Secondary:** Open Sans — weights 400, 600 (body)
- **Base size:** 16px, **modular scale ratio 1.25**

Heading sizes are computed from the scale in `tailwind.config.js`, not hardcoded. Use `text-h1` … `text-h6` (and `text-h1-sm` … `text-h3-sm` for mobile). Changing `font_size.scale` in `theme.json` resizes every heading at once.

| Class | Size |
|---|---|
| `text-h1` | 3.05rem |
| `text-h2` | 2.44rem |
| `text-h3` | 1.95rem |
| `text-h4` | 1.56rem |
| `text-h5` | 1.25rem |
| `text-h6` | 1rem |

### Layout

- Container max width **1200px**, padding **1.5rem**, centered
- Breakpoints: `sm` 540px · `md` 768px · `lg` 1024px · `xl` 1280px · `2xl` 1536px

### Buttons

- Padding `12px 24px`, radius `9999px` (fully rounded pill), weight 600, no uppercase
- **Primary:** gold `#b9892f` bg, white text, hover `#a87a28`
- **Secondary:** purple `#5a2671` bg, white text, hover `#4c1f5e`

### Where styles live

| File | Contains |
|---|---|
| [styles/style.scss](styles/style.scss) | Entry point — imports the rest |
| [styles/base.scss](styles/base.scss) | Element defaults |
| [styles/components.scss](styles/components.scss) | Reusable component classes |
| [styles/buttons.scss](styles/buttons.scss) | `.btn` variants |
| [styles/navigation.scss](styles/navigation.scss) | Header/nav |
| [styles/utilities.scss](styles/utilities.scss) | Helpers |

Tailwind plugins available: `@tailwindcss/forms`, `@tailwindcss/typography`, `@tailwindcss/line-clamp`, `tailwind-bootstrap-grid`.

### How to change the theme globally

Edit [config/theme.json](config/theme.json). Tailwind reads it at build time, so one edit there propagates to every color and font size across the site. **Prefer this over hardcoding hex values in components.**

---

## 5. Design Goals & Direction

_To be filled in with Alif. Current placeholders — confirm before relying on these:_

- **Feel:** warm, trustworthy, calm — it's healthcare for vulnerable people and their families
- **Audiences:** two, with different needs — families choosing care, and care workers seeking jobs. The site should make it obvious within one screen which path a visitor is on.
- **Avoid:** generic SaaS/agency styling inherited from the Bigspring template — the site should not look like a marketing startup
- **Accessibility matters more than usual here.** Many visitors will be older or assisting an older relative. Watch contrast, font size, and tap-target size.
- **Reference sites:** _TBD — ask Alif for 2–3 sites he likes_

---

## 6. Work Log

Newest first. Every session adds an entry.

### 2026-08-27 — Production audit, and the out-of-hours number published

**Changed:** `config/site.json`, `app/layout.js`, `app/contact/page.js`,
`layouts/partials/SiteFooter.js`, `layouts/components/ui/StickyContactBar.js`.

**Full production audit first.** All 42 public routes return 200. Every internal
link across 33 crawled pages resolves — zero dead `#` links. Every page carries
exactly one `<h1>`, a canonical on `www.kareplusrugby.co.uk`, a meta description
and an `og:image`. Security headers (HSTS, nosniff, SAMEORIGIN, referrer and
permissions policy) are all present, apex redirects to `www` over HTTPS,
`/admin` and `/admin/jobs` return 401, `GET /api/messages` returns 405, and
`node scripts/check-contrast.mjs` passes all 18 pairings. Both Google Forms
open publicly — the earlier "form 2 is blocked" reading was a user-agent
artifact; they return 200 to a browser UA and 401 only to bare curl.

**The one real finding, now fixed.** Alif gave the two numbers: `01788 422422`
is the office landline, `07563 247176` is the out-of-hours line and is also the
WhatsApp number. The site promised 24/7 on-call in a dozen places — Hero,
Stats, TrustSignals, the FAQ, careers, both Banners — and **never once said what
to dial**. `business.mobile` had been sitting in `config/site.json` unused by
any component.

- **Structured data was actively wrong.** `app/layout.js` published the landline
  as a ContactPoint answered 00:00–23:59, seven days. That tells Google the
  office number is staffed at 3am. Now two ContactPoints: the landline on
  Monday–Friday 09:00–17:00, and the mobile as a 24/7 `emergency` line.
- **`/contact`** gained an "Out of hours" row and a WhatsApp row, and its
  telephone note now names the real hours instead of the vague "office hours,
  with an on-call line outside them".
- **The footer** carries the on-call number on every page, labelled
  "Out of hours & WhatsApp".
- **`StickyContactBar`** — the mobile Call button dialled the landline, so a tap
  at 11pm rang an empty office, which is exactly when someone taps it. It now
  switches to the on-call line outside office hours, behind a mounted flag so
  SSR still emits the office number and hydration cannot mismatch.

Verified: `pnpm build` and `pnpm lint` clean, rendered locally on :3111 —
both numbers appear with correct `tel:` hrefs and the two ContactPoints appear
in the JSON-LD.

**Known duplication, not fixed here:** `config/social.json` holds its own copy
of the phone number, and `layouts/components/Social.js` builds `tel:01788422422`
from it (valid, but not E.164 like everywhere else). Two sources of truth for
one number that can drift. Logged in §7 P1.

### 2026-08-26 — Five condition pages, and the registered manager named site-wide

**New:** `lib/careTypes.js`, `layouts/services/CareTypePage.js`, and five routes:
`/dementia-care-at-home`, `/palliative-care-at-home`, `/stroke-care-at-home`,
`/respite-care`, `/live-in-care`.

**Changed:** `app/sitemap.js`, `config/site.json` (footer nav),
`app/domiciliary-care/page.js`, `layouts/partials/SiteFooter.js`,
`app/contact/page.js`, `app/layout.js`.

**Why:** the competitor review found Home Instead and Bluebird each run a dozen
condition pages and we had three service pages total. Alif confirmed on
2026-08-26 that all five services are genuinely provided.

**Two constraints these pages respect.** Alif said they do not have many
customers yet, so nothing claims volume, years of experience or a track record.
And every page carries a "what we cannot do" block with the same visual weight
as "what we do" — a carer is not a nurse, live-in care is not waking night
care, we do not manage syringe drivers. No competitor does this. It is the most
useful thing on the pages and it heads off the complaint that starts "nobody
told us".

Verified: pairwise similarity 14.2–16.7% (doorway territory is >80%), no
unsupportable claims, every external charity link resolves.

**Registered manager** Iulia Larisa Lazar now appears in the footer (so on every
page), on contact, and in the LocalBusiness structured data as an employee with
the job title Registered Manager.

### 2026-08-25 — New /paying-for-care page (competitor gap)

**New:** `lib/funding.js`, `app/paying-for-care/page.js`. **Changed:**
`app/sitemap.js`, `config/site.json` (footer nav), the two client service pages.

**Why:** competitor review of Home Instead, Bluebird Care, Right at Home and
Helping Hands. None of them explains how care funding actually works — Helping
Hands has a thin "funding options" page and the rest have nothing. It is high
intent search traffic ("will the council pay for my mum's care") that nobody in
this market is answering properly.

Every figure verified against GOV.UK on 2026-08-25 and sourced on the page:
capital limits £23,250/£14,250, tariff income £1 per £250, Minimum Income
Guarantee £241.45 (pension age) and £120.40 (under, 25+), Attendance Allowance
£76.70/£114.60 and not means-tested, home value disregarded for care at home.

**⚠️ REVIEW EVERY APRIL.** The rates change. `lib/funding.js` carries the
checked-on date and the review date. A care site quoting a stale benefit rate is
worse than one quoting none, because people plan around it.

Also confirmed by the review: **not publishing client prices is normal.** All
four competitors decline to publish rates. That choice needs no change.

### 2026-08-25 — Registered manager published

**Changed:** `config/site.json`, `app/about/page.js`.

The registered manager was a `[TODO]` placeholder, hidden by the about page's
filter. Verified against the CQC public register for location 1-19892028472 and
published: **Iulia Larisa Lazar**, registered manager, and **Choudhury Taimur
Sadat**, nominated individual (the same person as the director of that name).
The registered location and location ID are now shown too, and the "check it
yourself" link goes to the location page rather than the provider page.

**Note the spelling: Iulia, not Julia.** WEBSITE-CONTENT-UPDATE.md says "Julia
Lazar". The CQC spelling is used because a registered manager's name should
match the register. Recorded in `_registered_manager_note`.

**Flagged, not changed — a condition of registration:** CQC's record for this
location carries the condition *"The registered provider must not provide
Personal care in a specialist service to people whose presenting need for care
or support is as a direct result of the person's learning disability and or
autism at or from Kare Plus Rugby."* The supported living page, the homepage
services block and the staffing service cards all currently lead with support
for "learning disabilities, autism or mental health needs". Awaiting Alif's
decision — see OVERNIGHT-NOTES.md §14.

### 2026-08-25 — The 2022 comma, and the CQC link

**Changed:** `layouts/components/ui/StatCounter.js`,
`layouts/partials/SiteFooter.js`, `config/site.json`.

**The comma.** The homepage stat read "2,022". `StatCounter` parsed the year as
a number and ran it through `toLocaleString("en-GB")`, which groups thousands.
It only showed once the count-up animation ran, so the server-rendered HTML
looked fine. Grouping now follows how the value was written: "2022" stays
"2022", and anything that genuinely wants a separator is written "1,200".

**The CQC link.** It pointed at the provider page, which CQC titles "Divergent
Healthcare Limited" — the legal entity, not the name anyone clicking through is
looking for. CQC registers the provider and each location separately, and the
location page is titled "Kare Plus Rugby". The footer button now goes there
(`1-19892028472`), and both IDs are shown. Verified against cqc.org.uk on
2026-08-25: name, address, phone and "not yet inspected" all match.

The CQC statement itself still names Divergent Healthcare Limited as the
regulated provider, because that is the required wording and it is accurate.

### 2026-08-24 — Share cards had no image on ten pages

**New:** `lib/seo.js`. **Changed:** the eleven page files that set `openGraph`.

**Why:** found by rechecking the rendered HTML of every live page. Next.js does
not deep-merge `openGraph` — a page setting any openGraph field replaces the
whole inherited object, including `images`. The root layout declared a valid
og:image and the file served 200, yet `/`, the three service pages, `/careers`
and all five jobs pages rendered no og:image at all. Sharing any of them on
WhatsApp, Facebook or LinkedIn gave a bare text link with no picture.

Every page now builds openGraph through `og()`, which cannot drop the image.
Verified: 14/14 pages carry og:image and their own titles are unaffected.

### 2026-08-24 — Staff pay published

**New:** `lib/pay.js`, and a `business.pay` block in `config/site.json`.

**Changed:** `lib/jobs.js` (emits `baseSalary`), `app/jobs/[slug]/page.js`,
`layouts/careers/AreaJobsPage.js`, `app/careers/page.js`, `app/faq/page.js`,
`content/vacancies/care-assistant-all-areas.md`.

**Why:** Alif confirmed the pay structure — £12.71 basic (National Living Wage)
plus 12.07% rolled-up holiday pay = £14.24 per hour worked — and asked for it to
be published only if legally sound. Checked: rolled-up holiday pay has been
lawful since 1 April 2024 for irregular-hours and part-year workers, 12.07% is
the statutory accrual rate, and basic must independently meet NMW. Alif
confirmed all four conditions (irregular hours throughout, travel time between
calls paid, holiday itemised on the payslip, basic at NMW).

**The split is always shown**; the bare £14.24 never appears as "the hourly
rate", because £1.53 of it is holiday pay rather than reward for the hour.
`baseSalary` in the JobPosting markup carries £12.71 for the same reason.

**⚠️ REVIEW BY 2027-04-01.** £12.71 is exactly the NLW with no headroom. It
falls below the legal minimum when the NLW rises next April. `lib/pay.js` fails
the build if basic + uplift stops equalling the published total.

### 2026-08-24 — SEO Phase 3: four candidate-facing area pages

**New:** `lib/areas.js`, `layouts/careers/AreaJobsPage.js`, and four static
routes under `app/jobs/` — `care-jobs-rugby`, `care-jobs-coventry`,
`care-jobs-leicester`, `care-jobs-northampton`.

**Changed:** `app/sitemap.js` (area pages added), `app/jobs/page.js` (plain-link
"Care jobs by area" nav so crawlers reach them without JavaScript).

**Why:** SEO-SPEC.md Phase 3. Four pages rather than the twelve role x area
combinations the spec's examples imply, because the eight role-specific ones
could only be written by swapping a job title into otherwise identical text —
the doorway pages the same spec forbids. Skipped combinations and what would be
needed to justify them are recorded in OVERNIGHT-NOTES.md §11.

Verified before deploy: pairwise text similarity between the four pages
25.7-28.4% (doorway territory is >80%), 4/4 unique titles and descriptions,
BreadcrumbList on each, static segments take precedence over `/jobs/[slug]` so
the vacancy route and its JobPosting are untouched and an unknown slug still
returns a real 404.

### 2026-08-07 — P0 security and contact-form fixes

**Added [middleware.js](middleware.js)** — HTTP Basic Auth (`ADMIN_USER` / `ADMIN_PASSWORD`), fails closed if unset.

Protected:
- `/admin` and everything beneath it — was fully public
- `GET /api/messages`, `GET /api/get-started`, `GET /api/request-data` — all three returned personal data to anyone. `request-data` was the worst: it exposed GDPR proof-of-identity details.
- `POST /api/jobs` — anyone could create job listings

Deliberately left public: `GET /api/jobs` (the domiciliary and staffing job lists call it), and the `POST` side of the three form endpoints (that's the public submitting a form).

**Fixed silently broken email.** [app/api/get-started/route.js](app/api/get-started/route.js) and [app/api/request-data/route.js](app/api/request-data/route.js) both called `nodemailer.createTransporter(...)`. No such method — it is `createTransport`. Every send threw a TypeError, was caught, and logged. **The Get Started form and the GDPR data-request form have almost certainly never delivered a single email.**

**Fixed the contact form** in [app/api/messages/route.js](app/api/messages/route.js):
- `NextResponse.redirect("/thank-you")` used a relative URL, which Next.js rejects — the visitor got an error, not a thank-you page
- Changed to a `303` so the browser converts POST→GET and cannot re-submit on refresh
- Email failure was swallowed, showing a thank-you page while the enquiry vanished. It now returns a visible error.
- The `data/messages.json` write is now best-effort in a `try/catch` — an unhandled write failure could take the whole request down. (The VPS filesystem is in fact persistent — see the deployment correction below — but the guard is still right.)

**Fixed invalid recipients.** get-started mailed `info@haven&heartcare.com` — `&` is illegal in a domain, so it could never deliver even once the typo was fixed. Both routes now use `params.contact_email` from [config/config.json](config/config.json) as a single source of truth, with `PRIVACY_EMAIL` able to override for GDPR requests.

**Verification (same day, after installing Node):** `next build` succeeds and reports `ƒ Middleware 26.8 kB`, so the middleware compiles and registers. `next lint` is clean. Ran a dev server and checked every route by hand:

| Check | Result |
|---|---|
| `/admin`, `/admin/messages`, `/admin/jobs` — no credentials | 401 ✅ |
| `GET /api/messages`, `/api/get-started`, `/api/request-data` — no credentials | 401 ✅ |
| `POST /api/jobs` — no credentials | 401 ✅ |
| `/admin` — wrong password, and wrong username | 401 ✅ |
| `/admin`, `GET /api/messages` — correct credentials | 200 ✅ |
| `GET /api/jobs` — must stay public for the job lists | 200 ✅ |
| Homepage — must stay public | 200 ✅ |
| **Fail-closed:** correct credentials but `ADMIN_USER`/`ADMIN_PASSWORD` unset | 401 ✅ |
| `POST /api/messages` with no email credentials | 500 + visible error, no fake thank-you ✅ |

A password containing a colon was used deliberately and worked, confirming the split-on-first-colon parsing.

**Still untested:** the success path of the contact form (the `303` redirect to `/thank-you`), because that needs working `EMAIL_USER`/`EMAIL_PASS`. Test it on the deployed site.

**Confirmed live in production** — every push to `main` auto-deploys, so these fixes went out immediately. Verified against `http://46.252.193.48:3000`:

| Live check | Result |
|---|---|
| `GET /api/messages` — the endpoint that was leaking enquiries | **401** — leak closed ✅ |
| `GET /admin` | **401** ✅ |
| `GET /` homepage | **200** — site healthy ✅ |
| `GET /api/jobs` — must stay public | **200** ✅ |

### 2026-08-07 — Corrected deployment facts

Earlier entries in this file claimed the site was on Netlify, inferred from `netlify.toml`. **That was wrong.** `netlify.toml` is a leftover; the real pipeline is a GitHub Actions SSH deploy to a self-hosted VPS. Consequences that matter:

- Environment variables go **on the server**, not in a hosting dashboard
- The filesystem is **persistent**, not ephemeral — so `data/messages.json` on the server has been accumulating real enquiries, and the unauthenticated endpoint was exposing them for real, not hypothetically. The empty file in git only reflects what was committed.
- Pushing to `main` **is** deploying to production

### 2026-08-07 — Project setup and initial audit
- Configured git on Alif's Mac: `user.name=rakibalif1`, `user.email=tannattharida@gmail.com`, `credential.helper=osxkeychain`
- Cloned `iean/healthcare` into `~/Desktop/website` (a broken, empty `.git` folder from a failed earlier attempt was removed first — it contained no data)
- Added `.env` and `.DS_Store` to `.git/info/exclude`. **The repo's own `.gitignore` covers `.env.local` but not plain `.env`,** so without this the GitHub token would have been committable.
- Full read-only audit of stack, routes, content, config, and styles
- Created `PROJECT.md` (this file) and `CLAUDE.md`
- **No website code changed.**

---

## 7. Backlog / Next Steps

### P0 — Security & data protection

**Re-verified against production on 2026-08-27.** Everything in this section
that described the VPS is obsolete — the site is on Vercel behind HTTPS, and
the VPS at `46.252.193.48` was never reachable. Those items are struck rather
than deleted so the history stays readable.

- [x] **`/admin` had no authentication** — Basic Auth in [middleware.js](middleware.js). Confirmed 401 in production 2026-08-27.
- [x] **`GET /api/messages` exposed every contact submission** — confirmed 405 in production 2026-08-27.
- [x] **`GET /api/get-started` and `GET /api/request-data` exposed personal data** — authenticated.
- [x] **`POST /api/jobs` was unauthenticated** — authenticated.
- [x] **Get Started + GDPR emails never sent** (`createTransporter` typo) — fixed.
- [x] **Contact form redirect threw / email failed silently** — fixed.
- [x] ~~The site has no HTTPS~~ — **obsolete.** Vercel serves HTTPS with HSTS (`max-age=63072000`); `http://` and the apex both 308/307 to `https://www.`.
- [x] ~~The domain does not resolve~~ — **obsolete.** `www.kareplusrugby.co.uk` resolves and serves.
- [x] ~~Replace `params.contact_email` (`masud.official@gmail.com`)~~ — done; it is `kp.rugby@kareplus.co.uk` everywhere.
- [x] ~~Add `set -e` to the deploy workflow~~ / ~~make the server use pnpm~~ — **obsolete**, the workflow was deleted. Vercel builds from `main`.
- [x] ~~Read `data/messages.json` on the server~~ — **obsolete.** No VPS ever served traffic, so nothing accumulated there. `data/messages.json` is not tracked; Vercel's filesystem is ephemeral.
- [ ] **Set `ADMIN_USER` and `ADMIN_PASSWORD` in the Vercel project environment.** Still outstanding — `/admin` returns 401 to everyone including Alif until they are set. [middleware.js](middleware.js) fails closed by design. Use a long random password.
- [ ] **Confirm `EMAIL_USER` / `EMAIL_PASS` are set in Vercel** and test all three forms end-to-end (contact, get-started, request-personal-data) — confirm an email actually arrives. Not verifiable from outside; needs Alif.
- [ ] **`ico_registration` is still `[TODO]`** in `config/site.json`. A care provider handling health data should be ICO-registered and say so. The `isReal()` guard hides the field, so nothing broken renders — but the gap is real.
- [x] **Build and runtime verification** — done 2026-08-07, re-done 2026-08-27.

### P1 — Broken and wrong content

**Re-verified 2026-08-27.** Most of this section was written against the old
Heart & Haven site and was no longer true; corrected below.

- [x] ~~`/supported-living` is in the main nav but does not exist~~ — **false now.** The page exists, returns 200, and is in the sitemap.
- [x] ~~Footer is Lorem ipsum~~ — **false now.** `footer_content` is real copy. No "lorem ipsum" appears on any live page.
- [x] ~~Contact email is a developer's personal Gmail~~ — **false now.** `kp.rugby@kareplus.co.uk`.
- [x] ~~Footer menu is full of dead `#` links~~ — **false now.** A crawl of 33 live pages found **zero** `href="#"` links; the legal pages link correctly.
- [x] ~~`metadata.meta_image` is empty~~ — **false now.** `/images/og-default.png`, and `og:image` is present on every page checked.
- [x] ~~Possible duplicate `/domiciliary/jobs` vs `/domiciliary/available-jobs`~~ — neither route exists.
- [ ] **The orphaned `/domiciliary/*` and `/staffing/*` sections are still live and indexable.** Ten pages, all `robots: index, follow`, all self-canonical, none in the sitemap and none linked from the main nav or footer — they only link to each other. They duplicate the real pages: `/domiciliary` competes with `/domiciliary-care`, `/staffing` with `/care-home-staffing`, and `/domiciliary/about` and `/domiciliary/about-us` carry the *same `<h1>`* as each other. Content is correctly rebranded (Kare Plus, right phone), so this is purely an SEO/duplication problem, not a public-embarrassment one. **Decision needed from Alif:** 301 them to the canonical pages, or `noindex` them. Recommend redirecting.
- [ ] **`config/social.json` is a second source of truth for the phone number.** It holds its own `"phone": "01788 422422"`, and `layouts/components/Social.js` builds `tel:01788422422` from it — valid, but the only non-E.164 `tel:` on the site. Point it at `site.business` instead.
- [ ] **`/how-we-work` is indexable and linked from every page but is not in `app/sitemap.js`.** Minor inconsistency — either add it or decide it is deliberate. (`/staff` is correctly `noindex` and correctly excluded.)
- [ ] **`content/_index.md` is orphaned template debris** — still full of lorem ipsum, referenced by no route (verified by grep). It renders nowhere, so nothing is exposed, but it should be deleted.
- [ ] **Two title tags exceed ~60 chars** and will truncate in search results: `/paying-for-care` (82) and `/jobs` (73).

### P2 — Design & polish (the actual redesign)

- [ ] Agree design direction with Alif and fill in §5
- [ ] Homepage redesign — make the three service lines and the two audiences immediately clear
- [ ] Accessibility pass — **check gold `#b9892f` on white for WCAG contrast; it is likely to fail for body text** and should probably be restricted to large text and button backgrounds
- [ ] Consistency pass across `/domiciliary/*` and `/staffing/*`, which were built separately and drifted
- [ ] Mobile pass at 375px
- [ ] `TeamShowcase` is commented out in [app/domiciliary/about/page.js](app/domiciliary/about/page.js) — decide whether to restore or delete

### P3 — Housekeeping

- [ ] **30+ stale `codex/*` branches** on the remote. Delete the merged ones.
- [x] ~~`.DS_Store` files are committed~~ — **false now**, `git ls-files` finds none (verified 2026-08-27).
- [x] ~~`content/elements.md` is a template demo page~~ — already deleted.
- [ ] **The `/admin` job form almost certainly cannot work on Vercel.** [app/api/jobs/route.js](app/api/jobs/route.js) does `fs.writeFile` to `data/jobs.json` under `process.cwd()`. Vercel's serverless filesystem is read-only outside `/tmp`, so `POST /api/jobs` should throw — and even if it wrote, the change would vanish on the next invocation. Not verified end-to-end because `/admin` is locked (no `ADMIN_USER` set), so this is reasoning from the code, not an observed failure. The vacancy that *is* live (`/jobs/care-assistant-all-areas`) comes from Markdown in `content/vacancies/`, which is the path that actually works. Either drop the admin job form in favour of Markdown, or move storage to a real datastore.
- [ ] `README.md` is still Themefisher's template readme; replace with real project docs.
- [ ] `eslint-config-next` is pinned to 13.0.6 while Next is 14.2 — mismatched.

---

## 8. Open Questions & Decisions

### Decisions made

| Date | Decision | Why |
|---|---|---|
| 2026-08-07 | Track everything in `PROJECT.md` + a short `CLAUDE.md` pointer | New chat sessions start with no memory; `CLAUDE.md` auto-loads and points here |
| 2026-08-07 | Token stored in macOS Keychain, `.env` in `.git/info/exclude` | Keeps the credential out of `.git/config` and un-committable |
| 2026-08-07 | Audit before any code change | Understand the site before redesigning it |

### Open questions for Alif

1. **The domain doesn't resolve.** Is `heartandhavencare.co.uk` registered? The site is only reachable at `http://46.252.193.48:3000`.
2. **Supported Living** — build the page, or remove it from the nav?
3. **Design references** — 2–3 sites whose look you like?
4. **Which section first** — homepage, domiciliary, or staffing?
5. **Do `/pricing` and `/faq` belong** on a care website, or are they template leftovers?
6. **What business email** should replace `masud.official@gmail.com`?
7. **Who else works on this repo?** Several branches suggest other contributors — pushing to `main` may affect them.

---

## 9. Working Process

Follow this loop every session.

1. **Read this file first** — §3 site map, §4 design system, §6 recent work, §7 backlog.
2. **Agree the target** — confirm with Alif what this session covers, or take the top unblocked backlog item. One focused thing, not a sweeping rewrite.
3. **Check before you build** — search [layouts/](layouts/) for an existing component before writing a new one. This codebase already has heavy duplication between `domiciliary/` and `staffing/`; don't add more.
4. **Style from §4** — use `primary`/`accent`/`background` and `text-h1`…`text-h6`. Never hardcode a hex that isn't in §4. For a global change, edit [config/theme.json](config/theme.json) rather than individual components.
5. **Verify** — run `pnpm dev` and actually look at the page. Check 375px width. Confirm you broke nothing adjacent. *(Blocked until Node is installed — see §2. If you cannot verify, say so plainly rather than claiming it works.)*
6. **Log it** — add a §6 entry: date, what changed, which files, why. Tick the §7 item.
7. **Update §4** if you introduced a new token, spacing rule, or component pattern.
8. **Commit and push** with a clear message.

### Rules

- **Topic changes: update §3 first.** Mark the page `Rewrite` and note the new topic *before* editing. An interrupted session then still leaves a readable trail.
- **Never commit `.env`.** It holds a GitHub token.
- **Never touch a page marked `Keep`** without asking.
- **Do P0 security items before cosmetic work.** Real people's contact details are exposed right now.
- **Use pnpm**, never npm or yarn — the lockfile is pnpm's.
- **Push to `main` freely.** Alif granted standing permission 2026-08-07 — don't ask each time. Force-pushes, branch deletion, and history rewrites are still worth a check-in. Other people work on this repo, so `git pull` before starting.
