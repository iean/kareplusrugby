import { getSinglePage } from "./contentParser";
import { LOCATIONS, LOCATION_IDS } from "./locations";

export { LOCATIONS } from "./locations";

/**
 * Vacancies, read from content/vacancies/*.md.
 *
 * Markdown-backed on purpose: a vacancy can be opened or closed by adding or
 * editing a file, with no code change and no admin login.
 *
 * getSinglePage() already drops anything with `draft: true` and any file whose
 * name starts with an underscore, which is why the instructions file is called
 * _HOW-TO-ADD-A-VACANCY.md and the template carries draft: true. Neither ever
 * reaches the site.
 *
 * When this returns an empty list the careers page says so plainly. It must
 * never fall back to a sample role — an invented vacancy would waste the time
 * of someone who applied for it.
 */

/**
 * Normalise whatever the front matter said into known location ids.
 *
 * Accepts a list ("locations: [rugby, coventry]") or a single value, and is
 * case- and space-insensitive, because these files are hand-written. Anything
 * unrecognised is dropped rather than guessed at — a role filed under a
 * location we do not recruit in would simply never be found.
 */
function normaliseLocations(frontmatter) {
  const raw = frontmatter.locations ?? frontmatter.location_ids ?? [];
  const list = Array.isArray(raw) ? raw : [raw];
  return list
    .map((v) => String(v).trim().toLowerCase())
    .filter((v) => LOCATION_IDS.has(v));
}

export function getVacancies() {
  let pages = [];
  try {
    pages = getSinglePage("content/vacancies");
  } catch {
    // Folder missing entirely - treat as "no vacancies" rather than crashing
    // the whole careers page.
    return [];
  }

  return pages
    .filter((p) => {
      // Hide anything past its closing date. An advert for a role that closed
      // last month is worse than no advert.
      const closing = p.frontmatter.closing;
      if (!closing) return true;
      const d = new Date(closing);
      if (Number.isNaN(d.getTime())) return true;
      // Closing date is inclusive - the role is live until the end of that day.
      return d.setHours(23, 59, 59, 999) >= Date.now();
    })
    .map((p) => ({
      slug: p.slug,
      title: p.frontmatter.title || "Untitled role",
      location: p.frontmatter.location || "",
      locations: normaliseLocations(p.frontmatter),
      type: p.frontmatter.type || "",
      hours: p.frontmatter.hours || "",
      // No default. A missing pay field must not become an invented figure.
      pay: p.frontmatter.pay || "",
      closing: p.frontmatter.closing || "",
      summary: p.frontmatter.summary || "",
      body: p.content || "",
    }));
}

/** How many live vacancies sit in each location, for the filter's counts. */
export function countByLocation(vacancies) {
  const counts = Object.fromEntries(LOCATIONS.map((l) => [l.id, 0]));
  for (const v of vacancies) {
    for (const id of v.locations) counts[id] += 1;
  }
  return counts;
}
