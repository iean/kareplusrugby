import Link from "next/link";
import PageHeader from "@components/ui/PageHeader";
import Section, { Container } from "@components/ui/Section";
import site from "@config/site.json";
import { AREAS } from "@lib/areas";
import { getLiveJobs } from "@lib/jobs";
import { MapPin, Clock, ArrowRight, Car, ShieldAlert } from "lucide-react";

/**
 * Shared shell for the four area pages. SEO-SPEC.md Phase 3.
 *
 * The SHELL is shared; the CONTENT is not. Everything that makes one of these
 * pages worth indexing — the local angle, the places, which council covers
 * safeguarding, whether driving matters — comes from lib/areas.js and is
 * different on every page. What is shared is the layout, the live vacancy list
 * and the call to action, which is fine: near-identical *text* is what makes a
 * doorway page, not a shared template.
 *
 * The "what you get" block is deliberately short and links out to /careers
 * rather than repeating the full list four times. Four pages carrying the same
 * long training section would drown the local content and make the pages look
 * like each other, which is the thing to avoid.
 */
const BASE = (site.seo.base_url || "").replace(/\/$/, "");

const AreaJobsPage = ({ area }) => {
  const jobs = getLiveJobs().filter((j) => j.locations.includes(area.id));
  const others = AREAS.filter((a) => a.slug !== area.slug);

  return (
    <>
      {/* BreadcrumbList on area pages, per SEO-SPEC.md Phase 4. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
              { "@type": "ListItem", position: 2, name: "Jobs", item: `${BASE}/jobs` },
              {
                "@type": "ListItem",
                position: 3,
                name: area.title,
                item: `${BASE}/jobs/${area.slug}`,
              },
            ],
          }),
        }}
      />
      <PageHeader
        eyebrow="Care jobs"
        title={area.title}
        intro={area.intro}
        breadcrumbs={[{ label: "Jobs", href: "/jobs" }, { label: area.name }]}
        primary={{ label: "Apply now", href: "/careers/apply" }}
        secondary={{ label: `Call ${site.business.phone}`, href: site.business.phone_href }}
      />

      {/* Live vacancies for THIS area, first — it is what people came for. */}
      <Section tone="white" size="lg">
        <Container width="narrow">
          <h2 className="text-2xl font-bold text-primary-950">
            {jobs.length > 0
              ? `Current vacancies in ${area.name}`
              : `Vacancies in ${area.name}`}
          </h2>

          {jobs.length === 0 ? (
            <div className="mt-5 rounded-card border border-border bg-surface p-6">
              <p className="text-base leading-relaxed text-text">
                We have nothing advertised in {area.name} at this moment. That
                does not mean we are not recruiting — we take on carers
                continuously and shifts come up at short notice.
              </p>
              <p className="mt-3 text-base leading-relaxed text-text">
                Send us an application and we will tell you honestly what is
                coming up near you.
              </p>
              <a
                href="/careers/apply"
                className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-btn bg-primary-700 px-7 py-3.5 font-semibold text-white transition hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
              >
                Apply anyway
              </a>
            </div>
          ) : (
            <ul className="mt-5 space-y-4">
              {jobs.map((j) => (
                <li key={j.slug}>
                  <article className="rounded-card border border-border bg-white p-5 shadow-card">
                    <h3 className="text-lg font-bold text-primary-950">
                      <Link href={`/jobs/${j.slug}`} className="underline-offset-4 hover:underline">
                        {j.title}
                      </Link>
                    </h3>
                    <ul className="mt-2 space-y-1.5">
                      <li className="flex items-center gap-2 text-base text-textMuted">
                        <MapPin aria-hidden="true" className="h-[18px] w-[18px] text-primary-600" />
                        {j.location}
                      </li>
                      <li className="flex items-center gap-2 text-base text-textMuted">
                        <Clock aria-hidden="true" className="h-[18px] w-[18px] text-primary-600" />
                        {[j.type, j.hours].filter(Boolean).join(" · ")}
                      </li>
                    </ul>
                    <Link
                      href={`/jobs/${j.slug}`}
                      className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-btn bg-primary-700 px-6 py-3 font-semibold text-white transition hover:bg-primary-800"
                    >
                      See the full details
                      <ArrowRight aria-hidden="true" className="h-5 w-5" />
                      <span className="sr-only">of {j.title}</span>
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      {/* The genuinely local part. This is what differs page to page. */}
      <Section tone="surface" size="lg">
        <Container width="narrow">
          <h2 className="text-2xl font-bold text-primary-950">
            What care work in {area.name} is actually like
          </h2>
          <div className="mt-6 space-y-6">
            {area.localAngle.map((b) => (
              <div key={b.heading}>
                <h3 className="text-lg font-bold text-primary-950">{b.heading}</h3>
                <p className="mt-2 text-base leading-relaxed text-textMuted">{b.body}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-8 text-lg font-bold text-primary-950">
            Places you could be working
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {area.places.map((pl) => (
              <li
                key={pl}
                className="rounded-full bg-primary-50 px-3 py-1 text-base font-medium text-primary-800"
              >
                {pl}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-base leading-relaxed text-textMuted">
            Coverage depends on the support needed and our current staffing, so
            we will tell you honestly what we can offer near your address rather
            than promising hours we cannot fill.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-card border border-border bg-white p-5">
              <Car aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
              <div>
                <h3 className="text-base font-bold text-primary-950">Do you need to drive?</h3>
                <p className="mt-1.5 text-base leading-relaxed text-textMuted">{area.driving}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-card border border-border bg-white p-5">
              <ShieldAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
              <div>
                <h3 className="text-base font-bold text-primary-950">Who covers safeguarding here</h3>
                <p className="mt-1.5 text-base leading-relaxed text-textMuted">
                  {area.authorityNote}{" "}
                  <Link href="/safeguarding" className="font-semibold text-primary-700 underline underline-offset-4">
                    See the numbers
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Short, and links out rather than repeating the full list four times. */}
      <Section tone="white" size="md">
        <Container width="narrow">
          <h2 className="text-2xl font-bold text-primary-950">
            What you get, wherever you work with us
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-textMuted">
            <li>A paid induction and the Care Certificate if you are new to care</li>
            <li>Mandatory training kept up to date, and online training in your own time</li>
            <li>Someone on call out of hours, so you are never stuck on your own</li>
            <li>Support towards NVQ Level 2 and Level 3 if you want it</li>
          </ul>
          <p className="mt-4 text-base leading-relaxed text-textMuted">
            <Link href="/careers" className="font-semibold text-primary-700 underline underline-offset-4">
              More about working for us
            </Link>
            {" · "}
            <Link href="/jobs" className="font-semibold text-primary-700 underline underline-offset-4">
              All current vacancies
            </Link>
          </p>

          <nav aria-label="Other areas we recruit in" className="mt-8 border-t border-border pt-6">
            <h3 className="text-base font-bold text-primary-950">
              We also recruit in
            </h3>
            <ul className="mt-3 flex flex-wrap gap-3">
              {others.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/jobs/${a.slug}`}
                    className="inline-flex min-h-[44px] items-center rounded-full border border-borderStrong bg-white px-5 py-2 text-base font-semibold text-primary-900 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                  >
                    Care jobs in {a.name}
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

export default AreaJobsPage;
