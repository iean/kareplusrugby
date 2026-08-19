/**
 * Accordion built on native <details>/<summary>.
 *
 * Deliberately not a JavaScript accordion: <details> is keyboard accessible,
 * screen-reader friendly and searchable by the browser's find-in-page for free,
 * with no state to get wrong. It also works before hydration, which matters on
 * an FAQ page people may land on from search on a slow connection.
 */
const Accordion = ({ items, idPrefix = "faq" }) => (
  <div className="divide-y divide-border overflow-hidden rounded-card border border-border bg-white shadow-card">
    {items.map((item, i) => (
      <details key={`${idPrefix}-${i}`} className="group">
        <summary
          className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 text-left font-semibold text-primary-950 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-600 md:p-6 [&::-webkit-details-marker]:hidden"
        >
          <h3 className="text-[17px] leading-snug">{item.q}</h3>
          <span
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-xl leading-none text-primary-600 transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
          >
            +
          </span>
        </summary>
        <div className="px-5 pb-5 md:px-6 md:pb-6">
          <p className="max-w-prose leading-relaxed text-textMuted">{item.a}</p>
        </div>
      </details>
    ))}
  </div>
);

export default Accordion;
