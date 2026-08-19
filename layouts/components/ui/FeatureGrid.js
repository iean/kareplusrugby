import Card from "@components/ui/Card";
import Reveal from "@components/ui/Reveal";

/**
 * Generic icon + title + body grid, used across the service pages so they
 * share one visual language instead of each inventing its own card style.
 */
const FeatureGrid = ({ items, columns = 3, tone = "card" }) => {
  const cols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <ul className={`grid gap-6 ${cols}`}>
      {items.map((item, i) => {
        const Icon = item.icon;
        const inner = (
          <>
            {Icon && (
              <span
                aria-hidden="true"
                className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-lg text-primary-700"
              >
                <Icon />
              </span>
            )}
            <h3 className="text-lg font-bold text-primary-950">{item.title}</h3>
            <p className="mt-2 leading-relaxed text-textMuted">{item.body}</p>
          </>
        );

        return (
          <li key={item.title}>
            <Reveal delay={(i % 3) * 80} className="h-full">
              {tone === "card" ? (
                <Card className="h-full p-6">{inner}</Card>
              ) : (
                <div className="h-full">{inner}</div>
              )}
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
};

export default FeatureGrid;
