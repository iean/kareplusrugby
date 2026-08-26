import Link from "next/link";
import PageHeader from "@components/ui/PageHeader";
import Section, { Container } from "@components/ui/Section";
import site from "@config/site.json";
import { CARE_TYPES } from "@lib/careTypes";
import { Check, AlertCircle, Users, ExternalLink, PhoneCall } from "lucide-react";

/**
 * Shared shell for the condition and service pages.
 *
 * Same discipline as the area pages: the SHELL is shared, the CONTENT is not.
 * Everything that makes one of these worth reading comes from lib/careTypes.js
 * and differs on every page.
 *
 * The "what we cannot do" block is deliberately given the same visual weight as
 * "what we do". It is not a disclaimer buried at the bottom - it is the most
 * useful thing on the page for someone arranging care for the first time, and
 * it prevents the complaint that starts "nobody told us".
 */
const CareTypePage = ({ careType: c }) => {
  const others = CARE_TYPES.filter((x) => x.slug !== c.slug);

  return (
    <>
      <PageHeader
        eyebrow="Care at home"
        title={c.title}
        intro={c.intro}
        breadcrumbs={[{ label: "Domiciliary care", href: "/domiciliary-care" }, { label: c.name }]}
        primary={{ label: `Call ${site.business.phone}`, href: site.business.phone_href }}
        secondary={{ label: "Send us a message", href: "/contact" }}
      />

      <Section tone="white" size="lg">
        <Container width="narrow">
          <h2 className="text-2xl font-bold text-primary-950">
            What this looks like day to day
          </h2>
          <div className="mt-6 space-y-6">
            {c.dayToDay.map((b) => (
              <div key={b.heading}>
                <h3 className="text-lg font-bold text-primary-950">{b.heading}</h3>
                <p className="mt-2 text-base leading-relaxed text-textMuted">{b.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* What we do / what we do not. Equal weight, deliberately. */}
      <Section tone="surface" size="lg">
        <Container width="narrow">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-card border border-border bg-white p-6">
              <h2 className="flex items-center gap-2 text-xl font-bold text-primary-950">
                <Check aria-hidden="true" className="h-5 w-5 text-primary-600" />
                What we do
              </h2>
              <ul className="mt-4 space-y-2.5">
                {c.weDo.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-base leading-relaxed text-textMuted">
                    <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-primary-600" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-card border border-borderStrong bg-white p-6">
              <h2 className="flex items-center gap-2 text-xl font-bold text-primary-950">
                <AlertCircle aria-hidden="true" className="h-5 w-5 text-accent" />
                What we cannot do
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-textMuted">
                We would rather you knew this now than found out later.
              </p>
              <ul className="mt-4 space-y-2.5">
                {c.weDoNot.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-base leading-relaxed text-textMuted">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* The other people involved. Most families do not know these exist. */}
      <Section tone="white" size="lg">
        <Container width="narrow">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-primary-950">
            <Users aria-hidden="true" className="h-6 w-6 text-primary-600" />
            Who else should be involved
          </h2>
          <p className="mt-3 text-base leading-relaxed text-textMuted">
            We are one part of this. These are the people who do the things we cannot, and
            they are free.
          </p>
          <ul className="mt-6 space-y-4">
            {c.whoElse.map((w) => (
              <li key={w.name} className="rounded-card border border-border bg-surface p-5">
                <h3 className="text-base font-bold text-primary-950">
                  {w.href ? (
                    <a
                      href={w.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-primary-700 underline underline-offset-4 hover:text-primary-800"
                    >
                      {w.name}
                      <ExternalLink aria-hidden="true" className="h-4 w-4" />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    w.name
                  )}
                </h3>
                <p className="mt-1.5 text-base leading-relaxed text-textMuted">{w.what}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Getting started + money. */}
      <Section tone="surface" size="md">
        <Container width="narrow">
          <h2 className="text-2xl font-bold text-primary-950">Where to start</h2>
          <p className="mt-3 text-base leading-relaxed text-textMuted">{c.starting}</p>
          <p className="mt-4 text-base leading-relaxed text-textMuted">
            Worried about the cost? The council pays towards care at home for more people
            than realise it, and Attendance Allowance is not means-tested at all.{" "}
            <Link
              href="/paying-for-care"
              className="font-semibold text-primary-700 underline underline-offset-4"
            >
              See how paying for care works
            </Link>
            .
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={site.business.phone_href}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-btn bg-primary-700 px-7 py-3.5 font-semibold text-white transition hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
            >
              <PhoneCall aria-hidden="true" className="h-5 w-5" />
              Call {site.business.phone}
            </a>
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center justify-center rounded-btn border border-borderStrong bg-white px-7 py-3.5 font-semibold text-primary-800 transition hover:bg-primary-50"
            >
              Send us a message
            </Link>
          </div>

          <nav aria-label="Other kinds of care we provide" className="mt-10 border-t border-border pt-6">
            <h3 className="text-base font-bold text-primary-950">We also help with</h3>
            <ul className="mt-3 flex flex-wrap gap-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/${o.slug}`}
                    className="inline-flex min-h-[44px] items-center rounded-full border border-borderStrong bg-white px-5 py-2 text-base font-semibold text-primary-900 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                  >
                    {o.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </Section>
    </>
  );
};

export default CareTypePage;
