import Link from "next/link";
import PageHeader from "@components/ui/PageHeader";
import Section, { Container } from "@components/ui/Section";
import site from "@config/site.json";
import { getLiveJobs } from "@lib/jobs";
import { LOCATIONS, locationLabel } from "@lib/locations";
import { MapPin, Clock, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Care Jobs in Coventry, Rugby, Leicester and Northampton",
  description:
    "Current care assistant, support worker and nurse vacancies with Kare Plus Rugby across Coventry, Rugby, Leicester and Northampton. Apply online in about ten minutes.",
  alternates: { canonical: "/jobs" },
};

/**
 * The jobs index. SEO-SPEC.md Phase 2.
 *
 * CRAWLABLE WITHOUT JAVASCRIPT, deliberately. Every vacancy is a plain <a> in
 * server-rendered HTML, and the location filter below is a set of ordinary
 * links to /jobs?location=..., not a client-side filter. A crawler that runs no
 * JavaScript still reaches every job page, which is the requirement for Google
 * for Jobs.
 */
const JobsIndex = ({ searchParams }) => {
  const all = getLiveJobs();
  const active =
    typeof searchParams?.location === "string" &&
    LOCATIONS.some((l) => l.id === searchParams.location)
      ? searchParams.location
      : null;

  const jobs = active ? all.filter((j) => j.locations.includes(active)) : all;
  const counts = Object.fromEntries(
    LOCATIONS.map((l) => [l.id, all.filter((j) => j.locations.includes(l.id)).length]),
  );

  return (
    <>
      <PageHeader
        eyebrow="Vacancies"
        title="Care jobs near you"
        intro="We recruit care assistants, support workers and registered nurses across Coventry, Rugby, Leicester and Northampton."
        breadcrumbs={[{ label: "Jobs" }]}
        primary={{ label: "Apply now", href: "/careers/apply" }}
        secondary={{ label: `Call ${site.business.phone}`, href: site.business.phone_href }}
      />

      <Section tone="white" size="lg">
        <Container width="narrow">
          {/* Real links, so this works with JavaScript switched off. */}
          <nav aria-label="Filter jobs by location" className="mb-8">
            <h2 className="mb-3 text-base font-semibold text-primary-950">
              Filter by location
            </h2>
            <ul className="flex flex-wrap gap-2">
              <li>
                <Link
                  href="/jobs"
                  aria-current={!active ? "true" : undefined}
                  className={`inline-flex min-h-[44px] items-center rounded-full border px-5 py-2 text-base font-semibold ${
                    !active
                      ? "border-primary-700 bg-primary-700 text-white"
                      : "border-borderStrong bg-white text-primary-900 hover:bg-primary-50"
                  }`}
                >
                  All areas
                  <span className="ml-2 font-normal opacity-80">({all.length})</span>
                </Link>
              </li>
              {LOCATIONS.filter((l) => counts[l.id] > 0).map((l) => (
                <li key={l.id}>
                  <Link
                    href={`/jobs?location=${l.id}`}
                    aria-current={active === l.id ? "true" : undefined}
                    className={`inline-flex min-h-[44px] items-center rounded-full border px-5 py-2 text-base font-semibold ${
                      active === l.id
                        ? "border-primary-700 bg-primary-700 text-white"
                        : "border-borderStrong bg-white text-primary-900 hover:bg-primary-50"
                    }`}
                  >
                    {l.label}
                    <span className="ml-2 font-normal opacity-80">({counts[l.id]})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {jobs.length === 0 ? (
            <div className="rounded-card border border-border bg-white p-7 text-center shadow-card">
              <h2 className="text-lg font-bold text-primary-950">
                {active
                  ? `Nothing in ${locationLabel(active)} right now`
                  : "No vacancies advertised right now"}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-textMuted">
                We recruit continuously and shifts come up at short notice. Send
                us an application and we will tell you honestly what is coming
                up near you.
              </p>
              <a
                href="/careers/apply"
                className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-btn bg-primary-700 px-7 py-3.5 font-semibold text-white transition hover:bg-primary-800"
              >
                Send an application anyway
              </a>
            </div>
          ) : (
            <ul className="space-y-5">
              {jobs.map((j) => (
                <li key={j.slug}>
                  <article className="rounded-card border border-border bg-white p-6 shadow-card">
                    <h2 className="text-xl font-bold text-primary-950">
                      <Link
                        href={`/jobs/${j.slug}`}
                        className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                      >
                        {j.title}
                      </Link>
                    </h2>
                    <ul className="mt-3 space-y-2">
                      <li className="flex items-center gap-2 text-base text-textMuted">
                        <MapPin aria-hidden="true" className="h-[18px] w-[18px] text-primary-600" />
                        {j.location || j.locations.map(locationLabel).join(", ")}
                      </li>
                      <li className="flex items-center gap-2 text-base text-textMuted">
                        <Clock aria-hidden="true" className="h-[18px] w-[18px] text-primary-600" />
                        {[j.type, j.hours].filter(Boolean).join(" · ")}
                      </li>
                    </ul>
                    {j.summary && (
                      <p className="mt-3 text-base leading-relaxed text-textMuted">{j.summary}</p>
                    )}
                    <Link
                      href={`/jobs/${j.slug}`}
                      className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-btn bg-primary-700 px-6 py-3 font-semibold text-white transition hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
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
    </>
  );
};

export default JobsIndex;
