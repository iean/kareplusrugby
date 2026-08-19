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
 */

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

export const ErrorPanel = ({ children }) => (
  <div
    role="alert"
    className="rounded-card border border-danger/40 bg-dangerBg p-5"
  >
    <div className="flex items-start gap-3">
      <span aria-hidden="true" className="mt-0.5 text-lg text-danger">
        ⚠
      </span>
      <div className="text-[15px] leading-relaxed">
        <p className="font-bold text-danger">Sorry — we could not send that.</p>
        <p className="mt-1 text-text">{children}</p>
        <p className="mt-2 text-text">
          Please try again, or call us on{" "}
          <a
            href={site.business.phone_href}
            className="font-semibold text-primary-700 underline underline-offset-4"
          >
            {site.business.phone}
          </a>
          .
        </p>
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
