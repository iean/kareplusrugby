import site from "@config/site.json";

/**
 * sitemap.xml
 *
 * Next.js requires absolute URLs here. The live domain does not currently
 * resolve and site.seo.base_url is still a placeholder, so we fall back to a
 * clearly-wrong-but-valid host rather than emitting the literal "[TODO: ...]"
 * string, which would produce an invalid sitemap.
 *
 * [TODO: SET seo.base_url IN config/site.json ONCE THE DOMAIN IS LIVE]
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
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blogs", priority: 0.5, changeFrequency: "weekly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cookie-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/complaints", priority: 0.3, changeFrequency: "yearly" },
  { path: "/safeguarding", priority: 0.4, changeFrequency: "yearly" },
  { path: "/terms-and-conditions", priority: 0.2, changeFrequency: "yearly" },
  { path: "/request-personal-data", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap() {
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
