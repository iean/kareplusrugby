import Section from "@components/ui/Section";
import SectionHeading from "@components/ui/SectionHeading";
import Card from "@components/ui/Card";
import Reveal from "@components/ui/Reveal";
import site from "@config/site.json";
import { User } from "lucide-react";

/**
 * Leadership section.
 *
 * Names and titles are verified from the Companies House register for
 * Divergent Healthcare Limited (company 14277673), and the client has given
 * permission to publish them.
 *
 * DELIBERATELY NOT SHOWN, even though they appear on the public register:
 * dates of birth, nationality, and residential/correspondence addresses.
 * Those are personal data that serve no purpose on a business website and
 * republishing them would be a gift to identity fraud. Name and role only.
 *
 * Bios, photos and the registered manager's name are rendered only once real
 * values exist in config/site.json. Anything still wrapped in [TODO: ...] is
 * treated as absent and the block is left out, rather than shipping a visible
 * placeholder to the public. Fill the value in and the block appears.
 */
const isReal = (v) => typeof v === "string" && v && !v.includes("[TODO");

const Leadership = () => {
  const { directors, registered_manager } = site.business;

  return (
    <Section tone="surface" size="lg">
      <SectionHeading
        eyebrow="Leadership"
        title="Who runs Kare Plus Rugby"
        subtitle="The people accountable for the service we provide."
        className="mb-12"
      />

      <ul className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
        {directors.map((d, i) => (
          <li key={d.name}>
            <Reveal delay={i * 90} className="h-full">
              <Card className="flex h-full flex-col items-center p-7 text-center">
                {/* A neutral avatar, not stock imagery standing in for a real
                    person. Swapped for a photograph once one is supplied. */}
                <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-primary-50">
                  {isReal(d.photo) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={d.photo}
                      alt={d.name}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <User aria-hidden="true" className="h-9 w-9 text-primary-400" />
                  )}
                </div>

                <h3 className="text-xl font-bold text-primary-950">{d.name}</h3>
                <p className="mt-1 font-semibold text-primary-700">{d.title}</p>

                {isReal(d.bio) && (
                  <p className="mt-4 text-base leading-relaxed text-neutral-text-muted">
                    {d.bio}
                  </p>
                )}
              </Card>
            </Reveal>
          </li>
        ))}
      </ul>

      {isReal(registered_manager) && (
        <div className="mx-auto mt-8 max-w-4xl rounded-card border border-border bg-white p-5 text-center">
          <h3 className="font-bold text-primary-950">Registered Manager</h3>
          <p className="mt-1.5 text-base leading-relaxed text-neutral-text-muted">
            {registered_manager}
          </p>
        </div>
      )}
    </Section>
  );
};

export default Leadership;
