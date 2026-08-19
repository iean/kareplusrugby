import Image from "next/image";
import PageHeader from "@components/ui/PageHeader";
import Section, { Container } from "@components/ui/Section";
import SectionHeading from "@components/ui/SectionHeading";
import FeatureGrid from "@components/ui/FeatureGrid";
import Card from "@components/ui/Card";
import Reveal from "@components/ui/Reveal";
import CtaBand from "@layouts/home/CtaBand";
import AreasWeCover from "@components/ui/AreasWeCover";
import EnquiryForm from "@layouts/forms/EnquiryForm";
import site from "@config/site.json";
import {
  FaUserNurse, FaUserMd, FaUsers, FaHandsHelping,
  FaIdCard, FaFileContract, FaGraduationCap, FaSyringe,
  FaClock, FaCalendarAlt, FaBolt, FaExchangeAlt,
} from "react-icons/fa";

export const metadata = {
  title: "Care Home Staffing — Nurses & Carers",
  description:
    "Kare Plus Rugby supplies registered nurses, senior carers and care assistants to care homes. Planned rotas, sickness cover and last-minute shifts, from staff who are properly vetted.",
  openGraph: {
    title: "Care Home Staffing | Kare Plus Rugby",
    description:
      "Registered nurses, senior carers and care assistants supplied to care homes.",
  },
  alternates: { canonical: "/care-home-staffing" },
};

const ROLES = [
  { icon: FaUserNurse, title: "Registered nurses (RGN)", body: "General nurses for clinical care, medication rounds, wound care and care planning." },
  { icon: FaUserMd, title: "Mental health nurses (RMN)", body: "RMNs for homes supporting residents with dementia and complex mental health needs." },
  { icon: FaUsers, title: "Senior carers", body: "Experienced staff who can lead a shift, administer medication and supervise a team." },
  { icon: FaHandsHelping, title: "Care assistants", body: "Trained care assistants for personal care, mealtimes, mobility and companionship." },
];

const VETTING = [
  { icon: FaIdCard, title: "Identity and right to work", body: "Documents verified in person before anyone is placed. We check the person in front of us is the person on the paperwork." },
  { icon: FaFileContract, title: "Enhanced DBS", body: "Every worker holds an enhanced DBS check appropriate to the role, and we re-check in line with our policy." },
  { icon: FaGraduationCap, title: "Training and competency", body: "Induction aligned to the Care Certificate, mandatory training kept current, and role-specific competency sign-off." },
  { icon: FaSyringe, title: "References and registration", body: "Employment references obtained and checked. For nurses, we verify current NMC registration before every placement." },
];

const FLEXIBILITY = [
  { icon: FaBolt, title: "Urgent and same-day cover", body: "Sickness happens. Call us and we will tell you honestly what we can fill and by when." },
  { icon: FaCalendarAlt, title: "Block bookings", body: "Longer placements for maternity leave, vacancies you are recruiting into, or seasonal pressure." },
  { icon: FaClock, title: "Days, nights and weekends", body: "Cover across the full rota, including the shifts that are hardest to fill." },
  { icon: FaExchangeAlt, title: "Continuity where possible", body: "We try to send the same faces back to the same home. It is better for your residents and easier for your team." },
];

const CareHomeStaffingPage = () => (
  <>
    <PageHeader
      eyebrow="For care homes"
      title="Staff you can put on the rota with confidence"
      intro="Registered nurses, senior carers and care assistants — properly checked, properly trained, and briefed before they walk through your door."
      breadcrumbs={[{ label: "Care Home Staffing" }]}
      primary={{ label: "Request staff", href: "#request" }}
      secondary={{ label: `Call ${site.business.phone}`, href: site.business.phone_href }}
    />

    <Section tone="white" size="lg">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-primary-100 shadow-card">
            <Image
              src="/images/services/temporary-staffing.jpg"
              alt="Care staff working together in a care home"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <div className="order-1 lg:order-2">
          <SectionHeading
            as="h2"
            align="left"
            eyebrow="Why homes work with us"
            title="Agency cover without the gamble"
            className="mb-5"
          />
          <div className="space-y-4 text-lg leading-relaxed text-textMuted">
            <p>
              The problem with agency staff is rarely availability. It is not
              knowing who will turn up, what they can actually do, and whether
              your permanent team will spend the shift covering for them.
            </p>
            <p>
              We work the other way round. Staff are vetted before they join our
              team, not after you have booked them. We tell you who is coming.
              And if someone is not right for your home, tell us and we will not
              send them again.
            </p>
            <p className="font-medium text-text">
              If we cannot fill a shift, we will say so straight away rather than
              leave you waiting.
            </p>
          </div>
        </div>
      </div>
    </Section>

    <Section tone="surface" size="lg">
      <SectionHeading
        eyebrow="Who we supply"
        title="Roles we cover"
        className="mb-12"
      />
      <FeatureGrid items={ROLES} columns={4} />
    </Section>

    <Section tone="white" size="lg">
      <SectionHeading
        eyebrow="Vetting"
        title="How we check the people we send"
        subtitle="Safer recruitment is not optional in this sector. This is our process."
        className="mb-12"
      />
      <FeatureGrid items={VETTING} columns={2} />
      {/* Verifiable fact only - no claim about any individual worker's status */}
      <div className="mx-auto mt-10 max-w-3xl rounded-card border border-primary-200 bg-primary-50 p-6">
        <h3 className="text-lg font-bold text-primary-950">
          Licensed UK visa sponsor
        </h3>
        <p className="mt-1.5 leading-relaxed text-textMuted">
          {site.business.legal_name} holds an active, A-rated UK sponsor
          licence. Every worker we place has their right to work verified before
          they set foot in your home, whatever their immigration route.
        </p>
      </div>

      <p className="mx-auto mt-6 max-w-3xl rounded-card border-2 border-dashed border-amber-500 bg-amber-50 p-4 text-center text-[15px] font-semibold text-amber-900">
        [TODO: CONFIRM THIS VETTING PROCESS MATCHES WHAT KARE PLUS RUGBY
        ACTUALLY DOES, AND ADD ANY ACCREDITATIONS OR FRAMEWORK MEMBERSHIPS. No
        specific standards, percentages or certifications have been claimed.]
      </p>
    </Section>

    <Section tone="tint" size="lg">
      <SectionHeading
        eyebrow="Flexibility"
        title="Cover that fits your rota"
        className="mb-12"
      />
      <FeatureGrid items={FLEXIBILITY} columns={4} />
    </Section>

    <Section tone="white" size="md">
      <Container width="narrow">
        <Card className="p-7 md:p-9">
          <h2 className="text-2xl font-bold text-primary-950">Rates and terms</h2>
          <p className="mt-3 leading-relaxed text-textMuted">
            Rates vary by role, shift pattern and notice period. We will give you
            a full rate card before you book anything, with no hidden charges.
          </p>
          <p className="mt-4 rounded-card border-2 border-dashed border-amber-500 bg-amber-50 p-4 text-[15px] font-semibold text-amber-900">
            [TODO: INSERT REAL RATE CARD, PAYMENT TERMS AND ANY
            TEMP-TO-PERM/TRANSFER FEES — or confirm these should stay on
            enquiry.]
          </p>
        </Card>
      </Container>
    </Section>

    <Section tone="surface" size="lg" id="request">
      <Container width="narrow">
        <EnquiryForm variant="staffing" id="request-form" />
      </Container>
    </Section>

    <AreasWeCover tone="white" compact />

    <CtaBand
      title="Need cover tonight?"
      body="Online forms are not much use at 6pm on a Friday. If a shift needs filling urgently, phone us."
      primary={{ label: `Call ${site.business.phone}`, href: site.business.phone_href }}
      secondary={{ label: "See who we recruit", href: "/careers" }}
    />
  </>
);

export default CareHomeStaffingPage;
