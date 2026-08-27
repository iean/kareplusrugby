/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  reactStrictMode: true,

  images: {
    // next/image converts on the fly; AVIF first, WebP as the fallback.
    formats: ["image/avif", "image/webp"],
    // Matches the breakpoints in config/theme.json so the srcset does not
    // hand phones a desktop-sized file.
    deviceSizes: [540, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Optimised images are immutable; cache them hard.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // The logo is a local SVG we author ourselves. next/image refuses SVG
    // without this. The CSP below keeps it inert (no scripts inside an SVG).
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  /**
   * Retired URLs.
   *
   * /pricing and /elements were Bigspring template pages that were never
   * removed. /pricing in particular published three fabricated subscription
   * plans (£49/£69/£99 a month, "Customs Clearance", "Cloud Service") on a
   * CQC-regulated care site. Both are deleted.
   *
   * They are redirected rather than left to 404 so that anything already
   * indexed or bookmarked is superseded: a 301 tells search engines to drop
   * the old page, where a 404 leaves it lingering. /pricing goes to the FAQ,
   * which explains honestly how rates are actually quoted.
   */
  async redirects() {
    return [
      { source: "/pricing", destination: "/faq", permanent: true },
      { source: "/elements", destination: "/", permanent: true },
      // /domiciliary-care-home rendered an entirely empty <main>: the component
      // fetched its data and then returned only a meta tag. Nothing linked to
      // it. Retired to the page that covers the same subject properly.
      { source: "/domiciliary-care-home", destination: "/domiciliary-care", permanent: true },

      /**
       * Recruitment consolidated onto /careers.
       *
       * /domiciliary/jobs advertised three FABRICATED vacancies with working
       * "Apply Now" buttons — Care Assistant in London, Support Worker in
       * Birmingham, Registered Nurse in Manchester — hardcoded into a
       * component. Kare Plus Rugby is in Rugby and covers Warwickshire and
       * its neighbours; none of those jobs or cities was real.
       *
       * The other three were near-empty shells or a second careers page.
       * /careers now carries the real markdown-driven vacancy list and an
       * honest empty state.
       */
      { source: "/domiciliary/jobs", destination: "/careers", permanent: true },
      { source: "/domiciliary/available-jobs", destination: "/careers", permanent: true },
      { source: "/staffing/available-jobs", destination: "/careers", permanent: true },
      { source: "/domiciliary/our-careers", destination: "/careers", permanent: true },

      // /domiciliary/how-we-work and /staffing/how-we-work rendered a
      // byte-identical component tree to each other. Three URLs for one page.
      { source: "/domiciliary/how-we-work", destination: "/how-we-work", permanent: true },
      { source: "/staffing/how-we-work", destination: "/how-we-work", permanent: true },

      /**
       * The rest of the old /domiciliary/* and /staffing/* sections, retired
       * 2026-08-27.
       *
       * These ten pages were orphans: indexable and self-canonical, but in no
       * sitemap, in neither nav, and linked only to each other. Their content
       * was correctly rebranded, so this was never a public-embarrassment
       * problem - it was cannibalisation. /domiciliary competed with
       * /domiciliary-care for the same query, /staffing with
       * /care-home-staffing, and /domiciliary/about and /domiciliary/about-us
       * shared a single <h1> between them, which is two URLs arguing over one
       * page.
       *
       * Each goes to the page that now owns its subject rather than to the
       * homepage: a 301 only passes signal if the destination is actually
       * about the same thing.
       */
      { source: "/domiciliary", destination: "/domiciliary-care", permanent: true },
      { source: "/domiciliary/care-services", destination: "/domiciliary-care", permanent: true },
      { source: "/domiciliary/about", destination: "/about", permanent: true },
      { source: "/domiciliary/about-us", destination: "/about", permanent: true },
      { source: "/domiciliary/contact-us", destination: "/contact", permanent: true },
      // The Get Started form lived here and nowhere else. /contact carries the
      // maintained enquiry flow (ContactTabs), so that is where this goes.
      // app/api/get-started/ is left in place but is now unreferenced.
      { source: "/domiciliary/get-started", destination: "/contact", permanent: true },
      { source: "/staffing", destination: "/care-home-staffing", permanent: true },
      { source: "/staffing/care-services", destination: "/care-home-staffing", permanent: true },
      { source: "/staffing/about-us", destination: "/about", permanent: true },
      { source: "/staffing/contact-us", destination: "/contact", permanent: true },
    ];
  },

  // Long-lived caching for static assets, and baseline security headers.
  // HSTS is not set here because Vercel already sends it
  // (strict-transport-security: max-age=63072000, verified in production
  // 2026-08-27). The old comment here said the site was plain HTTP and TLS did
  // not exist - that was true of the VPS that never served traffic, not of
  // the live site.
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
