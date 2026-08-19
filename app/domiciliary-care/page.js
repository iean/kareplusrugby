import Image from "next/image";
import PageHeader from "@components/ui/PageHeader";
import Section, { Container } from "@components/ui/Section";
import SectionHeading from "@components/ui/SectionHeading";
import FeatureGrid from "@components/ui/FeatureGrid";
import Card from "@components/ui/Card";
import Reveal from "@components/ui/Reveal";
import CtaBand from "@layouts/home/CtaBand";
import AreasWeCover from "@components/ui/AreasWeCover";
import MultiStepEnquiry from "@layouts/forms/MultiStepEnquiry";
import site from "@config/site.json";
import {
  FaBath, FaPills, FaUtensils, FaWalking, FaHeart, FaMoon,
  FaHome, FaCalendarCheck, FaHandHoldingHeart,
} from "react-icons/fa";

export const metadata = {
  title: "Domiciliary Care at Home",
  description:
    "Domiciliary care from Kare Plus Rugby: personal care, medication support, meals, companionship and live-in care, delivered in your own home by trained, vetted carers.",
  openGraph: {
    title: "Domiciliary Care at Home | Kare Plus Rugby",
    description:
      "Support in your own home — from a short daily visit to full live-in care.",
  },
  alternates: { canonical: "/domiciliary-care" },
};

const INCLUDED = [
  { icon: FaBath, title: "Personal care", body: "Discreet help with washing, dressing, grooming, continence support and getting in and out of bed." },
  { icon: FaPills, title: "Medication support", body: "Prompting, administering and recording medication in line with your care plan and GP instructions." },
  { icon: FaUtensils, title: "Meals and nutrition", body: "Preparing meals to your taste, helping at mealtimes, and keeping an eye on appetite and fluid intake." },
  { icon: FaHome, title: "Help around the home", body: "Light housework, laundry, shopping, and keeping the home safe and comfortable." },
  { icon: FaWalking, title: "Getting out and about", body: "Support to attend appointments, see friends, go to a club, or simply get some fresh air." },
  { icon: FaHeart, title: "Companionship", body: "Time spent talking, sharing a hobby or a cup of tea. Often the part that matters most." },
];

const TYPES = [
  {
    icon: FaCalendarCheck,
    title: "Visiting care",
    body: "Planned visits from as little as half an hour, once or several times a day. Good for a bit of daily help while keeping your independence.",
  },
  {
    icon: FaMoon,
    title: "Overnight care",
    body: "A carer stays overnight — either sleeping in and available if needed, or awake through the night for higher needs.",
  },
  {
    icon: FaHandHoldingHeart,
    title: "Live-in care",
    body: "A carer lives in your home to provide continuous support. Often a genuine alternative to moving into a care home.",
  },
  {
    icon: FaCalendarCheck,
    title: "Respite and short-term care",
    body: "Cover while a family carer takes a break, or short-term support after a hospital stay or a fall.",
  },
];

const DomiciliaryCarePage = () => (
  <>
    <PageHeader
      eyebrow="Care at home"
      title="Support at home, on your terms"
      intro="Most people would rather stay in their own home. Our job is to make that possible — with the right amount of help, from people you get to know."
      breadcrumbs={[{ label: "Domiciliary Care" }]}
      primary={{ label: "Arrange a home assessment", href: "#enquiry" }}
      secondary={{ label: `Call ${site.business.phone}`, href: site.business.phone_href }}
    />

    {/* Intro + image */}
    <Section tone="white" size="lg">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            as="h2"
            align="left"
            eyebrow="What is domiciliary care?"
            title="Care that comes to you"
            className="mb-5"
          />
          <div className="space-y-4 text-lg leading-relaxed text-textMuted">
            <p>
              Domiciliary care — often just called home care — means a trained
              carer comes to your home to help with the things that have become
              difficult. It can be half an hour in the morning, or round-the-clock
              support.
            </p>
            <p>
              It is built around what you actually want. Some people need help
              washing and dressing. Some need someone to make sure medication is
              taken. Some mostly want company. Most want a mixture, and that
              mixture changes over time.
            </p>
            <p className="font-medium text-text">
              Nothing is fixed. If your needs change, the plan changes with them.
            </p>
          </div>
        </div>
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-primary-100 shadow-card">
            <Image
              src="/images/services/personal-care.jpeg"
              alt="A carer helping an older woman at home"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </Section>

    {/* What's included */}
    <Section tone="surface" size="lg">
      <SectionHeading
        eyebrow="What's included"
        title="The everyday things that make the difference"
        subtitle="Your care plan is built from these, in whatever combination suits you."
        className="mb-12"
      />
      <FeatureGrid items={INCLUDED} columns={3} />
    </Section>

    {/* Types of care */}
    <Section tone="white" size="lg">
      <SectionHeading
        eyebrow="Types of support"
        title="However much help you need"
        className="mb-12"
      />
      <FeatureGrid items={TYPES} columns={4} />
    </Section>

    {/* Costs - honest placeholder rather than invented prices */}
    <Section tone="tint" size="md">
      <Container width="narrow">
        <Card className="p-7 md:p-9">
          <h2 className="text-2xl font-bold text-primary-950">
            What does it cost?
          </h2>
          <p className="mt-3 leading-relaxed text-textMuted">
            Costs depend on how much support you need and when. We will always
            give you a clear written quote before anything starts, and we will
            not ask you to commit to a long contract.
          </p>
          <p className="mt-4 rounded-card border-2 border-dashed border-amber-500 bg-amber-50 p-4 text-[15px] font-semibold text-amber-900">
            [TODO: INSERT REAL HOURLY RATES AND LIVE-IN WEEKLY RATES, OR CONFIRM
            THAT PRICING SHOULD STAY &quot;ON ENQUIRY&quot;. No rates have been
            invented here.]
          </p>
          <p className="mt-4 leading-relaxed text-textMuted">
            You may be entitled to help with funding through your local council
            or NHS Continuing Healthcare. We can point you in the right
            direction, though we cannot give financial advice.
          </p>
        </Card>
      </Container>
    </Section>

    {/* Enquiry form */}
    <Section tone="white" size="lg" id="enquiry">
      <Container width="narrow">
        <SectionHeading
          eyebrow="Enquire"
          title="Arrange a free home assessment"
          subtitle="Three short steps. No obligation, and no charge for the assessment."
          className="mb-8"
        />
        <MultiStepEnquiry id="care-enquiry" />
      </Container>
    </Section>

    <AreasWeCover tone="surface" compact />

    <CtaBand
      title="Would it help to talk it through first?"
      body="You do not need to have decided anything. Call us and we will talk through the options — including the ones that are not us."
      primary={{ label: `Call ${site.business.phone}`, href: site.business.phone_href }}
      secondary={{ label: "Read our FAQs", href: "/faq" }}
    />
  </>
);

export default DomiciliaryCarePage;
