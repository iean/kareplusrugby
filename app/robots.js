import site from "@config/site.json";

/**
 * robots.txt, generated so it stays in step with the sitemap.
 *
 * Replaces the old static public/robots.txt, which allowed everything and
 * disallowed only /api/*. That left the unauthenticated admin area open to
 * crawlers. /admin now requires a password, but keeping it out of the index is
 * still the right call - a login prompt in search results helps nobody.
 */
const FALLBACK = "https://example.invalid";

const base = /^https?:\/\//.test(site.seo.base_url)
  ? site.seo.base_url.replace(/\/$/, "")
  : FALLBACK;

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/admin/",
          "/thank-you",
          "/request-personal-data",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
