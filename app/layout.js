import "../styles/style.scss";
import { Inter } from "next/font/google";
import SiteHeader from "@layouts/partials/SiteHeader";
import SiteFooter from "@layouts/partials/SiteFooter";
import Providers from "@layouts/partials/Providers";
import RouteTransition from "@layouts/partials/RouteTransition";
import StickyContactBar from "@components/ui/StickyContactBar";
import CookieConsent from "@components/ui/CookieConsent";
import site from "@config/site.json";

/**
 * Inter only. The previous layout also loaded Playfair Display and
 * Merriweather; two extra font families cost render-blocking requests and the
 * decorative serifs were harder to read for an older audience.
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// base_url is a placeholder until the domain resolves, so metadataBase is only
// set when it looks like a real URL - passing a placeholder string would throw.
const baseUrl = /^https?:\/\//.test(site.seo.base_url)
  ? site.seo.base_url
  : undefined;

export const metadata = {
  ...(baseUrl ? { metadataBase: new URL(baseUrl) } : {}),
  title: {
    default: site.seo.default_title,
    template: `%s | ${site.seo.site_name}`,
  },
  description: site.seo.default_description,
  applicationName: site.seo.site_name,
  authors: [{ name: site.seo.site_name }],
  openGraph: {
    type: "website",
    siteName: site.seo.site_name,
    title: site.seo.default_title,
    description: site.seo.default_description,
    locale: "en_GB",
    images: [{ url: site.seo.og_image, width: 1200, height: 630, alt: site.seo.site_name }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.default_title,
    description: site.seo.default_description,
    images: [site.seo.og_image],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#000048",
  width: "device-width",
  initialScale: 1,
};

/**
 * MedicalBusiness / LocalBusiness structured data.
 *
 * Address, phone, email and URL come from config/site.json, which took them
 * from the repo's existing config/social.json - real values, not invented.
 *
 * Fields still holding a [TODO: ...] placeholder are filtered out below rather
 * than published: putting placeholder text into structured data feeds nonsense
 * straight to search engines. So areaServed, registration IDs and anything
 * else unverified simply do not appear until someone fills them in.
 */
const isReal = (v) => typeof v === "string" && v && !v.includes("[TODO");

const b = site.business;
const orgSchema = {
  "@context": "https://schema.org",
  "@type": ["MedicalBusiness", "LocalBusiness"],
  name: b.legal_name,
  alternateName: b.trading_name,
  description: site.seo.default_description,
  url: isReal(site.seo.base_url) ? site.seo.base_url : undefined,
  telephone: b.phone,
  ...(isReal(b.email) ? { email: b.email } : {}),
  ...(isReal(b.address.street)
    ? {
        address: {
          "@type": "PostalAddress",
          streetAddress: b.address.street,
          addressLocality: b.address.locality,
          addressRegion: b.address.region,
          postalCode: b.address.postcode,
          addressCountry: b.address.country,
        },
      }
    : {}),
  // Real areaServed entries help local search far more than a prose string.
  areaServed: b.areas.map((a) => ({
    "@type": "AdministrativeArea",
    name: a.name,
    ...(a.county && a.county !== a.name ? { containedInPlace: { "@type": "AdministrativeArea", name: a.county } } : {}),
  })),
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
  makesOffer: [
    "Domiciliary care",
    "Supported living",
    "Care home staffing",
  ].map((n) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: n } })),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB" className={inter.variable}>
      <body className="bg-body font-sans text-text antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <Providers>
          <SiteHeader />
          <main id="main">
            <RouteTransition>{children}</RouteTransition>
          </main>
          <SiteFooter />
          <StickyContactBar />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
