/**
 * Form field primitives shared by every form on the site.
 *
 * Accessibility details that matter here and were missing before:
 *  - the <label> is always real and tied via htmlFor/id (placeholders are not
 *    labels; they vanish on focus and screen readers may skip them)
 *  - errors use aria-describedby + aria-invalid, and are announced via
 *    role="alert" so they are not silent for screen-reader users
 *  - required fields are marked both visually and with aria-required
 *  - error text is never colour-only; it carries an icon glyph and words
 */

const CONTROL =
  "w-full rounded-btn border bg-white px-4 py-3 text-base text-text " +
  "placeholder:text-textMuted/70 " +
  "focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 " +
  "disabled:bg-surface disabled:cursor-not-allowed";

const stateCls = (error) =>
  error ? "border-danger bg-dangerBg/40" : "border-borderStrong";

export const Label = ({ htmlFor, children, required }) => (
  <label
    htmlFor={htmlFor}
    className="mb-1.5 block text-sm font-semibold text-primary-950"
  >
    {children}
    {required && (
      <>
        <span aria-hidden="true" className="ml-0.5 text-danger">
          *
        </span>
        <span className="sr-only"> (required)</span>
      </>
    )}
  </label>
);

export const ErrorText = ({ id, children }) =>
  children ? (
    <p id={id} role="alert" className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-danger">
      <span aria-hidden="true">⚠</span>
      <span>{children}</span>
    </p>
  ) : null;

export const Hint = ({ id, children }) =>
  children ? (
    <p id={id} className="mt-1.5 text-sm text-textMuted">
      {children}
    </p>
  ) : null;

export const Field = ({
  id,
  label,
  error,
  hint,
  required,
  as = "input",
  className = "",
  children,
  ...rest
}) => {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  const shared = {
    id,
    name: id,
    "aria-invalid": error ? "true" : undefined,
    "aria-describedby": describedBy,
    "aria-required": required ? "true" : undefined,
    className: `${CONTROL} ${stateCls(error)} ${className}`,
    ...rest,
  };

  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {as === "textarea" ? (
        <textarea rows={rest.rows || 5} {...shared} />
      ) : as === "select" ? (
        <select {...shared}>{children}</select>
      ) : (
        <input {...shared} />
      )}
      <Hint id={hintId}>{hint}</Hint>
      <ErrorText id={errorId}>{error}</ErrorText>
    </div>
  );
};

export default Field;
