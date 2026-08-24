import site from "@config/site.json";
import { getSinglePage } from "@lib/contentParser";
import { getLiveJobs } from "@lib/jobs";

/**
 * sitemap.xml
 *
 * Next.js requires absolute URLs here. seo.base_url in config/site.json is the
 * live domain, so that is what gets used. The fallback below stays as a guard:
 * if someone ever blanks that value or leaves a placeholder in it, emitting a
 * clearly-wrong-but-valid host beats emitting an invalid sitemap.
 */
const FALLBACK = "https://example.invalid";

const base = /^https?:\/\//.test(site.seo.base_url)
  ? site.seo.base_url.replace(/\/$/, "")
  : FALLBACK;

// Only pages that genuinely exist and should be indexed.
const ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/domiciliary-care", priority: 0.9, changeFrequency: "monthly" },
  { path: "/care-home-staffing", priority: 0.9, changeFrequency: "monthly" },
  { path: "/supported-living", priority: 0.9, changeFrequency: "monthly" },
  { path: "/careers", priority: 0.8, changeFrequency: "weekly" },
  { path: "/careers/apply", priority: 0.7, changeFrequency: "monthly" },
  { path: "/referrals", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cookie-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/complaints", priority: 0.3, changeFrequency: "yearly" },
  { path: "/safeguarding", priority: 0.4, changeFrequency: "yearly" },
  { path: "/terms-and-conditions", priority: 0.2, changeFrequency: "yearly" },
  { path: "/request-personal-data", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap() {
  const now = new Date();

  // Only advertise the blog once something is actually published there.
  // Listing an empty index is a wasted crawl and a thin page.
  let posts = [];
  try {
    posts = getSinglePage("content/blogs");
  } catch {
    posts = [];
  }

  const routes = posts.length
    ? [...ROUTES, { path: "/blogs", priority: 0.5, changeFrequency: "weekly" }]
    : ROUTES;

  /**
   * Job pages get their own section, per SEO-SPEC.md Phase 1.
   *
   * getLiveJobs() filters on validThrough, so an EXPIRED posting drops out of
   * the sitemap in the same pass that removes it from the site. Google's job
   * policies require expired postings to be taken down; leaving one in the
   * sitemap is a direct way to earn a manual action.
   */
  const jobs = getLiveJobs();
  const jobEntries = jobs.length
    ? [
        {
          url: `${base}/jobs`,
          lastModified: jobs[0].datePosted,
          changeFrequency: "daily",
          priority: 0.9,
        },
        ...jobs.map((j) => ({
          url: `${base}/jobs/${j.slug}`,
          lastModified: j.datePosted,
          changeFrequency: "weekly",
          priority: 0.8,
        })),
      ]
    : [];

  return [...jobEntries, ...routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))];
}
