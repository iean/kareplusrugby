/**
 * The site-wide header now lives in app/layout.js (SiteHeader), so this
 * layout no longer renders its own. It previously rendered a second header
 * with a section-specific sub-menu, which duplicated navigation.
 *
 * Kept as a pass-through rather than deleted so the route group and its
 * history stay intact.
 */
export default function StaffingLayout({ children }) {
  return <>{children}</>;
}
