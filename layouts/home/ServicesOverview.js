import Image from "next/image";
import Section from "@components/ui/Section";
import SectionHeading from "@components/ui/SectionHeading";
import Card from "@components/ui/Card";
import Reveal from "@components/ui/Reveal";
import { HiArrowRight } from "react-icons/hi";

const SERVICES = [
  {
    title: "Domiciliary Care",
    href: "/domiciliary-care",
    image: "/images/home/home_card_domilciary.jpg",
    alt: "A carer supporting an older person in their own kitchen",
    summary:
      "Support in your own home — from a short daily visit to full live-in care. Personal care, medication support, meals, companionship and help getting out and about.",
    points: ["Hourly visits", "Live-in care", "Respite & short-term cover"],
  },
  {
    title: "Care Home Staffing",
    href: "/care-home-staffing",
    image: "/images/home/home_card_staffing.jpg",
    alt: "A nurse working on a care home ward",
    summary:
      "Registered nurses, senior carers and care assistants supplied to care homes — for planned rotas, sickness cover and last-minute gaps.",
    points: ["RGN & RMN cover", "Day, night & weekend shifts", "Ad-hoc and block bookings"],
  },
  {
    title: "Supported Living",
    href: "/supported-living",
    image: "/images/home/home_card_supported_living.jpg",
    alt: "A support worker helping a young adult prepare a meal",
    summary:
      "Support for adults with learning disabilities, autism or mental health needs to live independently in their own tenancy, at the level of help they choose.",
    points: ["Independent living skills", "Community access", "Flexible support hours"],
  },
];

const ServicesOverview = () => (
  <Section tone="surface" size="lg">
    <SectionHeading
      eyebrow="What we do"
      title="Three services, one standard of care"
      subtitle="Whether you are arranging support for yourself, for a relative, or for the people in your care home, the same trained and vetted team stands behind it."
      className="mb-12"
    />

    <ul className="grid gap-7 md:grid-cols-3">
      {SERVICES.map((s, i) => (
        <li key={s.href}>
          <Reveal delay={i * 90} className="h-full">
            <Card href={s.href} className="group flex h-full flex-col overflow-hidden">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-primary-100">
                <Image
                  src={s.image}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transform-none"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold text-primary-950">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-textMuted">{s.summary}</p>
                <ul className="mt-4 space-y-1.5">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-[15px] text-text">
                      <span aria-hidden="true" className="mt-1 text-primary-600">
                        ✓
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <span className="mt-5 inline-flex items-center gap-2 font-semibold text-primary-700">
                  Learn more
                  <HiArrowRight
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
                  />
                </span>
              </div>
            </Card>
          </Reveal>
        </li>
      ))}
    </ul>
  </Section>
);

export default ServicesOverview;
