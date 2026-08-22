import { Container } from "@components/ui/Section";
import StatCounter from "@components/ui/StatCounter";
import Reveal from "@components/ui/Reveal";
import site from "@config/site.json";

/**
 * Facts band.
 *
 * Every value here is verifiable. The band previously carried invented
 * figures - years in business, staff headcount, a 98% fill rate - behind a
 * warning label. Inventing statistics for a healthcare provider is dishonest
 * and a regulatory risk: CQC expects marketing to be truthful and the CAP Code
 * requires substantiation for claims like these.
 *
 * So the numbers were not filled in, they were replaced. Each item below traces
 * to something on the public record or to config/site.json:
 *   - on-call hours: business.opening_hours.on_call
 *   - areas covered: business.areas_served
 *   - CQC registration: business.cqc_provider_id (registered, not yet inspected)
 *   - trading since: business.incorporated (Companies House 14277673)
 *
 * Do not add a figure here that cannot be evidenced if someone asks.
 */
const FACTS = [
  { value: "24/7", label: "On-call support, every day of the year" },
  { value: "4", label: "Areas covered: Rugby, Coventry, Leicestershire, Northamptonshire" },
  { value: "CQC", label: "Registered provider — not yet inspected" },
  { value: "2022", label: "Trading as Kare Plus Rugby since" },
];

const Stats = () => (
  <section className="border-y border-primary-800 bg-primary-900 text-white">
    <Container className="py-14 md:py-16">
      <ul className="grid grid-cols-2 gap-8 lg:grid-cols-4">
        {FACTS.map((s, i) => (
          <li key={s.label}>
            <Reveal delay={i * 90}>
              <div className="text-center">
                <StatCounter
                  value={s.value}
                  className="block text-4xl font-bold tracking-tight text-white md:text-5xl"
                />
                <span className="mt-2 block text-base leading-snug text-primary-100">
                  {s.label}
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
