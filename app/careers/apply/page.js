import PageHeader from "@components/ui/PageHeader";
import Section, { Container } from "@components/ui/Section";
import site from "@config/site.json";
import recruitment from "@config/recruitment-forms.json";
import { ExternalLink, Phone, Mail, CheckCircle2, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Apply for a Care Job",
  description:
    "Apply to join Kare Plus Rugby as a carer or support worker in Rugby, Coventry, Leicester or Northampton. Two short forms, about ten minutes.",
  alternates: { canonical: "/careers/apply" },
};

/**
 * The application route.
 *
 * WHY THIS IS TWO GOOGLE FORMS AND NOT A FORM ON THE SITE.
 *
 * The built-in application system (branch main-kare-plus) is finished but
 * cannot run: it needs a database and SMTP credentials, and the Vercel project
 * belongs to someone else. Until those exist, a form on this site would either
 * fail to save or fail to send.
 *
 * The Google Forms already in use work today and need nothing from us. So this
 * page's job is to get an applicant into them and out the other side, not to
 * collect anything itself.
 *
 * Deliberately NOT re-collecting name, email or phone here. Form 1 already asks
 * for those, and there is nowhere for a second copy to go — no working email
 * transport. Asking twice would annoy applicants and lose some of them for
 * nothing.
 *
 * The links live in config/recruitment-forms.json so a form URL can change
 * without touching code.
 */
const ApplyPage = () => {
  const { forms, replyTo } = recruitment;
  const anyNeedsSignIn = forms.some((f) => f.requiresGoogleAccount);

  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Apply to join us"
        intro="Two short forms and you are done. It takes about ten minutes, and you can do it on your phone."
        breadcrumbs={[{ label: "Careers", href: "/careers" }, { label: "Apply" }]}
        secondary={{
          label: `Call ${site.business.phone}`,
          href: site.business.phone_href,
        }}
      />

      <Section tone="white" size="lg">
        <Container width="narrow">
          <h2 className="text-2xl font-bold text-primary-950">
            What you need to do
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-textMuted">
            Please complete <strong>both</strong> forms below. Fill them in as
            accurately as you can — it is what lets us move your application
            along quickly.
          </p>

          <ol className="mt-8 space-y-6">
            {forms.map((f) => (
              <li key={f.id}>
                <div className="rounded-card border border-border bg-white p-6 shadow-card">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span
                      aria-hidden="true"
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-800 text-base font-bold text-white"
                    >
                      {f.step}
                    </span>
                    <h3 className="text-xl font-bold text-primary-950">
                      <span className="sr-only">Step {f.step}: </span>
                      {f.title}
                    </h3>
                    {f.minutes && (
                      <span className="text-base text-textMuted">
                        about {f.minutes} minutes
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-base leading-relaxed text-textMuted">
                    {f.summary}
                  </p>

                  {/*
                    Honest warning rather than a link that dead-ends. Verified on
                    24 August 2026 that this form redirects to a Google sign-in
                    page — an applicant without a Google account cannot open it.
                    Remove this by fixing the form's settings, not the page.
                  */}
                  {f.essential && (
                    <p className="mt-3 rounded-card border border-success/30 bg-successBg p-4 text-base leading-relaxed text-text">
                      <strong>This is the important one.</strong> Once you have
                      sent this, we have your details and we will be in touch —
                      you are in the process.
                    </p>
                  )}

                  {f.requiresGoogleAccount && (
                    <div className="mt-4 flex items-start gap-3 rounded-card border border-warning/40 bg-warningBg p-4">
                      <AlertTriangle
                        aria-hidden="true"
                        className="mt-0.5 h-5 w-5 shrink-0 text-warning"
                      />
                      <p className="text-base leading-relaxed text-text">
                        This form currently asks you to sign in with a Google
                        account. <strong>If it will not let you in, that does not
                        end your application</strong> — as long as you have sent
                        form 1 we have your details and we will call you, and we
                        can take the rest over the phone. If you would rather
                        sort it now, call{" "}
                        <a
                          href={site.business.phone_href}
                          className="font-semibold text-primary-800 underline underline-offset-4"
                        >
                          {site.business.phone}
                        </a>{" "}
                        and we will take your details another way.
                      </p>
                    </div>
                  )}

                  <a
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-btn bg-primary-700 px-7 py-3.5 text-lg font-semibold text-white transition hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                  >
                    Open form {f.step}
                    <ExternalLink aria-hidden="true" className="h-5 w-5" />
                    <span className="sr-only">
                      : {f.title} (opens in a new tab)
                    </span>
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Step 3: tell us. Without this the coordinator never knows to look. */}
      <Section tone="surface" size="lg">
        <Container width="narrow">
          <div className="rounded-card border border-primary-200 bg-primary-50 p-6">
            <h2 className="flex items-center gap-3 text-xl font-bold text-primary-950">
              <CheckCircle2 aria-hidden="true" className="h-6 w-6 text-primary-700" />
              When you have done both, tell us
            </h2>
            <p className="mt-3 text-base leading-relaxed text-text">
              Google does not tell us the moment you submit, so please send us a
              quick message so we know to look for your forms. One line is
              plenty.
            </p>
            <p className="mt-2 text-base leading-relaxed text-text">
              If you managed form 1 but not form 2, say so — that is completely
              fine and we will pick it up with you.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={`mailto:${replyTo}?subject=${encodeURIComponent(
                  "I have completed both application forms",
                )}&body=${encodeURIComponent(
                  "Hello,\n\nI have completed both of the application forms.\n\nMy name: \nMy phone number: \nThe area I can work in: \n\nThank you.",
                )}`}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-btn bg-primary-700 px-6 py-3 font-semibold text-white transition hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
              >
                <Mail aria-hidden="true" className="h-5 w-5" />
                Email us to say you are done
              </a>
              <a
                href={site.business.phone_href}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-btn border-2 border-primary-700 px-6 py-3 font-semibold text-primary-800 transition hover:bg-primary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
              >
                <Phone aria-hidden="true" className="h-5 w-5" />
                Or call {site.business.phone}
              </a>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="white" size="lg">
        <Container width="narrow">
          <h2 className="text-2xl font-bold text-primary-950">
            What happens next
          </h2>
          <ol className="mt-5 space-y-4">
            {[
              "We read your forms and give you a call to talk about what you are looking for.",
              "If it looks like a fit, we invite you in to meet us.",
              "Then the checks — an enhanced DBS, references and right to work — before you start.",
              "A paid induction and the Care Certificate, then shadow shifts before you work on your own.",
            ].map((t, i) => (
              <li key={t} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-base font-bold text-primary-800"
                >
                  {i + 1}
                </span>
                <p className="text-base leading-relaxed text-text">{t}</p>
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-card border border-border bg-surface p-5">
            <h3 className="text-base font-bold text-primary-950">
              Stuck on any of it?
            </h3>
            <p className="mt-2 text-base leading-relaxed text-textMuted">
              If a form will not open, you would rather not use Google, or you
              would just prefer to talk to a person — call{" "}
              <a
                href={site.business.phone_href}
                className="font-semibold text-primary-700 underline underline-offset-4"
              >
                {site.business.phone}
              </a>{" "}
              or email{" "}
              <a
                href={`mailto:${site.business.email}`}
                className="font-semibold text-primary-700 underline underline-offset-4"
              >
                {site.business.email}
              </a>
              . We would rather help than lose you at a form.
            </p>
            {anyNeedsSignIn && (
              <p className="mt-3 text-base leading-relaxed text-textMuted">
                You do not need any qualifications or care experience to apply.
                We train people who are new to care.
              </p>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
};

export default ApplyPage;
