/**
 * Analytics loader — consent-gated.
 *
 * [TODO: SUPPLY A GA4 MEASUREMENT ID (G-XXXXXXXXXX) OR CHOOSE A
 *  PRIVACY-FRIENDLY ALTERNATIVE SUCH AS PLAUSIBLE OR FATHOM]
 *
 * Nothing loads today: NEXT_PUBLIC_GA_ID is unset, so `enabled` is false and
 * this module is inert. That is why the site currently sets no analytics
 * cookies, and why the cookie policy says so.
 *
 * When an ID is added, the flow is already correct:
 *   1. No tag loads until the visitor has actively accepted (UK PECR requires
 *      opt-in for non-essential cookies).
 *   2. Consent Mode v2 defaults are set to denied BEFORE gtag loads, so even
 *      the initial handshake carries no consented signal.
 *   3. Accepting updates consent and injects the script once.
 *
 * Do not "temporarily" load analytics before consent to test it. That is the
 * exact behaviour the ICO enforces against.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
export const enabled = Boolean(GA_ID);

let injected = false;

/** Set Consent Mode defaults to denied. Safe to call before any tag exists. */
export function initConsentDefaults() {
  if (typeof window === "undefined" || !enabled) return;
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = window.gtag || gtag;
  window.gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });
}

/** Called when the visitor accepts. Injects the tag exactly once. */
export function grantAnalyticsConsent() {
  if (typeof window === "undefined" || !enabled) return;

  window.gtag?.("consent", "update", { analytics_storage: "granted" });

  if (injected) return;
  injected = true;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag("js", new Date());
  // IP anonymisation is the default in GA4, but being explicit documents intent.
  window.gtag("config", GA_ID, { anonymize_ip: true });
}

/** Called when the visitor rejects, or withdraws consent later. */
export function denyAnalyticsConsent() {
  if (typeof window === "undefined" || !enabled) return;
  window.gtag?.("consent", "update", { analytics_storage: "denied" });
}
