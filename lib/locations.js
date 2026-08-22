/**
 * The four areas Kare Plus Rugby recruits in, per RECRUITMENT-SPEC.md.
 *
 * Deliberately in its own module with no imports. lib/vacancies.js reads the
 * filesystem, so anything importing from there is server-only; the vacancy
 * filter is a client component and needs this list too. Keeping the constants
 * separate is what lets both use it.
 *
 * `id` is what a vacancy's front matter and the URL use; `label` is what a
 * person reads.
 *
 * Note these are the RECRUITING areas, which are not identical to the SERVICE
 * areas in config/site.json — that file says "Leicestershire" and
 * "Northamptonshire" (counties), the spec names Leicester and Northampton
 * (cities). Kept separate deliberately: where we can staff a care package and
 * where we advertise jobs are different questions.
 */
export const LOCATIONS = [
  { id: "coventry", label: "Coventry" },
  { id: "rugby", label: "Rugby" },
  { id: "leicester", label: "Leicester" },
  { id: "northampton", label: "Northampton" },
];

export const LOCATION_IDS = new Set(LOCATIONS.map((l) => l.id));

export const locationLabel = (id) =>
  LOCATIONS.find((l) => l.id === id)?.label || id;
