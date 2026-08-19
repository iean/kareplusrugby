import { Container } from "@components/ui/Section";
import StatCounter from "@components/ui/StatCounter";
import Reveal from "@components/ui/Reveal";

/**
 * Stats band.
 *
 * ⚠ EVERY FIGURE HERE IS A PLACEHOLDER. None of these numbers were verifiable,
 * and inventing statistics for a healthcare provider is both dishonest and a
 * regulatory risk (CQC expects marketing to be truthful; the CAP Code applies
 * to substantiation).
 *
 * The band is visibly marked as placeholder so it cannot be mistaken for real
 * data. Replace every value and remove the warning, or delete the section.
 */
const STATS = [
  { value: "10+", label: "Years supporting people at home", todo: "real years in business" },
  { value: "200+", label: "Carers and nurses on our team", todo: "real staff headcount" },
  { value: "24/7", label: "On-call support, every day", todo: "confirm this is accurate" },
  { value: "98%", label: "Shifts filled on request", todo: "real fill rate, or remove" },
];

const Stats = () => (
  <section className="border-y border-amber-400 bg-primary-900 text-white">
    <Container className="py-14 md:py-16">
      <div className="mb-8 text-center">
        <p className="inline-block rounded bg-amber-300/20 px-3 py-1.5 text-sm font-bold text-amber-200">
          ⚠ Placeholder figures — every number below is invented scaffolding and
          must be replaced or removed before launch
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-8 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <li key={s.label}>
            <Reveal delay={i * 90}>
              <div className="text-center">
                <StatCounter
                  value={s.value}
                  className="block text-4xl font-bold tracking-tight text-white md:text-5xl"
                />
                <span className="mt-2 block text-[15px] leading-snug text-primary-100">
                  {s.label}
                </span>
                <span className="mt-2 block text-xs font-semibold text-amber-200">
                  [TODO: {s.todo}]
                </span>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Stats;
