import Section from "@components/ui/Section";
import Card from "@components/ui/Card";
import Reveal from "@components/ui/Reveal";
import site from "@config/site.json";
import { FaHouseUser, FaHospitalUser, FaUserNurse } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";

/**
 * Three-way router for the site's three distinct visitor intents.
 *
 * Sits directly under the hero because the single biggest navigation problem
 * on the old site was that a carer looking for a job, a family arranging care
 * and a care home manager all landed on the same undifferentiated homepage.
 */
const ICONS = {
  care: FaHouseUser,
  staff: FaHospitalUser,
  work: FaUserNurse,
};

const IntentRouter = () => (
  <Section tone="white" size="md" className="-mt-px">
    <h2 className="sr-only">Choose the option that describes you</h2>
    <ul className="grid gap-6 md:grid-cols-3">
      {site.nav.intents.map((intent, i) => {
        const Icon = ICONS[intent.id];
        return (
          <li key={intent.id}>
            <Reveal delay={i * 90} className="h-full">
              <Card href={intent.url} className="group flex h-full flex-col p-7">
                <span
                  aria-hidden="true"
                  className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-xl text-primary-700 transition-colors group-hover:bg-primary-100"
                >
                  <Icon />
                </span>
                <h3 className="text-xl font-bold text-primary-950">
                  {intent.label}
                </h3>
                <p className="mt-2 flex-1 leading-relaxed text-textMuted">
                  {intent.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 font-semibold text-primary-700">
                  {intent.cta}
                  <HiArrowRight
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
                  />
                </span>
              </Card>
            </Reveal>
          </li>
        );
      })}
    </ul>
  </Section>
);

export default IntentRouter;
