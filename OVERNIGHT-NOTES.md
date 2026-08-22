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
