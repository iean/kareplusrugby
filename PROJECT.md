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

### Admin (⚠️ **completely unprotected** — see §7 P0)

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

Code fixes are done (2026-08-07). **The remaining items are Alif's to do — the fixes are not live until they are.**

- [x] **`/admin` had no authentication** — now behind Basic Auth in [middleware.js](middleware.js)
- [x] **`GET /api/messages` exposed every contact submission** — now authenticated
- [x] **`GET /api/get-started` and `GET /api/request-data` exposed personal data** — now authenticated. Found during the fix; not in the original audit.
- [x] **`POST /api/jobs` was unauthenticated** — now authenticated
- [x] **Get Started + GDPR emails never sent** (`createTransporter` typo) — fixed
- [x] **Contact form redirect threw / email failed silently** — fixed
- [ ] **Set `ADMIN_USER` and `ADMIN_PASSWORD` on the VPS.** Until then `/admin` returns 401 for everyone, Alif included. Long random password — this guards patient-adjacent data.
- [ ] **The site has no HTTPS.** It serves plain HTTP on `46.252.193.48:3000`. Contact forms carrying names, phone numbers and health details are sent unencrypted, and Basic Auth credentials cross the wire in base64 — trivially readable. **The admin password is only as safe as the connection.** Fix: nginx/Caddy reverse proxy on 80/443 with a Let's Encrypt certificate.
- [ ] **The domain does not resolve.** `heartandhavencare.co.uk` is NXDOMAIN, yet appears in site content. Register/repoint it, then wire it to the VPS.
- [ ] **Read `data/messages.json` on the server** (`/var/www/healthcare/data/`). The filesystem is persistent, so real enquiries have been accumulating there — and were publicly downloadable until today. Anyone who fetched that URL got the lot. Assess whether disclosure notification is needed.
- [ ] **Confirm `EMAIL_USER` / `EMAIL_PASS` are set** on the VPS. If Get Started never worked, they may never have been configured.
- [ ] **Test all three forms end-to-end** — contact, get-started, request-personal-data. Confirm an email actually arrives.
- [ ] **Replace `params.contact_email`** (`masud.official@gmail.com`) with a real Heart & Haven address — all three forms now send there.
- [ ] **Untrack `data/*.json`.** They are committed *and* written at runtime. As soon as the server's copy differs, `git pull` refuses to merge and **every future deploy silently stops updating the site** — the workflow has no `set -e`, so it still reports success. Add to `.gitignore` and `git rm --cached`.
- [ ] **Add `set -e` to the deploy workflow** so a failed build fails the run instead of showing a green tick.
- [ ] **Make the server use pnpm**, or drop `pnpm-lock.yaml`. Right now the server runs `npm install` and ignores the committed lockfile, so production versions can drift from local.
- [x] **Build and runtime verification** — done 2026-08-07, see §6

### P1 — Broken and wrong content

- [ ] **`/supported-living` is in the main nav but does not exist** — [config/menu.json](config/menu.json) links to it, there's no `app/supported-living/` and no content file. Live 404 from the primary navigation.
- [ ] **Footer is Lorem ipsum.** `params.footer_content` in [config/config.json](config/config.json) is still template filler on a production site.
- [ ] **Contact email is a developer's personal Gmail** — `masud.official@gmail.com`. Should be a Heart & Haven business address.
- [ ] **Footer menu is full of dead `#` links** — "Quick Start", "Features", "Platform", and — worse — **"Privacy Policy" and "Terms & Conditions" point at `#`** even though `/privacy-policy` and `/terms-and-conditions` exist. Legal pages that don't open are a compliance risk.
- [ ] **Footer links to `/pricing` and `/faq`** — leftover template pages. Confirm with Alif whether a care business should show these at all.
- [ ] **Duplicate About pages.** `/domiciliary/about` (in the menu) and `/domiciliary/about-us` (orphaned) both render, with different sections. Duplicate content, and confusing. Pick one, redirect the other.
- [ ] Possible duplicate: `/domiciliary/jobs` vs `/domiciliary/available-jobs` — verify and consolidate.
- [ ] `metadata.meta_image` is empty — social shares will have no preview image.

### P2 — Design & polish (the actual redesign)

- [ ] Agree design direction with Alif and fill in §5
- [ ] Homepage redesign — make the three service lines and the two audiences immediately clear
- [ ] Accessibility pass — **check gold `#b9892f` on white for WCAG contrast; it is likely to fail for body text** and should probably be restricted to large text and button backgrounds
- [ ] Consistency pass across `/domiciliary/*` and `/staffing/*`, which were built separately and drifted
- [ ] Mobile pass at 375px
- [ ] `TeamShowcase` is commented out in [app/domiciliary/about/page.js](app/domiciliary/about/page.js) — decide whether to restore or delete

### P3 — Housekeeping

- [ ] **30+ stale `codex/*` branches** on the remote. Delete the merged ones.
- [ ] `.DS_Store` files are committed in `app/`, `content/`, and `layouts/`. Remove from tracking.
- [ ] `content/elements.md` is a template demo page — delete if unused.
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
