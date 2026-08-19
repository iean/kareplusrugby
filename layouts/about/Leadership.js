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
 * Bios and photos are placeholders — real ones need to come from the
 * directors themselves.
 */
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
                {/* Photo placeholder - no stock imagery standing in for a real person */}
                <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-primary-300 bg-primary-50">
                  <User aria-hidden="true" className="h-9 w-9 text-primary-400" />
                </div>

                <h3 className="text-xl font-bold text-primary-950">{d.name}</h3>
                <p className="mt-1 font-semibold text-primary-700">{d.title}</p>

                <p className="mt-4 rounded-card border border-dashed border-amber-500 bg-amber-50 p-3 text-sm font-medium text-amber-900">
                  {d.bio} — a short biography and a photograph are needed here.
                </p>
              </Card>
            </Reveal>
          </li>
        ))}
      </ul>

      {/* Registered manager - CQC requires one to be named, but we could not
          verify who it is, so it stays an explicit gap rather than a guess. */}
      <div className="mx-auto mt-8 max-w-4xl rounded-card border-2 border-dashed border-amber-500 bg-amber-50 p-5">
        <h3 className="font-bold text-amber-900">Registered Manager</h3>
        <p className="mt-1.5 text-[15px] leading-relaxed text-amber-900">
          {registered_manager} — CQC requires a registered manager to be named
          for this service. This could not be verified from the public register,
          so it has deliberately been left blank rather than guessed at.
        </p>
      </div>
    </Section>
  );
};

export default Leadership;
