import site from "@config/site.json";

/**
 * Success and error panels shared by every form.
 *
 * Both use role="status"/"alert" with aria-live so screen-reader users are
 * told the outcome. A form that silently swaps to a success message is
 * invisible to anyone not watching the screen.
 *
 * The error panel always offers the phone number as a fallback. If someone is
 * trying to arrange care and the form breaks, they need another route to us
 * immediately - not a dead end.
 *
 * It can also offer a pre-filled email. When the server cannot send - most
 * likely because no mail transport is configured - the visitor has already
 * typed everything out, and losing that is the worst part of the failure. The
 * mailto: link carries their answers into their own email app so they can send
 * it themselves in one tap. It needs no server, no credentials and no third
 * party: it is the visitor's own data going from their own device to us.
 */

/**
 * Build a mailto: URL carrying what the visitor typed.
 *
 * Kept well under the ~2000-character ceiling that Outlook and some mobile
 * clients impose on a mailto URL - past that the link is silently truncated or
 * ignored, which would be a worse failure than the one we are recovering from.
 */
export function buildMailto({ to, subject, fields }) {
  const body = fields
    .filter(([, v]) => v && String(v).trim())
    .map(([label, v]) => `${label}: ${String(v).trim()}`)
    .join("\n");

  const trimmed = body.length > 1500 ? `${body.slice(0, 1500)}\n\n[message shortened]` : body;

  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(trimmed)}`;
}

export const SuccessPanel = ({ title, children }) => (
  <div
    role="status"
    aria-live="polite"
    className="rounded-card border border-success/30 bg-successBg p-6 md:p-8"
  >
    <div className="flex items-start gap-4">
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success text-lg text-white"
      >
        ✓
      </span>
      <div>
        <h3 className="text-xl font-bold text-success">{title}</h3>
        <div className="mt-2 space-y-2 leading-relaxed text-text">{children}</div>
      </div>
    </div>
  </div>
);

export const ErrorPanel = ({ children, mailto, mailtoNote }) => (
  <div
    role="alert"
    className="rounded-card border border-danger/40 bg-dangerBg p-5"
  >
    <div className="flex items-start gap-3">
      <span aria-hidden="true" className="mt-0.5 text-lg text-danger">
        ⚠
      </span>
      <div className="text-base leading-relaxed">
        <p className="font-bold text-danger">Sorry — we could not send that.</p>
        <p className="mt-1 text-text">{children}</p>
        <p className="mt-2 text-text">
          Nothing you typed has been lost. Please try again, or call us on{" "}
          <a
            href={site.business.phone_href}
            className="font-semibold text-primary-700 underline underline-offset-4"
          >
            {site.business.phone}
          </a>
          .
        </p>

        {mailto && (
          <div className="mt-4 border-t border-danger/25 pt-4">
            <a
              href={mailto}
              className="inline-flex min-h-[44px] items-center justify-center rounded-btn bg-primary-700 px-6 py-3 font-semibold text-white transition hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
            >
              Send it by email instead
            </a>
            <p className="mt-2 text-base text-text">
              This opens your own email app with everything you typed already
              filled in — just press send.
              {mailtoNote ? ` ${mailtoNote}` : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

/**
 * Summary of validation errors, rendered above the form and focused on submit.
 * This is the pattern the GOV.UK Design System uses, and it is far better than
 * inline-only errors for anyone using a screen reader or magnifier.
 */
export const ErrorSummary = ({ errors, refEl, idFor = (f) => f }) => {
  const entries = Object.entries(errors).filter(([, v]) => v);
  if (entries.length === 0) return null;

  return (
    <div
      ref={refEl}
      tabIndex={-1}
      role="alert"
      className="rounded-card border-2 border-danger bg-dangerBg p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-danger"
    >
      <h3 className="text-lg font-bold text-danger">
        There {entries.length === 1 ? "is 1 problem" : `are ${entries.length} problems`} with this form
      </h3>
      <ul className="mt-3 space-y-2">
        {entries.map(([field, message]) => (
          <li key={field}>
            <a
              href={`#${idFor(field)}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(idFor(field));
                el?.focus();
                el?.scrollIntoView({ block: "center", behavior: "smooth" });
              }}
              className="font-medium text-danger underline underline-offset-4"
            >
              {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
