import Reveal from "@components/ui/Reveal";

/**
 * Step timeline with connecting line.
 *
 * Horizontal on desktop, vertical on mobile — a horizontal timeline squeezed
 * onto a phone becomes unreadable, and forcing horizontal scroll on a process
 * explainer is a good way to lose people.
 *
 * The connector is decorative and aria-hidden. The steps themselves are an
 * ordered list, so a screen reader announces "1 of 4" naturally without the
 * visual scaffolding.
 */
const StepTimeline = ({ steps, tone = "light" }) => {
  const numBg = tone === "dark" ? "bg-white text-primary-900" : "bg-primary-800 text-white";
  const titleColor = tone === "dark" ? "text-white" : "text-primary-950";
  const bodyColor = tone === "dark" ? "text-white/80" : "text-textMuted";
  const lineColor = tone === "dark" ? "bg-white/25" : "bg-primary-200";
  const ringColor = tone === "dark" ? "ring-primary-900" : "ring-white";

  return (
    <ol className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {/* Desktop connector: one line behind all four markers */}
      <div
        aria-hidden="true"
        className={`absolute left-0 right-0 top-[22px] hidden h-0.5 lg:block ${lineColor}`}
        style={{ marginLeft: "12.5%", marginRight: "12.5%" }}
      />

      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <li key={step.title} className="relative">
            {/* Mobile connector: vertical line between consecutive markers */}
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={`absolute left-[22px] top-12 h-[calc(100%+2rem-3rem)] w-0.5 md:hidden ${lineColor}`}
              />
            )}

            <Reveal delay={i * 110}>
              <div className="flex gap-4 lg:block">
                <span
                  className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold ring-4 ${numBg} ${ringColor}`}
                >
                  {Icon ? (
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  ) : (
                    <span aria-hidden="true">{i + 1}</span>
                  )}
                </span>

                <div className="lg:mt-5">
                  <h3 className={`text-lg font-bold ${titleColor}`}>
                    <span className="sr-only">Step {i + 1}: </span>
                    {step.title}
                  </h3>
                  <p className={`mt-2 leading-relaxed ${bodyColor}`}>{step.body}</p>
                </div>
              </div>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
};

export default StepTimeline;
