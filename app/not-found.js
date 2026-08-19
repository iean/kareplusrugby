import Link from "next/link";
import { Container } from "@components/ui/Section";
import Button from "@components/ui/Button";
import site from "@config/site.json";
import { FaPhoneAlt } from "react-icons/fa";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * 404 page.
 *
 * Rather than a dead end, it routes to the three visitor intents. Someone who
 * hits a broken link while trying to arrange care should still be one click
 * from the right place - and from the phone number.
 */
const NotFound = () => (
  <div className="bg-body">
    <Container className="py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-primary-700">
          Error 404
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-primary-950 md:text-5xl">
          We can&apos;t find that page
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-textMuted">
          The page may have moved, or the link that brought you here might be
          out of date. Nothing has gone wrong with your enquiry — let&apos;s get
          you back on track.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/" size="lg">
            Back to the homepage
          </Button>
          <Button href="/contact" variant="secondary" size="lg">
            Contact us
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-3xl">
        <h2 className="mb-5 text-center text-lg font-bold text-primary-950">
          Or go straight to what you need
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {site.nav.intents.map((intent) => (
            <li key={intent.id}>
              <Link
                href={intent.url}
                className="block h-full rounded-card border border-border bg-white p-5 text-center shadow-card transition-shadow hover:border-primary-200 hover:shadow-cardHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
              >
                <span className="font-semibold text-primary-800">
                  {intent.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-textMuted">
          Prefer to talk?{" "}
          <a
            href={site.business.phone_href}
            className="inline-flex items-center gap-2 font-semibold text-primary-700 underline underline-offset-4"
          >
            <FaPhoneAlt aria-hidden="true" className="text-xs" />
            {site.business.phone}
          </a>
        </p>
      </div>
    </Container>
  </div>
);

export default NotFound;
