"use client";

/** A multi-select question as a labelled checkbox group inside a fieldset. */
const CheckboxGroup = ({ name, legend, hint, options, value = [], onChange, required, error }) => {
  const hintId = hint ? `${name}-hint` : undefined;
  const set = new Set(value);

  const toggle = (id) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    onChange([...next]);
  };

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
        <p id={hintId} className="mb-3 text-base leading-relaxed text-textMuted">{hint}</p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((o) => {
          const id = `${name}-${o.id}`;
          return (
            <div key={o.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={id}
                name={name}
                value={o.id}
                checked={set.has(o.id)}
                onChange={() => toggle(o.id)}
                aria-describedby={hintId}
                className="h-5 w-5 shrink-0 rounded border-borderStrong text-primary-700 focus:ring-2 focus:ring-primary-600"
              />
              <label htmlFor={id} className="min-h-[44px] py-2 text-base leading-relaxed text-text">
                {o.label}
              </label>
            </div>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-base font-medium text-danger">
          <span aria-hidden="true">⚠ </span>{error}
        </p>
      )}
    </fieldset>
  );
};

export default CheckboxGroup;
