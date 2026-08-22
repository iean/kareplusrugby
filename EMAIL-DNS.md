# Email delivery: the DNS records you need

**Who this is for:** whoever manages DNS for `kareplusrugby.co.uk`. Hand them
this page.

**Why it matters:** the recruitment system emails referees and asks them for a
reference. If those emails land in spam, the referee never knows they were
asked, nobody gets a bounce, and the application stalls with no visible cause.
Reference chasing is the part of this system most likely to fail silently, and
these three records are what stop that.

---

## First, a decision that changes everything below

The website is **kareplusrugby.co.uk**. The business inbox is
**kp.rugby@kareplus.co.uk** — a *different* domain, and one that probably
belongs to the Kare Plus franchise rather than to you.

That matters, because SPF, DKIM and DMARC have to be published on the domain in
the **From** address, not the domain in the To address.

| If emails are sent from… | Records go on… | Who has to make the change |
|---|---|---|
| `noreply@kareplusrugby.co.uk` (recommended) | `kareplusrugby.co.uk` | You / your domain manager |
| `kp.rugby@kareplus.co.uk` | `kareplus.co.uk` | **Kare Plus head office** |

**Recommendation: send from your own domain.** Set the From address to
something like `noreply@kareplusrugby.co.uk` or `careers@kareplusrugby.co.uk`
and set Reply-To to `kp.rugby@kareplus.co.uk`. Replies still reach the usual
inbox, but you control the DNS and are not waiting on head office.

That is what `MAIL_FROM` in the hosting environment controls.

---

## 1. SPF — says which servers may send as you

One TXT record on the root of the domain. **You may only have one SPF record.**
If one already exists, merge into it rather than adding a second — two SPF
records is itself a failure.

| Field | Value |
|---|---|
| Type | TXT |
| Name / Host | `@` (the root — some panels want the domain name itself) |
| Value | see below, depending on provider |

Pick the line matching whoever actually sends the mail:

- **Microsoft 365:** `v=spf1 include:spf.protection.outlook.com -all`
- **Google Workspace:** `v=spf1 include:_spf.google.com -all`
- **Resend:** `v=spf1 include:amazonses.com -all`
- **SendGrid:** `v=spf1 include:sendgrid.net -all`
- **Brevo:** `v=spf1 include:spf.brevo.com -all`
- **Postmark:** `v=spf1 include:spf.mtasv.net -all`

If you send through more than one (say Microsoft 365 for staff mail and Resend
for the website), combine the includes in one record:

```
v=spf1 include:spf.protection.outlook.com include:amazonses.com -all
```

`-all` means "reject anything else". Some providers suggest `~all` (softfail)
while you are setting up. Start with `~all` if you like, but move to `-all`
once you have confirmed delivery, or the record is doing very little.

---

## 2. DKIM — cryptographically signs each message

**This one cannot be written out in advance.** DKIM uses a public/private key
pair, and the provider generates the key. You have to log into whichever
provider is chosen, turn DKIM on for `kareplusrugby.co.uk`, and it will give
you the exact record to publish.

It will look like one of these:

| Provider | What they give you |
|---|---|
| Microsoft 365 | Two CNAME records, `selector1._domainkey` and `selector2._domainkey` |
| Google Workspace | One TXT record, `google._domainkey`, with a long `p=` key |
| Resend / SendGrid / Brevo / Postmark | Usually one to three CNAMEs on `<something>._domainkey` |

Publish exactly what they give you, unchanged. DKIM keys are long and a single
altered character silently breaks the signature.

**Do not skip DKIM.** SPF alone is not enough — SPF breaks whenever a message
is forwarded, which is common with work addresses, and forwarding is exactly
what happens to a reference request sent to an NHS or council address.

---

## 3. DMARC — tells receiving servers what to do, and reports back

One TXT record. Start in monitoring mode so nothing is rejected while you
confirm SPF and DKIM are right.

| Field | Value |
|---|---|
| Type | TXT |
| Name / Host | `_dmarc` |
| Value | `v=DMARC1; p=none; rua=mailto:kp.rugby@kareplus.co.uk; fo=1` |

`p=none` means "do not reject anything, just send me reports". Leave it there
for two to four weeks, check the reports show SPF and DKIM passing, then
tighten in two steps:

1. `v=DMARC1; p=quarantine; rua=mailto:kp.rugby@kareplus.co.uk; fo=1`
2. `v=DMARC1; p=reject; rua=mailto:kp.rugby@kareplus.co.uk; fo=1`

Going straight to `p=reject` before confirming the other two records is the
classic way to make all of your email disappear.

---

## Checking it worked

After publishing, and allowing up to 24 hours for DNS to propagate:

1. Ask whoever set this up to hit the test route (`POST /api/careers/test-email`,
   password-protected) and confirm a message arrives.
2. Send a test to a Gmail address you control. Open the message, choose "Show
   original", and confirm all three lines say **PASS**:
   ```
   SPF:   PASS
   DKIM:  PASS
   DMARC: PASS
   ```
3. Or paste the message into a checker such as mail-tester.com.

If DKIM says "none" rather than "pass", DKIM was not enabled at the provider —
publishing SPF and DMARC alone will not fix it.

---

## What the website needs set in its hosting environment

Separate from DNS. These go in the Vercel project's environment variables:

```
SMTP_HOST   the provider's SMTP server
SMTP_PORT   587 (or 465 if the provider tells you to use implicit TLS)
SMTP_USER   the sending account or API key username
SMTP_PASS   the password or API key
MAIL_FROM   noreply@kareplusrugby.co.uk   <- must match the DNS above
```

**Never put these in the repository.** `.env` is gitignored for this reason.
