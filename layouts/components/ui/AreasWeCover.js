import Section, { Container } from "@components/ui/Section";
import SectionHeading from "@components/ui/SectionHeading";
import Card from "@components/ui/Card";
import Reveal from "@components/ui/Reveal";
import Button from "@components/ui/Button";
import site from "@config/site.json";
import { MapPin, Home, Phone } from "lucide-react";

/**
 * Areas we cover.
 *
 * Two jobs: reassure a visitor that we actually reach their address, and give
 * search engines real local signals. "Home care in Rugby" and "care agency
 * Coventry" are how people actually search, and a page that only says "the
 * Midlands" ranks for nothing and reassures nobody.
 *
 * DELIBERATELY ABSENT: any client names, case studies, or "we support N
 * families in X". Care clients are identifiable individuals and naming them,
 * or even describing them narrowly enough to be identifiable, would be a UK
 * GDPR problem. Everything here describes the AREA and OUR SERVICE, never a
 * person.
 *
 * The place lists are genuine towns and districts within each named county —
 * they describe geography, not a claim about existing clients there.
 */
const AreasWeCover = ({ tone = "surface", compact = false }) => {
  const { areas, areas_note, phone, phone_href } = site.business;

  return (
    <Section tone={tone} size={compact ? "md" : "lg"} id="areas">
      <SectionHeading
        eyebrow="Where we work"
        title="Areas we cover"
        subtitle="We support people at home, and supply staff to care homes, across four areas around our Rugby base."
        className="mb-12"
      />

      <ul className="grid gap-6 md:grid-cols-2">
        {areas.map((a, i) => (
          <li key={a.id}>
            <Reveal delay={i * 80} className="h-full">
              <Card className="flex h-full flex-col p-6 md:p-7">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700"
                    >
                      {a.home ? <Home className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-primary-950">{a.name}</h3>
                      <p className="text-sm text-textMuted">{a.county}</p>
                    </div>
                  </div>

                  {a.home && (
                    // Brand green as a decorative fill only - it is 1.95:1 on
                    // white, so the text on it must be dark navy, never white.
                    <span className="shrink-0 rounded-full bg-brandGreen px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-950">
                      Our base
                    </span>
                  )}
                </div>

                <p className="leading-relaxed text-textMuted">{a.body}</p>

                <div className="mt-5 border-t border-border pt-4">
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-textMuted">
                    Including
                  </h4>
                  <ul className="flex flex-wrap gap-2">
                    {a.places.map((p) => (
                      <li
                        key={p}
                        className="rounded-full bg-primary-50 px-3 py-1 text-[13px] font-medium text-primary-800"
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </Reveal>
          </li>
        ))}
      </ul>

      {/* Honesty note - deliberately not buried */}
      <Container width="narrow" className="mt-10 px-0">
        <div className="rounded-card border border-primary-200 bg-primary-50 p-5 md:p-6">
          <p className="leading-relaxed text-text">{areas_note}</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href={phone_href} size="md">
              <Phone aria-hidden="true" className="h-4 w-4" />
              Check your area — {phone}
            </Button>
            <Button href="/contact" variant="secondary" size="md">
              Send an enquiry
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default AreasWeCover;
