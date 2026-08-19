import PageHeader from "@components/ui/PageHeader";
import Section, { Container } from "@components/ui/Section";
import Card from "@components/ui/Card";
import ContactTabs from "@layouts/forms/ContactTabs";
import site from "@config/site.json";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import LocationMap from "@components/ui/LocationMap";

export const metadata = {
  title: "Contact Us",
  description:
    "Contact Kare Plus Rugby about home care, supported living, care home staffing or careers. Call us or send an enquiry and we will get back to you.",
  alternates: { canonical: "/contact" },
};

const ContactPage = () => {
  const b = site.business;

  const DETAILS = [
    {
      icon: FaPhoneAlt,
      label: "Telephone",
      value: b.phone,
      href: b.phone_href,
      note: "Office hours, with an on-call line outside them",
    },
    { icon: FaEnvelope, label: "Email", value: b.email, href: b.email_href, note: "We aim to reply within one working day" },
    {
      icon: FaMapMarkerAlt,
      label: "Address",
      value: b.address.full,
      href: null,
      note: "Visits by appointment",
    },
    {
      icon: FaClock,
      label: "Opening hours",
      value: b.opening_hours.office,
      href: null,
      note: `On-call ${b.opening_hours.on_call.toLowerCase()}`,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to us"
        intro="Whether you are arranging care, booking staff, or thinking about working with us — we are happy to hear from you."
        breadcrumbs={[{ label: "Contact" }]}
      />

      {/* Urgent notice - safety first, above everything else */}
      <div className="border-b border-danger/30 bg-dangerBg">
        <Container className="py-4">
          <p className="text-center text-[15px] font-semibold text-text">
            <span aria-hidden="true">⚠ </span>
            If someone is in immediate danger or needs urgent medical help, call{" "}
            <strong>999</strong>. This form is not monitored around the clock.
          </p>
        </Container>
      </div>

      <Section tone="white" size="lg">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          {/* Details */}
          <div>
            <h2 className="text-2xl font-bold text-primary-950">
              How to reach us
            </h2>
            <ul className="mt-6 space-y-6">
              {DETAILS.map((d) => {
                const Icon = d.icon;
                return (
                  <li key={d.label} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700"
                    >
                      <Icon />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wide text-textMuted">
                        {d.label}
                      </h3>
                      {d.href ? (
                        <a
                          href={d.href}
                          className="mt-1 block text-lg font-semibold text-primary-700 underline-offset-4 hover:underline"
                        >
                          {d.value}
                        </a>
                      ) : (
                        <p className="mt-1 text-lg font-medium text-text">{d.value}</p>
                      )}
                      <p className="mt-0.5 text-[15px] text-textMuted">{d.note}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <Card className="mt-8 p-6">
              <h3 className="text-lg font-bold text-primary-950">
                Raising a concern
              </h3>
              <p className="mt-2 leading-relaxed text-textMuted">
                If something has gone wrong, we would rather know. Our{" "}
                <a href="/complaints" className="font-medium text-primary-700 underline underline-offset-4">
                  complaints procedure
                </a>{" "}
                explains how to raise it and what happens next. Raising a concern
                will never affect the care you receive.
              </p>
              <p className="mt-3 leading-relaxed text-textMuted">
                For a safeguarding concern, see our{" "}
                <a href="/safeguarding" className="font-medium text-primary-700 underline underline-offset-4">
                  safeguarding page
                </a>
                .
              </p>
            </Card>
          </div>

          {/* Forms */}
          <div>
            <ContactTabs />
          </div>
        </div>
      </Section>

      <Section tone="surface" size="md">
        <h2 className="mb-6 text-2xl font-bold text-primary-950">Find us</h2>
        <LocationMap />
      </Section>
    </>
  );
};

export default ContactPage;
