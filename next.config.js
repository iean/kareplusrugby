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
