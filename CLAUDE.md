# Kare Plus Rugby — start here

**Read [PROJECT.md](PROJECT.md) in full before doing anything.** It holds the site map, design system, work log, backlog, and the working process. This file is only a pointer plus the rules that must never be broken.

## What this is

A UK healthcare website for Kare Plus Rugby (legal entity: Divergent Healthcare Limited, company 14277673) — domiciliary care, care home staffing, and supported living. Next.js 14 (App Router) + Tailwind + Markdown content, built on the Bigspring Light template. **Hosted on Vercel** at **www.kareplusrugby.co.uk** — every push to `main` auto-deploys. (www.heartandhavenhealthcare.co.uk is the old domain and serves a separate Vercel project.) The GitHub Actions workflow that deployed to a VPS at 46.252.193.48 has been deleted: no domain resolved to it and every run failed.

Ongoing goal: improve the design and change content/topics as Alif directs, across many sessions.

## Rules

1. **Follow the design system.** The palette is **blue and white**, anchored on the navy in the logo. Use the Tailwind tokens `primary-50`…`primary-950` (brand blue, `primary` = #0E3F89 (see config/theme.json)), `accent` (#847432, used sparingly), `surface`, `text`, `textMuted`, `border`. Never hardcode a hex. For global changes edit `config/theme.json`, not individual components.
   - **Contrast is enforced:** run `node scripts/check-contrast.mjs` after any palette change. It exits non-zero if a pairing fails WCAG AA.
   - PROJECT.md §4 still describes the OLD purple/gold theme and is out of date on this point.
2. **Log every change** in PROJECT.md §6 — date, files, why — and tick the §7 backlog item.
3. **For topic/content changes, update the §3 site map first**, then do the work.
4. **Reuse before creating.** Search `layouts/` first. There is already heavy duplication between `layouts/domiciliary/` and `layouts/staffing/`; don't add more.
5. **Security work in §7 P0 comes before cosmetic work.** `/admin` and `GET /api/messages` are currently unauthenticated on a live healthcare site, exposing real contact details.
6. **Never commit `.env`** — it holds a GitHub token. It's in `.git/info/exclude`, not `.gitignore`, so `git add .env` would still work. Don't.
7. **Use pnpm**, never npm or yarn.
8. **Pushing to `main` deploys to production immediately** via Vercel. Pushing to `main-kare-plus` alone only builds a Preview. There is no staging. Alif granted standing permission (2026-08-07) so you needn't ask — but **build and test locally before you push**, because the users see it seconds later. Force-pushes, branch deletion, and history rewrites still need a check-in. Other contributors work here, so pull first.
9. **If you can't verify a change, say so.** Don't claim something works when you haven't seen it run.

## Commands

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build
pnpm lint
```

Node v24.19.0 is installed at `~/.local/node` (on `PATH` via `~/.zshrc`).

⚠️ `pnpm-workspace.yaml` is **gitignored, and must stay that way**. You need it locally — it's what stops pnpm 11 aborting with `ERR_PNPM_IGNORED_BUILDS`, and `pnpm approve-builds` recreates it — but committing it breaks the Vercel build. See the Deployment section below. (An earlier version of this file said not to delete it, written when the VPS was believed to be the host. Following that instruction is what broke production on 19 August 2026.)

⚠️ **Never add a `.env` to this repo** — Next.js auto-loads it into the server environment. Real secrets go on the VPS, in the pm2 environment.

## Key files

| Path | What |
|---|---|
| [config/theme.json](config/theme.json) | Colors, fonts, spacing — global theme |
| [config/config.json](config/config.json) | Site title, logo, contact email, footer |
| [config/site.json](config/site.json) | Business details, main nav (`nav.primary`), footer nav, SEO defaults. Single source of truth |
| [tailwind.config.js](tailwind.config.js) | Reads theme.json, derives the type scale |
| [app/](app/) | Routes (App Router) |
| [layouts/](layouts/) | React components |
| [content/](content/) | Markdown pages and blog posts |
| [styles/](styles/) | SCSS |

## Deployment — read before pushing

The site is hosted on **Vercel**, which builds from the **`main`** branch.
Pushing to `main-kare-plus` alone only ever produces a Preview build; the
live site does not change. To ship, the commit must reach `main`.

There is no other deploy path. The old `.github/workflows/deploy.yml` that
pushed to a VPS at `46.252.193.48` was deleted — nothing pointed at that
server and every run failed.

Two things that must never be committed, both of which have already broken
a production build once:

- **`pnpm-workspace.yaml`** — gitignored. pnpm 11 writes local build
  approvals there, but its presence makes Vercel treat the repo as a
  monorepo and `allowBuilds:` is a key its older pnpm cannot read.
- A `base_url` pointing at anything other than `https://www.kareplusrugby.co.uk`.

After pushing, confirm the deploy actually landed rather than assuming it:

```bash
curl -s https://www.kareplusrugby.co.uk | grep -o '<title>[^<]*'
```
