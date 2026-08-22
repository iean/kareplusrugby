# Overnight notes — Kare Plus Rugby

Working through `WEBSITE-WORK-PLAN.md` on branch `main-kare-plus`.
Written as I go. Newest phase at the bottom.

**Nothing has been pushed to `main`. No PR opened. That is yours.**

---

## Phase 0 — starting position

- Branch: `main-kare-plus` ✅
- `git status`: one untracked file, `public/images/WEBSITE-WORK-PLAN.md` — the
  plan itself. No work in progress, so I treated the check as satisfied and
  continued rather than stopping. Flagging it because the plan said to.
- `pnpm build`: **passes, exit 0, zero warnings.** Nothing to fix first.

**Deviation:** the plan says `npm run build` / `npm run lint`. `CLAUDE.md` rule 7
says pnpm, never npm — npm here corrupts the lockfile and has broken the Vercel
build before. I used `pnpm`, which runs the identical scripts.

---

## Phase 1 — audit

Wrote `AUDIT.md`. No files changed during the pass.

Headline: **the plan was written against an older version of the site.** Much of
Phase 2, 4 and 5 is already done. Six of the plan's own assumptions are no longer
true (`AUDIT.md` §I) — including the two it is most confident about: there is no
homepage carousel any more, and no "Cloud Support" card.

What the audit found that the plan did *not* know about:

- **`/pricing` is live and publishes invented prices** (£49/£69/£99 "plans",
  "Customs Clearance", "Cloud Service") — template debris on a regulated care
  site. The single worst thing on the site.
- **`/elements`** is a live template typography demo.
- **`/api/messages` writes names, emails and phone numbers into
  `data/messages.json`, which is tracked in git** — a direct breach of the
  plan's hard rule. The file is empty today, so no personal data was ever
  committed.
- **Three live 404s**, including a spelling mistake (`/domciliary/`).
- **The footer's map-pin icon still 404s** — plan item 2.2 was only half fixed.
- **Legacy `SeoMeta` still emits `og:url` = `//pricing`** — plan item 2.3 was
  fixed on the modern pages only.
- **30 instances of 15px body text** against the plan's 16px floor.

---

## Phase 2 — fixing the known faults

The plan's numbered items 1–7 were mostly already done (see `AUDIT.md` §I). The
real work was the faults the audit turned up. Commits, in order:

| Commit | What |
|---|---|
| `64e6bd2` | Removed `/pricing` and `/elements` |
| `26d9d5a` | Stopped three forms writing personal data into the repo |
| `feb271f` | Fixed four broken links and the footer map pin |
| `771f0a9` | Fixed duplicate and wrong page metadata |
| `4253bc4` | Deleted the dead template components |

### `64e6bd2` — the fabricated pricing page

`/pricing` was live and advertised "Basic £49/month", "Professional £69/month"
and "Business £99/month", with features including "Customs Clearance" and
"Cloud Service". Straight Bigspring template content nobody had removed. On a
CQC-regulated care site this is the one thing on the page a family could have
acted on and been misled by. Gone, along with `/elements` (typography demo) and
`content/faq.md` (lorem ipsum, unreachable but one config edit from being live).

Both URLs 301 rather than 404, so whatever Google has indexed is superseded
rather than left to age out. `/pricing` → `/faq`, which explains honestly that
rates are quoted on enquiry.

### `26d9d5a` — personal data in the repository

Three endpoints appended every submission to a JSON file under `data/` and
served the whole list over GET:

- `/api/messages` — name, email, phone, message. **`data/messages.json` was
  tracked in git.**
- `/api/get-started` — who needs care, name, email, phone
- `/api/request-data` — name, email, phone, and a *proof of identity* field

The last is the worst: a subject access request carries identity details by
definition, so filing it into the repo is the exact processing someone would be
exercising their rights against.

**It had never worked in production** — Vercel's filesystem is read-only, which
is why the admin message viewer always said "No messages". So removing it costs
no working feature. All three now email and retain nothing.

Found while rewriting them: submissions were interpolated into the HTML email
**unescaped**, and two of the three had no server-side validation at all.

### `771f0a9` — metadata that had never worked

Fixing `base_url` exposed the bigger problem. `SeoMeta` emitted a **second**
`<title>`, description and `og:url` into the head next to the root layout's.
The first of a duplicated pair wins, so `/how-we-work`, every blog post and
every blog pagination page had been serving the **generic site title** — the
exact opposite of what the component existed to do. Those pages now use Next's
`metadata` export and `SeoMeta` is deleted.

Also: the root layout set `openGraph.url`, and metadata is inherited — so every
page carried `og:url = <homepage>`, telling Facebook and LinkedIn that a share
of any page was a share of the homepage.

And `/domiciliary-care-home` rendered an **entirely empty `<main>`**: the
component fetched its content and then returned only a meta tag. Nothing linked
to it. Retired to `/domiciliary-care`.

---

## Phase 3 — the new pages

| Commit | What |
|---|---|
| `87fa9e8` | Job application form extended to the plan's field list |
| `6d1d8a4` | Vacancies driven by markdown |
| `36cfcd2` | Care enquiry form asks more, and requires less |
| `cad6b43` | New `/referrals` page for professionals |
| `e70db20` | New `/staff` signposting hub |

**3a Careers** — the page already existed. Added the missing fields (care
experience band, DBS on the update service with a real "not sure" option,
availability as checkboxes, free-text). Right to work and driving licence were
single checkboxes, which cannot tell "no" apart from "never answered"; both are
yes/no radios now.

Vacancies moved from `data/jobs.json` behind the admin login to
`content/vacancies/*.md`. With none published the page says so and invites a
speculative application — it never falls back to a sample role.

**3b Enquiry** — added area, support type, funding and contact preference. More
importantly it now *requires less*: name plus one contact method, enforced
server-side too. Description, phone and email had all been mandatory.

**3c Referrals** — new. Takes **initials only** for the person being referred,
enforced in the API rather than just hinted at, and tells professionals to
phone for anything urgent or clinically detailed.

**3d FAQ** — already done, and better than the plan asked. The plan wanted
`TODO:` stubs; there are real answers that explain how a figure is arrived at
instead of inventing one. Left alone.

**3e Staff hub** — new, signposting only. Every system link and policy download
is TODO-guarded, because I do not know the real URLs and a guessed sign-in link
sends a carer somewhere wrong. See the TODO list at the top of this file.

---

## Phase 4 — local SEO

| Commit | What |
|---|---|
| `bb58ba2` | Removed the template blog posts |
| `48a662e` | Fixed the duplicated carousel slides and auto-advancing banners |
| `288b4e2` | Removed fabricated job adverts; recruitment consolidated on `/careers` |
| `754cf96` | Unique title, description and canonical on every page |

Three more pieces of invented content surfaced here, none of which the plan
mentions:

1. **The blog was five Bigspring sample posts** — photography, "how to make toys
   from old Olarpaper", a CRM dialer — with blog-1 identical to blog-3 and
   blog-2 to blog-4, all sharing one lorem meta description.
2. **`/domiciliary/jobs` advertised three vacancies that do not exist**, with
   working "Apply Now" buttons: Care Assistant in **London**, Support Worker in
   **Birmingham**, Registered Nurse in **Manchester**. Hardcoded in a component.
   This company is in Rugby.
3. **The plan's item 2.1 was real after all.** The homepage carousel was gone,
   so it looked fixed — but `/staffing` and `/domiciliary/care-services` still
   rendered five `<h1>`s from three slides, with two headings appearing twice,
   because Swiper's `loop` clones slides into the DOM.

Every route now has exactly one `<h1>`, a unique title and description, and a
canonical. Verified against the built HTML, not assumed.
