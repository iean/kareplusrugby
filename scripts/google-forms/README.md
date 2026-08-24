# Rebuilding the two Google Forms

Two scripts. Each one rewrites one form. You run them yourself — I have no
access to your Google account, so this is the only way I can actually change
the forms rather than just describe changes for you to make by hand.

## Why the forms are being restructured

**The form people could open collected no way to contact them.** The current
Pre-employment form asks ten questions — date, name, where you live, gender,
how long in care, visa status, driving, own car, DBS, Update Service — and not
one of them is an email address or a phone number. It does not auto-collect
email either, because that would force a Google sign-in. So a completed
application arrives with no route back to the person.

**And the form that does have contact details is behind a sign-in wall.**
That is caused by its file upload questions. Google forces sign-in on any form
containing a file upload, and no setting turns it off.

So the split is wrong. It is fixed by moving the boundary:

| | Before | After |
|---|---|---|
| **Form 1** | Screening questions, no contact details | The full application, including email and phone. No uploads, so **no sign-in**. |
| **Form 2** | The real application, blocked by sign-in | Documents only, sent *after* a coordinator has spoken to them. Sign-in is fine by then. |

## Running them

For each form, one at a time:

1. Open the form in **edit** mode.
2. **⋮** (top right) → **Apps Script**.
3. Delete everything in the editor. Paste in the whole script file.
4. **Save**, then **Run**.
5. Google asks you to authorise it. That is expected — it is your own script
   acting on your own form. Choose your account, then *Advanced* → *Go to
   (project name)* → *Allow*.
6. Reload the form.

| Form | Script | Function that runs |
|---|---|---|
| Pre-employment / screening | `rebuild-application-form.gs` | `rebuildApplicationForm` |
| Application (the one with uploads) | `rebuild-documents-form.gs` | `rebuildDocumentsForm` |

## Before you run them

**Both scripts replace every question on the form.** They refuse to run if the
form already has responses, so you cannot lose data by accident. If a form does
have responses you want to keep, use **File → Make a copy** first and run the
script on the copy.

## Two things I changed for legal reasons, not cosmetic ones

**Gender is no longer a required screening question.** It is a protected
characteristic under the Equality Act 2010, and asking for it as a compulsory
part of screening looks like you are selecting on it. It is still there, but
moved to the end, made optional, and labelled as monitoring that plays no part
in the decision. That is the normal way employers handle it.

**"Visa status?" is now "Do you have the right to work in the UK?"** Checking
the right to work is required and entirely lawful. Asking for visa status as
free text invites nationality information you should not be making decisions
on. The new question gets you what you actually need — can they work, do they
need sponsorship — without the risk.

Also added: a UK GDPR consent line on form 1 (applicants have to be told what
happens to their data), and on form 2 a confirmation that referees have agreed
to be contacted, since you are collecting those people's details from someone
else.

## After the rebuild

Form 1's link goes on the website. Form 2's link does **not** — send it by
email or WhatsApp once you have spoken to someone. If a candidate cannot or
will not sign in to Google, tell them to email documents to
kp.rugby@kareplus.co.uk instead. The form is a convenience, not the only route.
