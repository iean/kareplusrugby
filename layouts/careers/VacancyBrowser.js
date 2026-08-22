"use client";

import { useMemo, useState } from "react";
import { LOCATIONS } from "@lib/locations";
import VacancyList from "./VacancyList";

/**
 * Vacancy list with a location filter.
 *
 * Accessibility notes, because a filter built from bare <div>s is a common
 * trap:
 *  - The filter is a real <fieldset> of radio inputs with a <legend>, so a
 *    screen reader announces it as one group with one selectable answer, and
 *    arrow keys move between options for free. It is styled to look like
 *    buttons; it behaves like radios.
 *  - Selecting a filter updates a live region announcing how many roles now
 *    show, so the change is not silent for anyone not watching the screen.
 *  - Each label carries its own count, so the information is not conveyed by
 *    position or colour alone.
 *  - Every control is at least 44px high.
 *
 * The filter renders only when there is more than one location to choose
 * between. Showing four filter buttons above an empty list, or above three
 * roles that are all in Rugby, is noise.
 */
const VacancyBrowser = ({ vacancies }) => {
  const [active, setActive] = useState("all");

  const counts = useMemo(() => {
    const c = { all: vacancies.length };
    for (const l of LOCATIONS) {
      c[l.id] = vacancies.filter((v) => v.locations.includes(l.id)).length;
    }
    return c;
  }, [vacancies]);

  // Only offer locations that actually have a role in them.
  const available = LOCATIONS.filter((l) => counts[l.id] > 0);

  const shown = useMemo(
    () =>
      active === "all"
        ? vacancies
        : vacancies.filter((v) => v.locations.includes(active)),
    [vacancies, active],
  );

  const showFilter = vacancies.length > 0 && available.length > 1;

  const options = [{ id: "all", label: "All locations" }, ...available];

  return (
    <div>
      {showFilter && (
        <fieldset className="mb-8">
          <legend className="mb-3 text-base font-semibold text-primary-950">
            Filter by location
          </legend>
          <div className="flex flex-wrap gap-2">
            {options.map((o) => {
              const id = `vacancy-filter-${o.id}`;
              const isActive = active === o.id;
              return (
                <div key={o.id}>
                  {/* The input is visually hidden but NOT display:none, so it
                      stays focusable and reachable by a screen reader. The
                      focus ring is drawn on the label via peer-focus-visible. */}
                  <input
                    type="radio"
                    id={id}
                    name="vacancy-location"
                    value={o.id}
                    checked={isActive}
                    onChange={() => setActive(o.id)}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={id}
                    className={`inline-flex min-h-[44px] cursor-pointer items-center rounded-full border px-5 py-2 text-base font-semibold transition-colors peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary-600 peer-focus-visible:ring-offset-2 ${
                      isActive
                        ? "border-primary-700 bg-primary-700 text-white"
                        : "border-borderStrong bg-white text-primary-900 hover:bg-primary-50"
                    }`}
                  >
                    {o.label}
                    <span className="ml-2 text-base font-normal opacity-80">
                      ({counts[o.id]})
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Announce the result of filtering to screen readers. */}
      <p aria-live="polite" className="sr-only">
        {shown.length === 1
          ? "1 role shown"
          : `${shown.length} roles shown`}
        {active !== "all"
          ? ` in ${options.find((o) => o.id === active)?.label}`
          : ""}
      </p>

      {shown.length === 0 && vacancies.length > 0 ? (
        <div className="rounded-card border border-border bg-white p-7 text-center shadow-card">
          <h3 className="text-lg font-bold text-primary-950">
            Nothing in that location right now
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-textMuted">
            We recruit continuously, so this changes often. Try another
            location, or send us an application anyway and we will tell you what
            is coming up near you.
          </p>
          <a
            href="#apply"
            className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-btn bg-primary-700 px-7 py-3.5 font-semibold text-white transition hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
          >
            Send a general application
          </a>
        </div>
      ) : (
        <VacancyList vacancies={shown} />
      )}

      {/* The general application route, per Phase 1 of RECRUITMENT-SPEC.md.
          Shown whenever there ARE vacancies listed — the two empty states above
          already offer it, and repeating it there would be noise. Someone who
          scrolled a list of roles and found nothing that fits needs this at the
          bottom, which is where they will be looking. */}
      {shown.length > 0 && (
        <div className="mt-8 rounded-card border border-dashed border-borderStrong bg-surface p-6 text-center">
          <h3 className="text-lg font-bold text-primary-950">
            None of these quite right?
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-base leading-relaxed text-textMuted">
            Send us a general application. We recruit continuously across
            Coventry, Rugby, Leicester and Northampton, and roles come up at
            short notice — we will tell you honestly what is coming up near you.
          </p>
          <a
            href="#apply"
            className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-btn border-2 border-primary-700 px-7 py-3 font-semibold text-primary-800 transition hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
          >
            Send a general application
          </a>
        </div>
      )}
    </div>
  );
};

export default VacancyBrowser;
