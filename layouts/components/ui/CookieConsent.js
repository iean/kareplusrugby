"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import {
  initConsentDefaults,
  grantAnalyticsConsent,
  denyAnalyticsConsent,
} from "@lib/analytics";

/**
 * Cookie consent banner.
 *
 * UK PECR + GDPR position, and why this is built the way it is:
 *
 *  - Consent must be OPT-IN. Non-essential cookies must not be set before the
 *    user agrees, so "Accept" and "Reject" carry equal visual weight. A
 *    prominent Accept next to a buried Reject is exactly what the ICO has
 *    ruled against.
 *  - There is no implied consent from continuing to browse.
 *  - Strictly necessary cookies need no consent and are not covered here.
 *
 * The site currently sets NO analytics or tracking cookies, so today this
 * banner governs nothing. It exists so the mechanism is in place and correct
 * the moment an analytics ID is added — see lib/analytics.js.
 *
 * The choice is stored in localStorage, not a cookie, so the banner itself
 * does not set one before consent.
 */

const STORAGE_KEY = "kpr-cookie-consent";

export const CONSENT_EVENT = "kpr-consent-change";

/** Read the stored decision. Returns "accepted" | "rejected" | null. */
export function getConsent() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // Safari private mode etc. - treat as no consent.
  }
}

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    // Consent Mode defaults must be denied BEFORE any tag could load.
    initConsentDefaults();

    // Re-apply a previous decision on every page load.
    const prior = getConsent();
    if (prior === "accepted") grantAnalyticsConsent();
    if (prior === "rejected") denyAnalyticsConsent();

    if (!prior) {
      // Delay slightly so the banner does not compete with first paint or
      // count against LCP.
      const t = setTimeout(() => setVisible(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  const decide = (value) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* storage unavailable - honour the choice for this page view only */
    }
    if (value === "accepted") grantAnalyticsConsent();
    else denyAnalyticsConsent();

    window.dispatchEvent(
      new CustomEvent(CONSENT_EVENT, { detail: { consent: value } })
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
      // bottom-[88px] on mobile clears the floating contact bar
      className="fixed inset-x-0 bottom-[88px] z-50 px-4 lg:bottom-6 print:hidden"
    >
      <div className="mx-auto max-w-3xl rounded-card border border-border bg-white p-5 shadow-[0_8px_32px_rgba(6,36,99,0.18)] md:p-6">
        <div className="flex gap-4">
          <span
            aria-hidden="true"
            className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700 sm:flex"
          >
            <Cookie className="h-5 w-5" />
          </span>

          <div className="min-w-0 flex-1">
            <h2 id="cookie-title" className="text-lg font-bold text-primary-950">
              Cookies on this site
            </h2>
            <p id="cookie-desc" className="mt-1.5 text-[15px] leading-relaxed text-textMuted">
              We use only the cookies needed to make this site work. We would
              also like to set optional analytics cookies to understand how the
              site is used — but only if you agree. You can change your mind at
              any time.{" "}
              <Link
                href="/cookie-policy"
                className="font-medium text-primary-700 underline underline-offset-4"
              >
                Read our cookie policy
              </Link>
              .
            </p>

            {/* Equal weight on both choices - required by the ICO */}
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => decide("accepted")}
                className="min-h-[44px] flex-1 rounded-btn bg-primary-700 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 sm:flex-none"
              >
                Accept analytics cookies
              </button>
              <button
                type="button"
                onClick={() => decide("rejected")}
                className="min-h-[44px] flex-1 rounded-btn border border-primary-200 bg-white px-5 py-2.5 font-semibold text-primary-800 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 sm:flex-none"
              >
                Reject optional cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
