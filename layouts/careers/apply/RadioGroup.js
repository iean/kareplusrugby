"use client";

/**
 * A yes/no (or short-list) question as a real radio group.
 *
 * Used throughout the application form instead of single checkboxes. An
 * unticked checkbox cannot distinguish "no" from "never answered", and on a
 * form that has to satisfy a regulator, that difference matters.
 *
 * A <fieldset> with a <legend> is what makes a screen reader announce the
 * question before the options; a row of inputs with a <p> above them does not.
 */
const RadioGroup = ({
  name,
  legend,
  hint,
  options,
  value,
  onChange,
  required,
  error,
  columns = false,
}) => {
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <fieldset>
      <legend className="mb-1.5 block text-base font-semibold text-primary-950">
        {legend}
        {required && (
          <>
            <span aria-hidden="true" className="ml-0.5 text-danger">*</span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </legend>

      {hint && (
        <p id={hintId} className="mb-3 text-base leading-relaxed text-textMuted">
          {hint}
        </p>
      )}

      <div className={columns ? "space-y-3" : "flex flex-wrap gap-x-8 gap-y-3"}>
        {options.map((opt) => {
          const id = `${name}-${String(opt).replace(/\W+/g, "-").toLowerCase()}`;
          return (
            <div key={opt} className="flex items-center gap-3">
              <input
                type="radio"
                id={id}
                name={name}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
                aria-invalid={error ? "true" : undefined}
                aria-describedby={describedBy}
                className="h-5 w-5 shrink-0 border-borderStrong text-primary-700 focus:ring-2 focus:ring-primary-600"
              />
              <label htmlFor={id} className="min-h-[44px] py-2 text-base leading-relaxed text-text">
                {opt}
              </label>
            </div>
          );
        })}
      </div>

      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-base font-medium text-danger">
          <span aria-hidden="true">⚠ </span>
          {error}
        </p>
      )}
    </fieldset>
  );
};

export default RadioGroup;
