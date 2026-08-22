import Link from "next/link";

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
