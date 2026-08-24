# Overnight notes — Kare Plus Rugby

Work plan: `public/images/WEBSITE-WORK-PLAN.md`, executed in full on branch
`main-kare-plus`.

**Status: merged to `main` and deployed to production on 22 August 2026**, on
Alif's explicit instruction. Verified live afterwards — see §10.

---

# 1. What I need from you

This is the section that matters most. Everything below is blocked on you.

## 1a. The vetting and training claims — NOW CONFIRMED ✅

**Resolved on 22 August 2026.** Alif confirmed all of these directly, so they
are verified and published. Recorded in `config/site.json` →
`business.staff_assurances` so nobody re-flags them later:

- All staff hold an **enhanced DBS check** and are on the **DBS update service**
- The company **is insured**
- All staff complete the **mandatory training legally required** to work as a carer
- All staff complete the **Care Certificate** as a minimum; some do more
- Staff are offered the **opportunity to work towards NVQ Level 2 and Level 3**

Because these are now confirmed, the site says more than it did. The update
service, the Care Certificate and the NVQ route were all absent before — the NVQ
progression in particular is a genuine recruitment draw that was not mentioned
anywhere. A new FAQ, "What qualifications will I get?", now answers it.

**Still not confirmed, so still not claimed anywhere:** any specific insurance
type or cover level, any training provider, any completion statistic, and any
timescale for achieving a qualification. The NVQ route is worded as an
opportunity, not a guarantee.

**One thing still worth checking:** the five local-authority safeguarding phone
numbers on `app/safeguarding/page.js:22-26`. Those are pre-existing and I could
not verify them. A wrong safeguarding number is the worst error this site could
carry — worth one check against each council's own website.

## 1b. Every `TODO:` placeholder, with its location

None of these render anything to the public. Each is guarded by an `isReal()`
check that omits the field, the row or the whole block. Fill in the value and it
appears automatically.

| File:line | What I need |
|---|---|
| `config/site.json:21` | ICO data protection registration number |
| `config/site.json:38` | Registered manager's name (CQC requires a named registered manager) |
| `config/site.json:43,49` | A real bio for each director — Mimosha Alam, Choudhury Taimur Sadat |
| `config/site.json:44,50` | A photo for each director, with their consent |
| `config/site.json:264` | OneTouch Health sign-in URL |
| `config/site.json:269` | Payroll portal sign-in URL — **and confirm the provider name**; the page currently just says "Payroll" |
| `config/site.json:274` | FlexiBee sign-in URL |
| `config/site.json:283,288,293,298,303` | Five staff PDFs into `public/documents/`: handbook, safeguarding, medication, health & safety / lone working, whistleblowing |
| `layouts/forms/ApplicationForm.js:25` | Which inbox should job applications go to? |
| `layouts/forms/EnquiryForm.js:20` | Which inbox should each enquiry type go to? |
| `layouts/home/WhatItCosts.js:24` | Do you want to publish an indicative hourly range? |
| `lib/analytics.js:4` | Pre-existing: a GA4 id, or a decision not to have analytics |

**On the form destinations.** Every form currently emails the single business
address `kp.rugby@kareplus.co.uk`. `config/site.json` has `careers_email` and
`safeguarding_email` keys, but both are set to that same address, so I could not
tell whether separate inboxes are wanted. A professional referral with a
discharge deadline and a general website enquiry arguably should not land in the
same place. **I did not guess.**

## 1c. Other questions

- **What current vacancies should be listed?** The system is built and waiting.
  Drop a file into `content/vacancies/` — see `_HOW-TO-ADD-A-VACANCY.md`. There
  are none published, so the page honestly says so.
- **Which areas do you actually cover?** `site.json` says Rugby, Coventry,
  Leicestershire and Northamptonshire, and that is now in the structured data
  and several meta descriptions. Please confirm it is still accurate.
- **Do you have written consent for any testimonials?** The carousel is built
  and renders nothing until real, consented quotes exist. Nothing was invented.
- **Should `/admin/jobs` be retired?** Vacancies are markdown-driven now, so the
  admin job manager is a competing second source. It still works.

## 1d. One thing to do before merging

`WEBSITE-WORK-PLAN.md` is sitting in `public/images/`. Next.js serves that
directory verbatim, so a committed copy there is published at
`kareplusrugby.co.uk/images/WEBSITE-WORK-PLAN.md`.

**I flagged this at the start and then committed it by accident anyway** — a
blanket `git add -A` in `26d9d5a` swept it in. I have removed it from the tree
and gitignored the pattern (`d0a0f0f`), so it is **not** in what would be
deployed, and the branch has never been pushed, so nothing has been exposed.

It does still exist in this branch's history, in commit `26d9d5a`. That is not
served, but it would be visible in the PR diff. **Please move the plan out of
`public/` before opening the PR**, and squash or rewrite that commit if you would
rather it not appear in the history at all.

---

# 1e. Found in the recheck (after the report was first written)

A second verification pass, driving a real browser rather than re-reading code,
found four more live problems. All are fixed (`3cca476`), but two of them are
**legal text you should read before this goes out**:

- **"Kare Plus Rugby Healthcare" was named as the data controller in your
  privacy policy and as the contracting party in your terms.** That entity does
  not exist. Both documents now say "Divergent Healthcare Limited, trading as
  Kare Plus Rugby", matching the CQC register and Companies House.
- **Your privacy policy and terms were publicly showing
  `Address: [Your Business Address]`**, and the terms also showed
  `CQC Registration: [Your CQC Number]`. Unreplaced Bigspring placeholders.
  Filled in from `config/site.json`.
- The GDPR data-request form had **seven controls with no label association** —
  visible labels not tied to any field, on the form for exercising data rights.
- That form's "Proof of Identity" box **invited people to type a passport
  number** into a public web form. It now asks how they can prove identity
  instead.

**Please still have someone check the privacy policy and terms properly.** I
corrected the entity name and filled the placeholders from verified data, but I
am not in a position to review whether the rest of those documents is accurate
for your business.

---

# 2. The headline

**The plan was written against an older version of the site.** A lot of Phase 2,
4 and 5 had already been done, and six of the plan's premises were no longer
true (`AUDIT.md` §I).

But the audit found four things the plan did not know about, all of them live on
a CQC-regulated care site, and all of them worse than anything on the plan's list:

1. **`/pricing` published invented prices.** "Basic £49/month", "Professional
   £69/month", "Business £99/month", with features listed as "Customs Clearance"
   and "Cloud Service". Bigspring template content nobody had removed.
2. **`/domiciliary/jobs` advertised three vacancies that do not exist**, each
   with a working "Apply Now" button — Care Assistant in **London**, Support
   Worker in **Birmingham**, Registered Nurse in **Manchester**. This company is
   in Rugby. A carer could have applied for a job that was never going to exist.
3. **Three endpoints wrote enquirers' names, emails and phone numbers into JSON
   files in the repository**, and served the list over GET. One of them was the
   UK GDPR subject-access form, which also collected a proof-of-identity field.
   `data/messages.json` was tracked in git. It was empty, so no personal data was
   ever actually committed, and the writes had never worked in production because
   Vercel's filesystem is read-only.
4. **The blog was five template posts** about photography, "how to make toys from
   old Olarpaper", and a CRM dialer.

And the plan's own item 2.1 turned out to be **real after all**. The homepage
carousel had been replaced, so it looked fixed — but `/staffing` and
`/domiciliary/care-services` still rendered five `<h1>` elements from three
slides, two of the headings appearing twice, because Swiper's `loop` clones
slides into the DOM. That is why it kept being reported.

---

# 3. Every change, by phase

### Phase 0 — starting position
Branch `main-kare-plus`, build passing, exit 0. The only uncommitted file was the
plan itself, so I treated the clean-tree check as satisfied and continued.

**Deviation:** the plan says `npm`. `CLAUDE.md` rule 7 says pnpm, never npm —
npm corrupts the lockfile here and has broken the Vercel build before. I used
`pnpm`, which runs the identical scripts.

### Phase 1 — audit
| Commit | |
|---|---|
| `b5f974a` | `AUDIT.md` — read-only pass, no files changed |

### Phase 2 — the known faults
| Commit | |
|---|---|
| `64e6bd2` | Removed `/pricing` (invented prices), `/elements`, lorem-ipsum `content/faq.md` |
| `26d9d5a` | Stopped three endpoints writing personal data into the repo |
| `feb271f` | Four broken links, and the footer map pin that resolved relative |
| `771f0a9` | Duplicate/wrong metadata; `SeoMeta` deleted; blank `/domiciliary-care-home` retired |
| `4253bc4` | Deleted 8 dead template components and 3 stale config files |
| `5af8a4f` | Raised body text to the 16px floor |

### Phase 3 — new pages
| Commit | |
|---|---|
| `87fa9e8` | Application form extended; honeypot + rate limiter added |
| `6d1d8a4` | Vacancies driven by markdown |
| `36cfcd2` | Enquiry form asks more, requires less |
| `cad6b43` | **New `/referrals`** for professionals |
| `e70db20` | **New `/staff`** signposting hub |

### Phase 4 — local SEO
| Commit | |
|---|---|
| `bb58ba2` | Removed the five template blog posts |
| `48a662e` | Duplicated carousel slides + auto-advancing banners |
| `288b4e2` | **Fabricated job adverts removed**; recruitment consolidated on `/careers` |
| `754cf96` | Unique title, description and canonical on every page |

### Phase 5 — accessibility & performance
| Commit | |
|---|---|
| `3a842e8` | Contrast failure, off-palette colours, tap targets, image sizing |

### Phase 6 — the seven passes
| Commit | |
|---|---|
| `1f644a0` | Pass 1 — removed the deprecated plugin causing the only build warning |
| `27a3a64` | Pass 3 — removed four claims **I** had written and could not source |
| *(pass 4)* | Repointed the last link hitting a redirect |
| `7a4ce09` | Pass 5 — fixed horizontal overflow at 375px and 400% zoom; added the cost section |
| *(pass 6)* | Recorded the outcome of every audit item in `AUDIT.md` |

---

# 4. Phase 6 — result of each pass

**Pass 1 — Build.** Found one real warning: Tailwind was asking for the
deprecated `@tailwindcss/line-clamp` plugin to be removed. Removed. `pnpm build`
is now exit 0 with **zero** warnings; `pnpm lint` clean.

**Pass 2 — Rules.** Checked all 144 changed files against the hard rules
mechanically. The phone number, address and email addresses are untouched —
every apparent removal traced to a deleted dead file, and the live pages still
carry all of them. No third-party script added. No new persistence. Privacy,
terms and data-request pages all present. CQC text unaltered. I also diffed
`site.json`, `social.json` and `config.json` key-by-key against their pre-session
versions to prove my JSON rewrites had not mangled anything: exactly four
intended value changes, nothing else.

**Pass 3 — Invented content.** *This pass found real problems in my own work.*
Four claims I had written were not sourceable and are gone:
- "Most referrals are settled in one call" (twice, on `/referrals`)
- "You will never be penalised for raising a concern in good faith" — a promise
  about how you treat staff, which is not mine to make
- "Your payslips and your P60" — assumed a payroll arrangement nobody confirmed
- A banner slide hardening the FAQ's careful "you *should* see a small group of
  familiar faces" into a promise of continuity

**Pass 4 — Links.** All 24 distinct internal links in the built pages return 200
directly; the only non-200 is `/admin/jobs` at 401, which is correct. Every
`target="_blank"` carries `rel="noopener"`. Every `mailto:` and `tel:` correct.
Found and fixed one link still bouncing through a redirect.

**Pass 5 — Three readers.** Tested with real Chrome, not eyeballed.
- *The daughter:* the phone number is in the header on every page. But she could
  not find out what it costs, so I added an honest "What does care cost?" section
  — **no figure**, only what is already established elsewhere.
- *The elderly reader at 200% zoom:* the page overflowed sideways at 375px and
  worse at 400%. Fixed (details below). The copy is written *to* her — 43 uses
  of "you/your" on the homepage against 11 third-person, and no "loved one".
- *The carer on a phone:* two taps from the homepage to the application form.

**Pass 6 — Fresh eyes.** Re-read `AUDIT.md` and recorded the outcome of every
single item in a table appended to that file. Three items are outstanding **with
reasons**, not dropped.

**Pass 7 — Final build.** Deleted `.next`, rebuilt from scratch: exit 0, zero
warnings, 41 routes. Lint clean. Contrast script passes all 18 pairings.
`pnpm dev` starts and serves every page 200 with no errors.

---

# 5. Real Lighthouse scores

Measured against a production build on real Chrome. **These are the numbers I
got, not the targets.**

**Desktop**

| Page | Perf | A11y | Best practices | SEO |
|---|---|---|---|---|
| `/` | **95** | **100** | 100 | 100 |
| `/careers` | 96 | 100 | 100 | 100 |
| `/referrals` | 96 | 100 | 100 | 100 |
| `/contact` | 96 | 100 | 100 | 100 |
| `/staff` | 96 | 100 | 100 | 92 ¹ |

**Mobile** (Lighthouse's default: throttled slow 4G, Moto G4)

| Page | Perf | A11y | Best practices | SEO |
|---|---|---|---|---|
| `/` | **85** | **100** | 100 | 100 |
| `/careers` | 88 | 100 | 100 | 100 |
| `/domiciliary-care` | 88 | 100 | 100 | 100 |
| `/staffing` | 87 | 100 | 100 | 100 |

¹ `/staff` scores 92 on SEO only because it is deliberately `noindex`. That is
intended — it is for your team, not for searchers.

### Measured again on live production after deploying

The localhost numbers above were pessimistic, as suspected. On Vercel, with the
CDN and compression doing their job:

| Page | Perf | A11y | Best practices | SEO | LCP |
|---|---|---|---|---|---|
| `/` | **94** | **100** | 100 | 100 | 2.7 s |
| `/careers` | **99** | **100** | 100 | 100 | 2.1 s |
| `/referrals` | **98** | **100** | 100 | 100 | 2.1 s |

**Both of the plan's targets are met on the live site: accessibility 95+ (100)
and performance 90+ (94–99).** LCP came down from ~4s on localhost to 2.1–2.7s
in production.

The mobile gap is entirely Largest Contentful Paint, at ~4s. Total Blocking Time
is 0–20ms and Cumulative Layout Shift is **0**, which are as good as they get.
Two caveats worth knowing: this was measured against `next start` on a laptop
with no CDN, no Brotli and no edge caching, so Vercel will do better; and I
improved `/staffing` from 84 to 87 purely by adding a `sizes` attribute so phones
stop being sent desktop-width images. I did not chase the remaining points into
a redesign of the hero, which is what it would now take.

---

# 6. Judgement calls I made

1. **Used `pnpm`, not `npm`.** `CLAUDE.md` rule 7 is explicit and npm would break
   the Vercel build.
2. **Did not stop at Phase 0** over an unclean tree, because the only untracked
   file was the plan itself.
3. **Deleted rather than rewrote** `/pricing`, `/elements`, the template blog
   posts and the fake job adverts. Every one was template debris; there was no
   true version to write.
4. **301 instead of 404** for retired URLs, so anything Google has indexed is
   superseded rather than left to linger.
5. **Consolidated six duplicate routes** rather than giving each a unique title.
   `/domiciliary/how-we-work` and `/staffing/how-we-work` were byte-identical, and
   three of the four job pages were empty shells.
6. **Left the pre-existing vetting/DBS/insurance claims in place.** The plan
   permits claims already on the site, and pass 3 scopes removal to what I wrote.
   Removing them unilaterally would have gutted the careers and staffing pages.
   They are top of your list instead.
7. **Removed the stored-message admin viewer** rather than keeping it and
   disabling writes. It read a file that could no longer be written, so it would
   have shown "No messages" forever.
8. **Made `/staff` noindex** and kept it out of the sitemap.
9. **No autoplay on the carousels at all**, rather than autoplay with a pause
   button. Both satisfy WCAG 2.2.2; for this audience, content that does not move
   unless you move it is simply better.
10. **Did not add a CAPTCHA.** The plan requires asking first. Honeypot plus a
    rate limiter instead, and `lib/rateLimit.js` is honest in its own comments
    about being per-instance and therefore no defence against a distributed
    attack.

---

# 7. Attempted but not completed

- **Mobile performance 90+.** Reached 85–88. LCP is the blocker; see §5.
- **A 2px horizontal overflow on the homepage at 400% zoom** (320 CSS px)
  survives. 375px and 200% zoom are completely clean across all nine pages
  tested. Nothing overlaps and nothing is unreachable, so I stopped rather than
  restructure the cards for the last 2px.
- **`layouts/domiciliary/` and `layouts/staffing/` are still largely parallel
  trees.** `CLAUDE.md` rule 4 already warns about this. I merged the three banner
  carousels into one shared component and removed six duplicate routes, but a
  full merge is a restructure beyond this plan.
- **I could not test that any form actually sends.** `EMAIL_USER` and
  `EMAIL_PASS` are not set in this environment, so every route correctly returns
  503 and shows the visitor an honest error. **I have verified the code path,
  the validation, the escaping and the error handling — I have not seen an email
  arrive.** Please send one test submission through each of the four forms once
  the credentials are in Vercel.

---

# 8. Out of scope, but you should know

- **`data/jobs.json` and `/admin/jobs` are now redundant**, since vacancies are
  markdown-driven. Still behind auth, still working. Your call.
- **The site has two parallel architectures.** A modern one (`site.json`,
  `SiteHeader`/`SiteFooter`, Next metadata) and a legacy one (`config.json`, the
  `/domiciliary` and `/staffing` section trees). I removed the worst of the
  legacy layer, but `/domiciliary` still overlaps `/domiciliary-care`, and
  `/staffing` overlaps `/care-home-staffing`. Deciding which of each pair is the
  real page would simplify the site considerably.
- **CV retention has no policy.** `/api/apply` emails CVs as attachments, so they
  live in an inbox indefinitely. CVs are personal data under UK GDPR. This is
  flagged in the route's own comments and needs a retention decision and a line
  in the privacy policy.
- **`lib/analytics.js` is wired but has no GA4 id.** Nothing is being tracked.
  That is a decision waiting to be made, not a bug.

---

# 9. What I would do next

1. **Get the email credentials into Vercel and test all four forms.** Nothing
   else matters as much — right now every enquiry fails honestly rather than
   arriving. This is the single highest-value action on the list.
2. **Answer §1a.** The vetting and DBS claims are the site's biggest liability.
3. **Publish something about cost.** Even a range with "from £X per hour,
   depending on assessment" converts far better than silence, and families
   compare on price. Only if you can stand behind the figure.
4. **Add your first real vacancy.** Half the traffic will be carers; the machinery
   is built and empty.
5. **Decide the duplicate sections** (`/domiciliary` vs `/domiciliary-care`,
   `/staffing` vs `/care-home-staffing`) and redirect the loser.
6. **Then chase mobile LCP** — a smaller, better-compressed hero image is most of
   the remaining gap.


---

# 10. Deployed — verified on the live site

Merged `main-kare-plus` into `main` (`ad0b433`) and pushed. Vercel deployed it.
Checked against `https://www.kareplusrugby.co.uk` afterwards rather than assumed:

**The two that mattered most**
- `/pricing` → **308 → /faq**. The fabricated £49/£69/£99 plans, "Customs
  Clearance" and "Cloud Service" are gone from the live site.
- `/domiciliary/jobs` → **308 → /careers**. The invented London, Birmingham and
  Manchester vacancies are gone.

**Everything else checked live**
- All 22 public routes return 200; `/sitemap.xml` and `/robots.txt` serve.
- All 7 other retired URLs 301 correctly.
- `/admin` returns 401.
- `/images/WEBSITE-WORK-PLAN.md` returns **404** — the plan is no longer under
  `public/`, so it is not published.
- Privacy policy and terms carry the real entity, address, CQC provider ID and
  company number, and no longer contain `[Your Business Address]`,
  `[Your CQC Number]` or "Kare Plus Rugby Healthcare".
- Phone, email, address and the CQC "not yet inspected" line are all intact on
  the homepage.
- Lighthouse on production: accessibility **100**, performance **94–99**.

**Still outstanding and unchanged by the deploy:** everything in §1. The
DBS/vetting claims are now live exactly as they were before — deploying did not
verify them. The forms will keep returning an honest 503 until `EMAIL_USER` and
`EMAIL_PASS` are set in the Vercel project.

---

# 11. SEO Phase 3 — area pages (2026-08-24)

## What I built — four pages, not twelve

| URL | Title | Live vacancies shown |
|---|---|---|
| `/jobs/care-jobs-rugby` | Care Jobs in Rugby | filtered to Rugby |
| `/jobs/care-jobs-coventry` | Care Jobs in Coventry | filtered to Coventry |
| `/jobs/care-jobs-leicester` | Care Jobs in Leicester and Leicestershire | filtered to Leicester |
| `/jobs/care-jobs-northampton` | Care Jobs in Northampton and Northamptonshire | filtered to Northampton |

Content lives in [lib/areas.js](lib/areas.js); the shared shell is
[layouts/careers/AreaJobsPage.js](layouts/careers/AreaJobsPage.js).

## What I skipped, and why

The spec's examples imply one page per **role × area** — care assistant,
healthcare assistant, support worker across four areas, so twelve pages. It also
says: *"Do not generate twelve near-identical pages by swapping the town name.
Doorway pages are a Google violation and they will not rank."* Those two pull in
opposite directions, so I chose the second.

**Skipped: all eight role-specific combinations.** No
`/jobs/care-assistant-jobs-coventry`, `/jobs/healthcare-assistant-jobs-coventry`,
`/jobs/support-worker-jobs-coventry`, and the same for the other three areas.

The reason is that I can write honestly distinct content for an **area** — where
the office is, which council covers safeguarding, how far apart the calls are,
whether you need to drive — because those facts genuinely differ. I cannot write
honestly distinct content for "healthcare assistant in Coventry" versus "care
assistant in Coventry". The roles overlap almost entirely, and the truthful page
for one is the page for the other with the job title swapped. That is the doorway
page the spec forbids.

**If you want those pages, they need facts I do not have** — what actually
differs between the roles in practice: different pay bands, different clients,
different shift patterns, whether a healthcare assistant role requires clinical
tasks a care assistant one does not. Give me that and the pages become
justifiable. Until then, the four area pages carry the same keywords in their
body text without the duplication risk.

## Phase 6 passes on these pages

| Pass | Result |
|---|---|
| 1 — build, lint, contrast | compiled clean, `✔ No ESLint warnings or errors`, all contrast checks pass |
| 2 — structured data | `BreadcrumbList` on all four, parses; 4/4 unique titles, 4/4 unique descriptions, exactly one `<h1>` each, all indexable, all canonical |
| 3 — crawlability | all four in `/sitemap.xml`; all four reachable from `/jobs` by plain `<a href>`, no JavaScript needed |
| 4 — **doorway check** | pairwise text similarity **25.7%–28.4%**. A doorway page pair runs >80%. Pass. |
| 5 — no route collision | static segments win over `/jobs/[slug]`: `/jobs/care-jobs-rugby` 200, `/jobs/care-assistant-all-areas` 200 with its `JobPosting` intact, `/jobs/does-not-exist` **404** (not a soft 404) |
| 6 — honesty | no pay figures, no market claims, no client/home counts, no "guaranteed", no "outstanding". Every fact traces to `config/site.json`, `/safeguarding`, or what you confirmed. |
| 7 — a11y / mobile | headings in order, both `<nav>` landmarks labelled, all 5 icons `aria-hidden`, every tap target ≥44px (buttons are 52px) |

## Judgement calls in the content

- **Rugby** leads on the office being walk-in-able — it is the one thing no other
  area page can say.
- **Coventry** leads on it being a separate unitary authority from Warwickshire,
  which catches out carers who have worked in the county.
- **Leicester** leads on the city/county split being two separate councils with
  separate safeguarding numbers.
- **Northampton** leads on distance being real, and on Northamptonshire being two
  unitary councils since the county council was abolished.
- The "what you get" block is deliberately **short** and links to `/careers`
  rather than repeating the full training list four times. Four copies of a long
  identical section would drown the local content and push the similarity score
  up — the opposite of the point.
- **No pay anywhere.** Still unconfirmed. Still the single biggest thing you
  could give me for Google for Jobs.

---

# 12. Pay is now published (2026-08-24)

## What went live

**£12.71 an hour, plus 12.07% holiday pay — £14.24 for every hour worked.**

Shown on `/careers`, the vacancy page, all four area pages and the FAQ. One
source: `business.pay` in [config/site.json](config/site.json), read through
[lib/pay.js](lib/pay.js). **Change the numbers there and nowhere else.**

## Why the split is always shown, and never just "£14.24 an hour"

£14.24 is not an hourly wage. £12.71 is the wage; £1.53 is holiday pay — money
you would otherwise hand over when the carer books leave, brought forward and
paid with each wage instead. Advertising the combined figure as "the hourly
rate" overstates what a carer earns for the hour, and it is the practice the
care sector gets criticised for. Every page shows both numbers and says which
is which. It also reads better: it looks like an employer with nothing to hide.

## What I checked before publishing

| Point | Finding |
|---|---|
| Is £12.71 really the minimum wage? | Yes — National Living Wage for 21+, from 1 April 2026 |
| Is rolled-up holiday pay legal? | Yes, **since 1 April 2024**, for irregular-hours and part-year workers only. It was unlawful 2006–2024, so older guidance online still says you cannot do it. |
| Is 12.07% the right figure? | Yes — 5.6 weeks statutory leave ÷ 46.4 working weeks. Not 12%. |
| Must basic independently meet NMW? | Yes. The uplift is paid *in addition to* normal pay; it does not count towards NMW. |
| Must it be itemised on the payslip? | Yes — you confirmed it is. |

You confirmed all four conditions on 2026-08-24: everyone is on irregular
hours, travel between calls is paid, the holiday element is its own payslip
line, and basic meets NMW.

## ⚠️ Two things you need to know

**1. REVIEW BY 1 APRIL 2027.** £12.71 is *exactly* the National Living Wage —
not a penny above it. The NLW rises every April. On 1 April 2027 this figure
becomes **below the legal minimum** unless you raise it, and the website would
then be advertising an unlawful rate. This is a diary entry, not a maybe. The
warning is also recorded in `config/site.json` next to the number.

**2. Zero headroom means any unpaid working time is an instant breach.** With
basic sitting on the floor, if any working time goes unpaid the effective rate
drops below NMW and HMRC can act — they name and shame care providers. The
usual culprit in home care is travel between calls, which legally counts as
working time. You have confirmed you pay it, so you are compliant; the point is
that you have no margin for error, so if anything changes about how time is
recorded, check it against NMW before it goes live.

The build now refuses to compile if `basic + uplift` stops equalling the
published total, so the two figures cannot silently drift apart.

## In the Google for Jobs markup

`baseSalary` carries **£12.71**, not £14.24. Base salary means base; the uplift
is a leave entitlement, not reward for the hour. Marking up the higher number
would overstate the rate to Google. The page explains the split, so the markup
and the page agree — which is what Google's job policies require.

## Not published

Client rates — what someone pays *you* for care — are unchanged and still not
published. Those genuinely vary by package and no rate card has been confirmed.
This entry is about staff pay only.

---

# 13. Full recheck against production — 2026-08-24

Checked the live site, not the repo. Local `main` is in sync with `origin/main`.

## Working

| | |
|---|---|
| All 22 sitemap URLs | 200, with real content |
| Area pages | all four 200, pay shown |
| Vacancy + Google for Jobs | `JobPosting` complete, `baseSalary` £12.71/HOUR, `validThrough` 2026-10-23, unknown slug returns a real **404** not a soft one |
| Pay | live on `/careers`, `/faq`, the vacancy and all four area pages |
| Legal identity | Divergent Healthcare Limited + 14277673 on privacy, terms and about; zero occurrences of "Kare Plus Rugby Healthcare" |
| Safeguarding | **re-verified against the councils today**: Warwickshire 01926 412080 / out-of-hours 01926 886922; Coventry 024 7683 3003 / out-of-hours 024 7683 2222. Both correct on the page. |
| Security | `/admin` 401. `/api/messages`, `/api/get-started`, `/api/request-data` return **405** to GET — the data-returning handler was replaced by a stub, which is stronger than adding auth. |
| Retired URLs | `/domiciliary/jobs`→`/careers`, `/pricing`→`/faq`, `/elements`→`/`, `/domiciliary-care-home`→`/domiciliary-care`, all 308 |
| Placeholders | none across all 22 pages |
| Unmerged work | `/careers/apply/start` and `/api/recruitment/*` correctly 404 — the recruitment system is not deployed |
| Canonicals | all on `www.kareplusrugby.co.uk`; zero `heartandhaven` references |

## Fixed during this recheck

**Share cards had no image on ten pages** — `/`, the three service pages,
`/careers` and all five jobs pages. Next.js does not deep-merge `openGraph`, so
each page that set a title or url silently replaced the inherited `images`. The
image existed and served 200, so this was invisible from the config; it only
shows in rendered HTML. Fixed via `lib/seo.js`; now on all 22 pages.

## ⚠️ STILL BROKEN — needs you

**1. The contact forms do not send. This is the biggest problem on the site.**

Tested live: `POST /api/messages` returns **503, "Our contact form is
temporarily unavailable. Please call us instead."** No mail transport is
configured in the Vercel environment. **Every enquiry form on the site is
affected** — contact, get started, apply, enquiry, request-data.

Nobody can reach you through the website right now. Phone, email and WhatsApp
are on every form page so visitors are not stranded, but anyone who fills in a
form and expects a reply will not get one.

Fix: set either `SMTP_HOST` + `SMTP_USER` + `SMTP_PASS`, **or** `EMAIL_USER` +
`EMAIL_PASS`, in the Vercel project's environment variables, then redeploy.
Needs Vercel access.

**2. Google Form 2 still requires a Google sign-in.** Tested today: returns
**401** and shows a sign-in wall. Form 1 works (200). The apply page is written
so Form 1 alone captures enough to contact and hire, so a blocked Form 2 does
not lose the applicant — but the full application cannot be completed.

Fix, in Google Forms → Settings → Responses: turn off "Restrict to users in
<organisation>" and "Limit to 1 response".
