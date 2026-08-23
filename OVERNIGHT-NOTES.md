# Recruitment system — build notes

`RECRUITMENT-SPEC.md`, built on branch `main-kare-plus`.

**Nothing has been pushed. Nothing merged. `main` is untouched.** The spec ends
"Do not merge. Do not push to `main`", so I stopped at the branch.

**It cannot run yet.** Three environment variables are missing and the Vercel
project belongs to someone else. §1 is what I need from you.

---

# 1. What I need from you

## 1a. Three things block it running at all

| What | Why it stops everything | Where it goes |
|---|---|---|
| **`DATABASE_URL`** | No database, no application can be saved. The form returns 503 and tells the applicant to phone instead — deliberately, rather than accepting a form and dropping it | Vercel env vars. Free tier of Neon or Supabase is ample |
| **`SMTP_HOST` / `SMTP_USER` / `SMTP_PASS`** (or `EMAIL_USER`/`EMAIL_PASS`) | No email means no reference requests, so no application can ever complete | Vercel env vars. See `EMAIL-DNS.md` |
| **`CRON_SECRET`** and **`RECRUITMENT_ADMIN_PASSWORD`** | Without them the chase job and the status page refuse to run. Both fail closed on purpose — an unguarded cron endpoint emails referees and deletes data | Vercel env vars |

Full list of every variable the system reads: `DATABASE_URL`, `DATABASE_SSL`,
`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE`, `MAIL_FROM`,
`EMAIL_USER`, `EMAIL_PASS`, `CRON_SECRET`, `RECRUITMENT_ADMIN_PASSWORD`,
`WHATSAPP_ENABLED`, plus the pre-existing `ADMIN_USER`, `ADMIN_PASSWORD`,
`NEXT_PUBLIC_GA_ID`.

## 1b. Decisions, with file and line

| File:line | Decision |
|---|---|
| `lib/recruitment/notify.js:16` | **WhatsApp: Meta Cloud API or Twilio?** The spec says ask before writing any of it, so I built only the flag (default off) and the message shape. Both need a business account, a verified sender and a Meta-approved template |
| `lib/recruitment/schema.js:16` | **Is 6 months the right retention period?** It is what the spec said. 6–12 months is the usual range; the Equality Act's 6-month discrimination window argues for at least 6 |
| `app/api/careers/delete/route.js:30` | **Self-service deletion — happy with it?** It deletes immediately on reference + email rather than raising a ticket. Reasoning is written out in the file |
| `app/careers/status/page.js:28` | **Set a long random `RECRUITMENT_ADMIN_PASSWORD`**, and change it when anyone with access leaves |
| `config/site.json:21` | **ICO registration number** — still a placeholder, and processing of this kind normally requires registration |
| `PRIVACY-RECRUITMENT.md` | **Who reviews and signs off the privacy notice?** It is a draft and must not be published as-is |
| — | **The real vacancies** for Coventry, Rugby, Leicester and Northampton. The system is built and empty; drop a markdown file into `content/vacancies/` |
| — | **Publish salary on vacancies?** The `pay` field is optional and, left out, the card says pay is discussed on application |

Pre-existing TODOs untouched by this work: `config/site.json` lines 38, 43–44,
49–50 (registered manager, director bios and photos), 273/278/283 (staff system
URLs), 292–312 (five staff PDFs), `lib/analytics.js:4` (GA4 id),
`layouts/home/WhatItCosts.js:24` (whether to publish an hourly range).

---

# 2. What I could not complete

- **Nothing runs end to end in production**, for the three reasons in §1a. It
  all runs locally, against real Postgres and a real SMTP server.
- **WhatsApp** — the spec forbids writing it before you choose a provider.
- **Object storage for uploads.** Files are validated, renamed and attached to
  the notification email, and a metadata row is written. They are *not* put in
  persistent storage, because that needs another credential. Today the email is
  the only copy of a CV. Worth fixing when the hosting question is settled.
- **Per-user logins for the status page.** The spec said a shared password was
  acceptable and to say if it is not. It is not, long term — see §3.

---

# 3. Data protection questions

The spec asked me to be thorough here, so this is the long list.

1. **The emails are the retention hole.** Deleting a database record does not
   delete the copies emailed to `kp.rugby@kareplus.co.uk`. Without a mailbox
   retention rule the 6-month policy is true of the website and untrue of the
   business. **This is the single biggest gap.**
2. **ICO registration** (`config/site.json:21`) is still a placeholder.
3. **Special category data.** A reference can contain health information — a
   referee explaining an absence. That needs an Article 9 basis, most likely
   9(2)(b), plus an **Appropriate Policy Document** under the DPA 2018, which
   does not exist.
4. **Is a DPO required?** Large-scale special category processing makes one
   mandatory. A care provider may cross that line.
5. **Processors are unnamed.** The privacy notice cannot name the hosting,
   database and email providers or confirm a DPA with each until they are
   chosen.
6. **Where is data stored?** If any provider stores outside the UK/EEA, the
   notice must say so and name the safeguard.
7. **Referee data is collected without their consent** — lawfully, under
   legitimate interests, but Article 14 obliges us to tell them where it came
   from. Done, in the request email and on the form. Worth confirming you are
   comfortable with the wording.
8. **Safeguarding disclosures in references.** A referee can allege something
   serious about a named person. That is special category-adjacent, is stored
   in the database and emailed, and there is no process yet for what happens if
   the applicant disputes it — they have a right to know it exists.
9. **Shared password on the status page.** Cannot attribute a view to a person,
   cannot be revoked for one leaver, produces no audit trail. On a page showing
   candidate names beside safeguarding flags, per-user logins with an access log
   is where this needs to end up.
10. **CVs live in an inbox indefinitely** — same problem as (1), flagged in the
    pre-existing `/api/apply` route too.
11. **Self-service deletion is not identity verification.** Reference + email
    is a shared secret, not proof. I judged immediate deletion the right call
    because the failure mode is destruction, not disclosure — but it is your
    call.
12. **Reference PDFs are emailed unencrypted.** Standard practice, but they
    contain a third party's opinion and sometimes a safeguarding allegation.
13. **No retention rule for successful applicants.** The 6-month sweep skips
    `status = 'hired'`, which means those records currently have no end date.
14. **The applicant is not told who their referees are told they are.** Minor,
    but a referee learns the applicant applied for a specific role — worth
    being deliberate about.

---

# 4. DNS records for email delivery

Written for whoever manages the domain, in **`EMAIL-DNS.md`**. The headline:

**The website is `kareplusrugby.co.uk` but the inbox is
`kp.rugby@kareplus.co.uk` — a different domain, probably the franchise's.**
SPF, DKIM and DMARC must be published on the domain in the **From** address.

**Send from your own domain.** Set `MAIL_FROM` to
`noreply@kareplusrugby.co.uk`, with Reply-To pointing at the business inbox.
Replies still land where you expect, and you control the DNS instead of waiting
on head office.

- **SPF** — one TXT record on `@`. Exact value per provider is in the file. Only
  ever one SPF record; merge, never add a second.
- **DKIM** — cannot be written in advance. The provider generates the key and
  gives you the record. **Do not skip it:** SPF breaks on forwarding, and
  forwarding is exactly what happens to a reference sent to an NHS address.
- **DMARC** — TXT on `_dmarc`, starting
  `v=DMARC1; p=none; rua=mailto:kp.rugby@kareplus.co.uk; fo=1`. Move to
  `quarantine` then `reject` only after confirming the other two pass.

Then hit `POST /api/careers/test-email` (password-protected) to confirm
delivery before anything depends on it.

---

# 5. What I built, by phase

| Phase | Commit | What |
|---|---|---|
| 1 | `2c58db0` | Jobs page: location filter across the four areas, accessible radio fieldset, general application route |
| 2 | `582164c` | The nine-section application form, save-and-resume, gap detection, referee rules |
| 5 (email) | `4655431` | Test route and `EMAIL-DNS.md` — done before 3 and 4, as the spec requires |
| 3 | `0fe7408` | Submission: PDF, office email, applicant email, magic-byte uploads |
| 4 | `96ba38d` | The reference loop: tokens, referee forms, chasing, status page, cron |
| 6 | `c0181f5` | Security and data protection, `PRIVACY-RECRUITMENT.md`, deletion route |
| 7 | `3674023` | Fixes from the nine passes |

**A departure from the spec, with your approval.** The spec says SQLite via
better-sqlite3 on a VPS. This site is on Vercel, where the filesystem is
read-only and per-invocation — a SQLite file would vanish between requests,
which is the same bug already removed from this codebase, where three routes
wrote JSON that never persisted. better-sqlite3 also needs a build script, and
CLAUDE.md records that pnpm's ignored-builds behaviour has broken this site's
deploy once. You chose hosted Postgres, which the spec permits ("unless I say
otherwise"). Local development uses PGlite — real Postgres in WASM — so
everything was tested against genuine Postgres SQL.

---

# 6. The nine re-check passes

| Pass | Result |
|---|---|
| **1 — Build** | Clean. Exit 0, **zero warnings**, 50 routes, lint clean, all 18 contrast pairings pass |
| **2 — Leakage** | Clean. No database file, upload, `.env`, credential or test data tracked. Verified by *creating* real files and checking `git check-ignore` on each — 9 of 9 ignored. No hardcoded credentials |
| **3 — End to end, twice** | Run 1 clean: 5 emails out, 3 references back, 4 more emails, token replay refused (410). Run 2 awkward: every case caught — see below |
| **4 — Regulation** | All three Schedule 3 requirements satisfied. One apparent failure was a **tooling artefact**, not a defect (below) |
| **5 — Data minimisation** | Clean. Every grep hit was a false positive — prose saying we *don't* collect it, a "Bank / ad-hoc" shift type, a "Banknote" icon, "visa sponsor" |
| **6 — Accessibility** | Grid: 28 cells, every one text-labelled ("Monday morning"), 8 col + 4 row scoped headers, caption, fieldset + legend, 11 `aria-pressed` toggles, Space toggles, live region announces. Skip link is the first tab stop and lands in `#main`. Zero overflow at 640/375/320px |
| **7 — Three readers** | **Found a real block** — see below |
| **8 — Failure modes** | **Found a real bug** — see below. Also: DB unreachable throws in 31ms and surfaces as a visible 503; SMTP dead still saves the application |
| **9 — Final** | Clean build, then a full run: application → 5 emails → one flagged reference, one decline, one clean → status page shows "2/3 (1 declined) — YES read before any offer" |

### Pass 3, run 2 — awkward input, all caught

`Siobhán O'Reilly-D'Arcy` and `St Mary's Care <Home>` survive into the PDF
intact. Rejected with specific messages: two unexplained gaps; a gmail address
in a professional referee field; two referees sharing an email; a referee using
the applicant's own address; a 6 MB upload; an EXE renamed `cv.pdf`.

### Pass 8 — the bug

**Expired reference tokens could still be completed.** `completeReference()` and
`declineReference()` checked `used_at` and `status` but not `expires_at`. The
API route was safe because it resolves first — but the functions were unguarded
alone, so the next caller skipping that step would have accepted a reference on
a dead token. Both now check expiry in the WHERE clause. Fixed and verified.

### Pass 7 — the block

Reading as **"a 50-year-old returning after 3 years caring for a relative"** —
the reader the spec names — found a hard wall. If their last care employer has
closed or will not reply, the most-recent-care-employer rule stopped them
submitting at all. That loses exactly the candidate you want.

The requirement stands, but CQC guidance accepts a documented reason where a
reference cannot be obtained. They can now explain why (minimum 15 characters,
so a one-word dodge fails), and it becomes a warning the recruiter must resolve,
carried into the PDF under **"Conduct evidence outstanding"**.

### Pass 4 — the false alarm worth recording

A check for the gap section in the PDF appeared to fail. The feature was there
all along: `pdf.js` contained **literal control characters** in its sanitising
regex, so `file` reported it as binary and grep silently skipped it. Rewritten
as `\u` escapes; sanitising verified unchanged (a bidi override and a BEL
character are still stripped from a name).

### One process note

Partway through Phase 7 I found I had been running the passes against `main`,
which does not contain any of this work — the branch had been switched. Nothing
was lost; all commits were safe on `main-kare-plus`. Passes 1 and 2 were re-run
on the correct branch and the results above are from that run.

---

# 7. What I would do next

1. **Get `DATABASE_URL` and SMTP set**, then run the test-email route and one
   real application end to end. Nothing else matters until this works.
2. **Decide the mailbox retention rule** (§3.1). It is the largest data
   protection gap and it is a process decision, not a code change.
3. **Have the privacy notice reviewed** and answer the eight `[DECISION NEEDED]`
   points in it.
4. **Add object storage for uploads**, so a CV is not only in an inbox.
5. **Add the real vacancies** — the machinery is built and empty.
6. **Move the status page to per-user logins** with an access log before more
   than two or three people need it.
7. **Retire `/admin/jobs` and `data/jobs.json`** — vacancies are markdown-driven
   now, so it is a competing second source.
