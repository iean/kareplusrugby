/**
 * The four areas Kare Plus Rugby recruits in.
 *
 * Kept in its own import-free module so client components and the JSON-LD
 * builder can both use it without pulling in anything that reads the
 * filesystem.
 *
 * `postal` is what goes into the JobPosting structured data. Google requires a
 * PostalAddress on jobLocation with at least addressLocality, addressRegion and
 * addressCountry. Only the Rugby entry carries a street and postcode, because
 * that is the one address we actually occupy — inventing a street address in
 * Leicester to make the markup look fuller would be a fabricated business
 * location, which is exactly what Google's job policies prohibit.
 */
export const LOCATIONS = [
  {
    id: "coventry",
    label: "Coventry",
    postal: { addressLocality: "Coventry", addressRegion: "West Midlands", addressCountry: "GB" },
  },
  {
    id: "rugby",
    label: "Rugby",
    postal: {
      streetAddress: "6a Davy Court, Castle Mound Way, Central Park",
      addressLocality: "Rugby",
      addressRegion: "Warwickshire",
      postalCode: "CV23 0UZ",
      addressCountry: "GB",
    },
  },
  {
    id: "leicester",
    label: "Leicester",
    postal: { addressLocality: "Leicester", addressRegion: "Leicestershire", addressCountry: "GB" },
  },
  {
    id: "northampton",
    label: "Northampton",
    postal: { addressLocality: "Northampton", addressRegion: "Northamptonshire", addressCountry: "GB" },
  },
];

export const LOCATION_IDS = new Set(LOCATIONS.map((l) => l.id));

export const locationLabel = (id) => LOCATIONS.find((l) => l.id === id)?.label || id;

export const locationById = (id) => LOCATIONS.find((l) => l.id === id) || null;
