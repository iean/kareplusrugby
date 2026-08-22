"use client";

/**
 * Availability grid: days across, shifts down.
 *
 * RECRUITMENT-SPEC.md singles this out — "a naked checkbox grid is an
 * accessibility trap, so label every cell properly". The trap is that a table
 * of bare checkboxes announces as "checkbox, unchecked" twenty-eight times,
 * with the row and column headings never read out, so a screen reader user has
 * no idea which cell they are on.
 *
 * What makes this one work:
 *
 *  - It is a real <table> with <th scope="col"> for days and <th scope="row">
 *    for shifts. Screen readers use that association to announce "Tuesday,
 *    Morning" as you move between cells. That is doing the work, not ARIA.
 *  - Every checkbox additionally carries its own visually-hidden <label>
 *    reading "Monday morning", so it is unambiguous even where table-header
 *    association is weak or switched off.
 *  - The whole grid sits in a <fieldset> with a <legend>, so it is announced
 *    as one question rather than twenty-eight unrelated ones.
 *  - Whole-row and whole-column toggles are real buttons with aria-pressed,
 *    because selecting "every weekday morning" one cell at a time is tedious
 *    for everyone and genuinely hard with a tremor or a switch device.
 *  - A live region reports the running count, so the effect of a toggle is not
 *    silent.
 *  - Cells are 44px minimum and the table scrolls inside its own container on
 *    a narrow screen rather than pushing the page sideways.
 *
 * Selection shape: a flat array of "day:shift" ids, e.g. ["mon:morning"].
 * Flat rather than nested so it round-trips through JSON storage unchanged.
 */

export const DAYS = [
  { id: "mon", label: "Monday", short: "Mon" },
  { id: "tue", label: "Tuesday", short: "Tue" },
  { id: "wed", label: "Wednesday", short: "Wed" },
  { id: "thu", label: "Thursday", short: "Thu" },
  { id: "fri", label: "Friday", short: "Fri" },
  { id: "sat", label: "Saturday", short: "Sat" },
  { id: "sun", label: "Sunday", short: "Sun" },
];

export const SHIFTS = [
  { id: "morning", label: "Morning" },
  { id: "afternoon", label: "Afternoon" },
  { id: "evening", label: "Evening" },
  { id: "night", label: "Night" },
];

export const cellId = (day, shift) => `${day}:${shift}`;

const AvailabilityGrid = ({ value = [], onChange, idPrefix = "avail" }) => {
  const selected = new Set(value);

  const commit = (next) => onChange?.([...next]);

  const toggleCell = (day, shift) => {
    const next = new Set(selected);
    const id = cellId(day, shift);
    next.has(id) ? next.delete(id) : next.add(id);
    commit(next);
  };

  const rowIds = (shift) => DAYS.map((d) => cellId(d.id, shift));
  const colIds = (day) => SHIFTS.map((s) => cellId(day, s.id));

  const allSelected = (ids) => ids.every((i) => selected.has(i));

  const toggleMany = (ids) => {
    const next = new Set(selected);
    if (allSelected(ids)) ids.forEach((i) => next.delete(i));
    else ids.forEach((i) => next.add(i));
    commit(next);
  };

  return (
    <fieldset>
      <legend className="mb-1.5 block text-base font-semibold text-primary-950">
        When are you available to work?
      </legend>
      <p id={`${idPrefix}-hint`} className="mb-4 text-base leading-relaxed text-textMuted">
        Tick every slot you could usually work. This is not a commitment — it
        helps us match you to shifts near you. You can change it later.
      </p>

      {/* overflow-x-auto: on a narrow screen the table scrolls inside this box
          rather than pushing the whole page sideways. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-base">
          <caption className="sr-only">
            Availability by day and shift. Each checkbox is one day and one
            shift, for example Monday morning.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="p-2 text-left text-base font-semibold text-primary-950">
                <span className="sr-only">Shift</span>
              </th>
              {DAYS.map((d) => (
                <th key={d.id} scope="col" className="p-1 text-center">
                  <button
                    type="button"
                    onClick={() => toggleMany(colIds(d.id))}
                    aria-pressed={allSelected(colIds(d.id))}
                    className="inline-flex min-h-[44px] w-full min-w-[44px] items-center justify-center rounded-btn px-2 text-base font-semibold text-primary-950 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                  >
                    <span aria-hidden="true">{d.short}</span>
                    <span className="sr-only">
                      Select all shifts on {d.label}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SHIFTS.map((s) => (
              <tr key={s.id} className="border-t border-border">
                <th scope="row" className="p-1 text-left">
                  <button
                    type="button"
                    onClick={() => toggleMany(rowIds(s.id))}
                    aria-pressed={allSelected(rowIds(s.id))}
                    className="inline-flex min-h-[44px] items-center rounded-btn px-2 text-base font-semibold text-primary-950 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                  >
                    <span aria-hidden="true">{s.label}</span>
                    <span className="sr-only">
                      Select every day for the {s.label.toLowerCase()} shift
                    </span>
                  </button>
                </th>

                {DAYS.map((d) => {
                  const id = `${idPrefix}-${d.id}-${s.id}`;
                  const checked = selected.has(cellId(d.id, s.id));
                  return (
                    <td key={d.id} className="p-1 text-center">
                      {/* The label is visually hidden but present, so the cell
                          is unambiguous even without table-header association.
                          The visible tick is drawn on the label via peer-*. */}
                      <input
                        type="checkbox"
                        id={id}
                        name={`${idPrefix}[]`}
                        value={cellId(d.id, s.id)}
                        checked={checked}
                        onChange={() => toggleCell(d.id, s.id)}
                        aria-describedby={`${idPrefix}-hint`}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor={id}
                        className={`mx-auto flex h-11 w-11 cursor-pointer items-center justify-center rounded-btn border-2 transition-colors peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary-600 peer-focus-visible:ring-offset-2 ${
                          checked
                            ? "border-primary-700 bg-primary-700 text-white"
                            : "border-borderStrong bg-white hover:bg-primary-50"
                        }`}
                      >
                        {/* A tick, not colour alone. */}
                        <span aria-hidden="true" className="text-lg leading-none">
                          {checked ? "✓" : ""}
                        </span>
                        <span className="sr-only">
                          {d.label} {s.label.toLowerCase()}
                        </span>
                      </label>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p aria-live="polite" className="mt-3 text-base text-textMuted">
        {selected.size === 0
          ? "No slots selected yet."
          : `${selected.size} slot${selected.size === 1 ? "" : "s"} selected.`}
      </p>
    </fieldset>
  );
};

export default AvailabilityGrid;
