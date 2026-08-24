import { notFound } from "next/navigation";
import { marked } from "marked";
import PageHeader from "@components/ui/PageHeader";
import Section, { Container } from "@components/ui/Section";
import site from "@config/site.json";
import { getLiveJobs, getJobBySlug, buildJobPostingSchema } from "@lib/jobs";
import { locationLabel } from "@lib/locations";
import { MapPin, Clock, Banknote, CalendarDays } from "lucide-react";

const BASE = (site.seo.base_url || "").replace(/\/$/, "");

export async function generateStaticParams() {
  return getLiveJobs().map((j) => ({ slug: j.slug }));
}

/**
 * Only slugs returned above are valid URLs. Anything else is a real 404.
 *
 * Without this, Next renders unknown slugs on demand, and an expired posting
 * came back as HTTP 200 carrying the not-found page — notFound() fired, but the
 * status line still said 200. Google delists an expired posting on the STATUS
 * CODE, so a soft 404 would leave a closed vacancy live in Google for Jobs,
 * which is the manual-action risk SEO-SPEC.md warns about. Caught by Phase 6
 * pass 5 (set a closing date in the past and check).
 */
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const job = getJobBySlug(params.slug);
  if (!job) return {};
  const where = job.locations.map(locationLabel).join(", ");
  return {
    title: `${job.seoTitle || job.title} Jobs in ${where}`,
    description:
      job.summary ||
      `${job.seoTitle || job.title} vacancy with Kare Plus Rugby in ${where}. Apply online.`,
    alternates: { canonical: `/jobs/${job.slug}` },
    openGraph: {
      title: `${job.seoTitle || job.title} — ${where}`,
      description: job.summary,
      url: `/jobs/${job.slug}`,
      type: "article",
    },
  };
}

/**
 * One vacancy, at a stable URL. SEO-SPEC.md Phase 2.
 *
 * THE DESCRIPTION IS RENDERED ONCE AND USED TWICE — the HTML shown to the
 * reader is the same string handed to the JSON-LD. Google's job policies
 * require the structured data to be a true representation of the page, and the
 * surest way to satisfy that is to make it impossible for the two to differ.
 *
 * An expired posting is not served at all: getJobBySlug filters on
 * validThrough, so this returns a real 404 rather than a page advertising a
 * job that has closed.
 */
const JobPage = ({ params }) => {
  const job = getJobBySlug(params.slug);
  if (!job) notFound();

  // One render. Used for the page and for the structured data.
  const descriptionHtml = marked.parse(job.body || "");

  const schema = buildJobPostingSchema({ ...job, descriptionHtml }, BASE);

  const where = job.locations.map(locationLabel).join(", ");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* BreadcrumbList, per Phase 4. */}
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
                name: job.seoTitle || job.title,
                item: `${BASE}/jobs/${job.slug}`,
              },
            ],
          }),
        }}
      />

      <PageHeader
        eyebrow="Vacancy"
        title={job.title}
        intro={job.summary}
        breadcrumbs={[{ label: "Jobs", href: "/jobs" }, { label: job.seoTitle || job.title }]}
        primary={{ label: "Apply now", href: "/careers/apply" }}
        secondary={{ label: `Call ${site.business.phone}`, href: site.business.phone_href }}
      />

      <Section tone="white" size="lg">
        <Container width="narrow">
          {/* The facts, visible — these are the same values in the markup. */}
          <dl className="mb-8 grid gap-4 rounded-card border border-border bg-surface p-5 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <MapPin aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
              <div>
                <dt className="text-base font-semibold text-text">Location</dt>
                <dd className="text-base text-textMuted">{job.location || where}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
              <div>
                <dt className="text-base font-semibold text-text">Hours</dt>
                <dd className="text-base text-textMuted">
                  {[job.type, job.hours].filter(Boolean).join(" · ")}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Banknote aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
              <div>
                <dt className="text-base font-semibold text-text">Pay</dt>
                {/* No figure has been confirmed, so none is shown or marked up. */}
                <dd className="text-base text-textMuted">
                  {job.pay || "Discussed on application"}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarDays aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
              <div>
                <dt className="text-base font-semibold text-text">Closing date</dt>
                <dd className="text-base text-textMuted">
                  {job.validThrough.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </dd>
              </div>
            </div>
          </dl>

          {/* The description a reader sees IS the description in the markup. */}
          <div
            className="prose max-w-none prose-headings:text-primary-950 prose-p:text-base prose-p:leading-relaxed prose-li:text-base"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />

          <div className="mt-10 rounded-card border border-primary-200 bg-primary-50 p-6 text-center">
            <h2 className="text-xl font-bold text-primary-950">
              Interested? Two short forms and you are done
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-base leading-relaxed text-text">
              It takes about ten minutes, and you can do it on your phone.
            </p>
            <a
              href="/careers/apply"
              className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-btn bg-primary-700 px-8 py-4 text-lg font-semibold text-white transition hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
            >
              Apply for this role
            </a>
            <p className="mt-4 text-base text-textMuted">
              Would rather talk first? Call{" "}
              <a
                href={site.business.phone_href}
                className="font-semibold text-primary-700 underline underline-offset-4"
              >
                {site.business.phone}
              </a>
              .
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
};

export default JobPage;
