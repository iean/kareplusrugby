"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Phone } from "lucide-react";
import site from "@config/site.json";

/**
 * Route-level error boundary.
 *
 * The important thing on a care site is that an error is never a dead end:
 * someone may be part-way through arranging urgent support. The phone number
 * is given the same prominence as the retry button.
 *
 * The raw error message is deliberately not shown - it can leak internals and
 * means nothing to a visitor. It is logged to the console for debugging, and
 * the digest is shown small so a caller can quote it.
 */
const Error = ({ error, reset }) => {
  useEffect(() => {
    console.error("[route error]", error);
  }, [error]);

  return (
    <div className="bg-body">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-20 lg:px-8 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span
            aria-hidden="true"
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-dangerBg text-danger"
          >
            <AlertTriangle className="h-8 w-8" />
          </span>

          <h1 className="text-3xl font-bold tracking-tight text-primary-950 md:text-4xl">
            Something went wrong at our end
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-textMuted">
            Sorry — this page didn&apos;t load properly. Nothing you did caused
            it, and any enquiry you already sent has not been affected.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-btn bg-primary-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
            >
              <RefreshCw aria-hidden="true" className="h-5 w-5" />
              Try again
            </button>
            <a
              href={site.business.phone_href}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-btn border border-primary-200 bg-white px-6 py-3 font-semibold text-primary-800 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
            >
              <Phone aria-hidden="true" className="h-5 w-5" />
              Call {site.business.phone}
            </a>
          </div>

          <p className="mt-8 text-textMuted">
            Or go back to the{" "}
            <Link href="/" className="font-semibold text-primary-700 underline underline-offset-4">
              homepage
            </Link>
            .
          </p>

          {error?.digest && (
            <p className="mt-6 text-xs text-textMuted">
              Reference: <code className="font-mono">{error.digest}</code>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Error;
