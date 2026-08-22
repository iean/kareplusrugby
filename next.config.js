/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  reactStrictMode: true,

  /**
   * Database drivers must not be bundled by webpack.
   *
   * `pg` opens real sockets and `@electric-sql/pglite` loads a WASM build from
   * its own package directory. Bundled, PGlite resolves its asset path to a URL
   * and throws ERR_INVALID_ARG_TYPE before a single query runs. Listing them
   * here leaves both as ordinary Node requires at runtime.
   *
   * PGlite is a devDependency and is only reached when DATABASE_URL is unset,
   * which is local development only.
   */
  experimental: {
    serverComponentsExternalPackages: ["pg", "@electric-sql/pglite", "pdfkit"],
  },

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
    ];
  },

  // Long-lived caching for static assets, and baseline security headers.
  // The site is served over plain HTTP today, so HSTS is deliberately NOT set
  // here - enabling it before TLS exists would make the site unreachable.
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
