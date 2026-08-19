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
