import Image from "next/image";
import PageHeader from "@components/ui/PageHeader";
import Section, { Container } from "@components/ui/Section";
import SectionHeading from "@components/ui/SectionHeading";
import FeatureGrid from "@components/ui/FeatureGrid";
import Reveal from "@components/ui/Reveal";
import CtaBand from "@layouts/home/CtaBand";
import AreasWeCover from "@components/ui/AreasWeCover";
import EnquiryForm from "@layouts/forms/EnquiryForm";
import site from "@config/site.json";
import {
  FaKey, FaUtensils, FaPoundSign, FaBus, FaUsers,
  FaBriefcase, FaHeartbeat, FaComments,
} from "react-icons/fa";

export const metadata = {
  title: "Supported Living",
  description:
    "Supported living from Kare Plus Rugby: flexible support for adults with learning disabilities, autism or mental health needs to live independently in their own home.",
  openGraph: {
    title: "Supported Living | Kare Plus Rugby",
    description:
      "Support for adults to live independently in their own tenancy, at the level of help they choose.",
  },
  alternates: { canonical: "/supported-living" },
};

const SUPPORT = [
  { icon: FaKey, title: "Your own tenancy", body: "You hold the tenancy for your home. Support is separate from where you live, so it can change without you having to move." },
  { icon: FaUtensils, title: "Daily living skills", body: "Cooking, cleaning, laundry and shopping — done alongside you, so you build confidence rather than having it done for you." },
  { icon: FaPoundSign, title: "Money and admin", body: "Help with budgeting, bills, benefits paperwork and appointments, at whatever level you need." },
  { icon: FaHeartbeat, title: "Health and wellbeing", body: "Support to attend appointments, manage medication and stay well, working with your GP and other professionals." },
  { icon: FaBus, title: "Getting out and about", body: "Building confidence with public transport and getting to the places you want to go." },
  { icon: FaUsers, title: "Friendships and community", body: "Support to join groups, keep up hobbies and stay connected to the people who matter to you." },
  { icon: FaBriefcase, title: "Work, study and volunteering", body: "Practical help to find and keep a job, a course or a volunteering placement." },
  { icon: FaComments, title: "Having your say", body: "Your support plan is written with you. You decide what good support looks like, and you can change it." },
];

const SupportedLivingPage = () => (
  <>
    <PageHeader
      eyebrow="Supported living"
      title="Your own home, with support that fits"
      intro="Support for adults with learning disabilities, autism, or mental health needs to live independently — with as much or as little help as you want."
      breadcrumbs={[{ label: "Supported Living" }]}
      primary={{ label: "Make an enquiry", href: "#enquiry" }}
      secondary={{ label: `Call ${site.business.phone}`, href: site.business.phone_href }}
    />

    <Section tone="white" size="lg">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            as="h2"
            align="left"
            eyebrow="What is supported living?"
            title="Independence with a safety net"
            className="mb-5"
          />
          <div className="space-y-4 text-lg leading-relaxed text-textMuted">
            <p>
              Supported living means living in your own home — your own tenancy,
              your own front door — with support workers helping with the parts
              of life you find difficult.
            </p>
            <p>
              It is different from a residential home. The support is built
              around you rather than around a building, and it can go up or down
              as things change. Some people need someone there most of the day.
              Others want a few hours a week.
            </p>
            <p className="font-medium text-text">
              The goal is always the same: for you to need us less over time, not
              more.
            </p>
          </div>
        </div>
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-primary-100 shadow-card">
            <Image
              src="/images/services/supported-living.jpg"
              alt="A support worker and a young adult cooking together at home"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </Section>

    <Section tone="surface" size="lg">
      <SectionHeading
        eyebrow="What we help with"
        title="Support built around your life"
        subtitle="Pick what you want help with. Leave the rest."
        className="mb-12"
      />
      <FeatureGrid items={SUPPORT} columns={4} />
    </Section>

    <Section tone="tint" size="md">
      <Container width="narrow">
        <div className="rounded-card border border-border bg-white p-7 shadow-card md:p-9">
          <h2 className="text-2xl font-bold text-primary-950">
            How supported living is funded
          </h2>
          <p className="mt-3 leading-relaxed text-textMuted">
            Supported living is usually funded through a local authority care
            package, NHS Continuing Healthcare, or a personal budget or direct
            payment. Housing costs are normally covered separately, often through
            Housing Benefit or Universal Credit.
          </p>
          <p className="mt-4 leading-relaxed text-textMuted">
            If you are not sure what you are entitled to, talk to your social
            worker or care manager. We can work alongside them, but we cannot
            give benefits or financial advice.
          </p>
          <p className="mt-4 rounded-card border-2 border-dashed border-amber-500 bg-amber-50 p-4 text-[15px] font-semibold text-amber-900">
            [TODO: CONFIRM WHICH LOCAL AUTHORITIES KARE PLUS RUGBY HOLDS
            CONTRACTS WITH, AND WHETHER SUPPORTED LIVING IS AVAILABLE IN ALL
            OPERATING AREAS.]
          </p>
        </div>
      </Container>
    </Section>

    <Section tone="white" size="lg" id="enquiry">
      <Container width="narrow">
        <EnquiryForm variant="referral" id="enquiry-form" />
      </Container>
    </Section>

    <AreasWeCover tone="surface" compact />

    <CtaBand
      title="Referring someone for supported living?"
      body="We work with social workers, care managers and families. Get in touch and we will tell you honestly whether we are the right fit."
      primary={{ label: `Call ${site.business.phone}`, href: site.business.phone_href }}
      secondary={{ label: "Read our FAQs", href: "/faq" }}
    />
  </>
);

export default SupportedLivingPage;
