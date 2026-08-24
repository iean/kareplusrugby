import { getSinglePage } from "./contentParser";
import { LOCATION_IDS, locationById } from "./locations";

/**
 * Job postings, for Google for Jobs.
 *
 * SEO-SPEC.md Phase 2. Read its "Critical warning" before changing anything
 * here: Google's job posting policies require postings to be real, current
 * vacancies, and breaking them earns a manual action that removes the whole
 * site from Google for Jobs and is painful to reverse.
 *
 * Three rules this module enforces so that cannot happen by accident:
 *
 *  1. EVERY POSTING HAS A validThrough. Google will not keep a posting without
 *     one, and a posting that never expires becomes a lie the day the role is
 *     filled. If the markdown does not set `closing`, one is derived — see
 *     DEFAULT_LIVE_DAYS — rather than the posting going out open-ended.
 *
 *  2. EXPIRED POSTINGS DISAPPEAR. `getLiveJobs()` drops anything past its
 *     validThrough, so an expired role leaves the index, the sitemap and the
 *     structured data in the same pass. Expiry handling is built here, with the
 *     posting system, not bolted on afterwards.
 *
 *  3. NOTHING IS MARKED UP THAT IS NOT ON THE PAGE. The description used in the
 *     JSON-LD is generated from the same markdown the reader sees.
 */

/**
 * How long a posting stays live when the markdown sets no closing date.
 *
 * Deliberately finite. A recruiter who forgets to close a filled role gets a
 * posting that quietly ages out, rather than one advertising a job that no
 * longer exists. Setting `closing:` in the front matter always wins.
 *
 * TODO (Alif): 60 days is my choice, not yours. Tell me if you would rather it
 * were shorter, or if you would rather a posting with no closing date simply
 * did not appear in Google for Jobs at all.
 */
export const DEFAULT_LIVE_DAYS = 60;

const MS_DAY = 24 * 60 * 60 * 1000;

function normaliseLocations(frontmatter) {
  const raw = frontmatter.locations ?? [];
  const list = Array.isArray(raw) ? raw : [raw];
  return list.map((v) => String(v).trim().toLowerCase()).filter((v) => LOCATION_IDS.has(v));
}

/** Employment types Google accepts, mapped from the free-text `type` field. */
function employmentTypes(type) {
  const t = String(type || "").toLowerCase();
  const out = [];
  if (t.includes("full")) out.push("FULL_TIME");
  if (t.includes("part")) out.push("PART_TIME");
  if (t.includes("bank") || t.includes("ad-hoc") || t.includes("agency") || t.includes("temporary"))
    out.push("TEMPORARY");
  if (t.includes("contract")) out.push("CONTRACTOR");
  return out.length ? out : ["PART_TIME", "FULL_TIME"];
}

function parseAll() {
  let pages = [];
  try {
    pages = getSinglePage("content/vacancies");
  } catch {
    return [];
  }

  return pages.map((p) => {
    const fm = p.frontmatter;

    // datePosted: the markdown's own date if given, otherwise the file is
    // treated as posted today. Never invented as something older, which would
    // game freshness signals.
    const posted = fm.datePosted || fm.date;
    const datePosted = posted ? new Date(posted) : new Date();

    const closing = fm.closing ? new Date(fm.closing) : null;
    const validThrough =
      closing && !Number.isNaN(closing.getTime())
        ? new Date(closing.setHours(23, 59, 59, 999))
        : new Date(datePosted.getTime() + DEFAULT_LIVE_DAYS * MS_DAY);

    return {
      slug: p.slug,
      title: fm.title || "Untitled role",
      // Google wants the job title ALONE in the structured data. A decorated
      // headline ("Care Assistant - care homes and home care") gets a posting
      // rejected, so the markdown carries a plain seoTitle for the markup while
      // the page keeps the fuller heading a human reads.
      seoTitle: fm.seoTitle || fm.title || "Untitled role",
      location: fm.location || "",
      locations: normaliseLocations(fm),
      type: fm.type || "",
      employmentTypes: employmentTypes(fm.type),
      hours: fm.hours || "",
      // No default. A missing pay field must never become an invented figure.
      pay: fm.pay || "",
      summary: fm.summary || "",
      body: p.content || "",
      datePosted,
      validThrough,
      // Derived, so the page can say so plainly rather than pretending the
      // office chose this date.
      closingWasDerived: !closing || Number.isNaN(closing.getTime()),
      identifier: `KPR-${String(p.slug).toUpperCase().slice(0, 24)}`,
    };
  });
}

/** Every posting that is still current. Expired ones are simply gone. */
export function getLiveJobs(now = new Date()) {
  return parseAll()
    .filter((j) => j.validThrough >= now)
    .sort((a, b) => b.datePosted - a.datePosted);
}

export function getJobBySlug(slug, now = new Date()) {
  return getLiveJobs(now).find((j) => j.slug === slug) || null;
}

/** Used by the tests in SEO-SPEC Phase 6 pass 5. */
export function getExpiredJobs(now = new Date()) {
  return parseAll().filter((j) => j.validThrough < now);
}

/**
 * The JobPosting JSON-LD for one vacancy.
 *
 * Only properties we can state truthfully are emitted. In particular:
 *
 *  - `baseSalary` is OMITTED. No rate has been confirmed, and Google's job
 *    policies require structured data to represent what is on the page. A
 *    guessed salary would be a false statement to both Google and the
 *    applicant. TODO (Alif): publishing a rate measurably improves Google for
 *    Jobs performance — this is a commercial decision only you can make.
 *
 *  - `directApply` is FALSE. It may only be true when the application can be
 *    completed on our own site. Ours currently hands the applicant to Google
 *    Forms, which is off-site. It becomes true when the built-in application
 *    system from RECRUITMENT-SPEC.md is live.
 */
export function buildJobPostingSchema(job, baseUrl) {
  const base = String(baseUrl || "").replace(/\/$/, "");

  const places = (job.locations.length ? job.locations : ["rugby"])
    .map((id) => locationById(id))
    .filter(Boolean)
    .map((l) => ({ "@type": "Place", address: { "@type": "PostalAddress", ...l.postal } }));

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    // The title alone. Not a headline with "Apply now!" in it - Google rejects
    // decorated titles.
    title: job.seoTitle || job.title,
    description: job.descriptionHtml,
    identifier: {
      "@type": "PropertyValue",
      name: "Kare Plus Rugby",
      value: job.identifier,
    },
    datePosted: job.datePosted.toISOString(),
    validThrough: job.validThrough.toISOString(),
    employmentType: job.employmentTypes,
    hiringOrganization: {
      "@type": "Organization",
      name: "Kare Plus Rugby",
      sameAs: base,
      logo: `${base}/images/kareplus-logo.png`,
    },
    jobLocation: places.length === 1 ? places[0] : places,
    applicantLocationRequirements: {
      "@type": "Country",
      name: "United Kingdom",
    },
    directApply: false,
  };
}
