import PageHeader from "@components/ui/PageHeader";
import Section, { Container } from "@components/ui/Section";
import site from "@config/site.json";
import OnSiteApplication from "@layouts/forms/OnSiteApplication";
import { Phone, Clock, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Apply for a Care Job",
  description:
    "Apply to join Kare Plus Rugby as a carer, support worker or nurse in Rugby, Coventry, Leicester or Northampton. One short form, about five minutes, no account needed.",
  alternates: { canonical: "/careers/apply" },
};

/**
 * The application route.
 *
 * This used to hand applicants off to two separate Google Forms, one of which
 * forced a Google sign-in and turned away anyone without an account. It is now
 * a single form on our own site (OnSiteApplication) that posts into the same
 * Google Form behind the scenes — so the office still reads responses in the
 * same place, but the applicant never sees Google and never signs in. See
 * config/application-form.json and layouts/forms/OnSiteApplication.js.
 */
const ApplyPage = () => {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Apply to join us"
        intro="One short form — about five minutes, on your phone if you like. No account, no sign-in. You do not need care experience; we train people who are new to it."
        breadcrumbs={[{ label: "Careers", href: "/careers" }, { label: "Apply" }]}
        secondary={{
          label: `Call ${site.business.phone}`,
          href: site.business.phone_href,
        }}
      />

      <Section tone="white" size="lg">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          {/* The form */}
          <div>
            <h2 className="text-2xl font-bold text-primary-950">
              Your details
            </h2>
            <p className="mt-2 mb-6 leading-relaxed text-textMuted">
              Fill this in as best you can. Once it is in, we have what we need to
              call you back — the rest we go through together.
            </p>
            <OnSiteApplication />
          </div>

          {/* What happens next */}
          <aside className="lg:pt-1">
            <div className="rounded-card border border-border bg-surface p-6">
              <h2 className="text-xl font-bold text-primary-950">
                What happens next
              </h2>
              <ol className="mt-4 space-y-4">
                {[
                  "We read your application and give you a call to talk about what you are looking for.",
                  "If it looks like a fit, we invite you in to meet us.",
                  "Then the checks — an enhanced DBS, references and right to work — before you start.",
                  "A full induction and the Care Certificate, then shadow shifts before you work on your own.",
                ].map((t, i) => (
                  <li key={t} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-800"
                    >
                      {i + 1}
                    </span>
                    <p className="text-base leading-relaxed text-text">{t}</p>
                  </li>
                ))}
              </ol>
            </div>

            <ul className="mt-6 space-y-4 text-base text-textMuted">
              <li className="flex gap-3">
                <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                <span>No care experience needed — we train people new to the job.</span>
              </li>
              <li className="flex gap-3">
                <Clock aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                <span>About five minutes, and you can do it on your phone.</span>
              </li>
              <li className="flex gap-3">
                <Phone aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                <span>
                  Would rather talk first? Call{" "}
                  <a
                    href={site.business.phone_href}
                    className="font-semibold text-primary-700 underline underline-offset-4"
                  >
                    {site.business.phone}
                  </a>
                  .
                </span>
              </li>
            </ul>
          </aside>
        </div>
      </Section>
    </>
  );
};

export default ApplyPage;
