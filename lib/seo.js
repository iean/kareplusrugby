/**
 * Open Graph helper.
 *
 * WHY THIS EXISTS. Next.js does NOT deep-merge the `openGraph` metadata object.
 * A page that sets `openGraph: { title: "..." }` REPLACES the whole object it
 * inherited from app/layout.js — including `images`. The result was silent: the
 * root layout declared a perfectly good og:image, the file served 200, and yet
 * ten pages rendered no og:image at all, because each of them had set some
 * other openGraph field. Sharing the homepage or a vacancy on WhatsApp,
 * Facebook or LinkedIn produced a bare text link with no picture.
 *
 * Found by checking the rendered HTML of every live page rather than the
 * config, which is the only way this class of bug shows up.
 *
 * So: every page that needs openGraph builds it through og(), which puts the
 * image back. Pass whatever you want to override.
 *
 *   export const metadata = { openGraph: og({ url: "/careers" }) };
 */
import site from "../config/site.json";

export const OG_IMAGE = {
  url: site.seo.og_image,
  width: 1200,
  height: 630,
  alt: site.seo.site_name,
};

export function og(overrides = {}) {
  return {
    type: "website",
    siteName: site.seo.site_name,
    locale: "en_GB",
    title: site.seo.default_title,
    description: site.seo.default_description,
    ...overrides,
    // Always last: a caller may legitimately pass its own images, but must
    // never end up with none.
    images: overrides.images || [OG_IMAGE],
  };
}

export default og;
