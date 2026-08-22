import Link from "next/link";
import site from "@config/site.json";

/**
 * Honeypot field.
 *
 * A real input that no human ever sees or reaches: hidden from sighted users,
 * removed from the accessibility tree with aria-hidden, and taken out of the
 * tab order with tabIndex={-1}. Bots that fill every field in the DOM will
 * fill this one, and the server silently discards those submissions.
 *
 * It is NOT hidden with `display: none` — some bots skip those. It is moved
 * off-screen instead. autoComplete="off" stops a browser helpfully filling it
 * in for a real person, which would get their enquiry thrown away.
 */
export const Honeypot = ({ value, onChange }) => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute left-[-9999px] h-px w-px overflow-hidden"
  >
    <label htmlFor="website">Leave this field empty</label>
    <input
      id="website"
      name="website"
      type="text"
      tabIndex={-1}
      autoComplete="off"
      value={value}
      onChange={onChange}
    />
  </div>
);

/**
 * The line the work plan requires above every form: what happens to what you
 * type, and a link to the privacy policy. Above the form rather than below it,
 * so it is read before anything is typed rather than after.
 */
export const PrivacyNote = ({ children }) => (
  <p className="rounded-card border border-border bg-surface p-4 text-base leading-relaxed text-textMuted">
    {children}{" "}
    <Link
      href="/privacy-policy"
      className="font-semibold text-primary-700 underline underline-offset-4"
    >
      Read our privacy policy
    </Link>
    .
  </p>
);

/**
 * A direct route to us, shown under every submit button.
 *
 * Deliberately quiet — it must not pull people out of a form that works. But
 * it is always there, so nobody is ever left with only a button that might
 * fail. Costs nothing, involves no third party, and needs no configuration:
 * it is just our phone number and our inbox.
 */
export const DirectContactNote = ({ what = "this" }) => (
  <p className="text-base leading-relaxed text-textMuted">
    Having trouble with the form? You can email {what} straight to{" "}
    <a
      href={`mailto:${site.business.email}`}
      className="font-semibold text-primary-700 underline underline-offset-4"
    >
      {site.business.email}
    </a>{" "}
    or call us on{" "}
    <a
      href={site.business.phone_href}
      className="font-semibold text-primary-700 underline underline-offset-4"
    >
      {site.business.phone}
    </a>
    .
  </p>
);
