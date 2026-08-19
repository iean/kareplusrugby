import Image from "next/image";
import PageHeader from "@components/ui/PageHeader";
import Section, { Container } from "@components/ui/Section";
import SectionHeading from "@components/ui/SectionHeading";
import FeatureGrid from "@components/ui/FeatureGrid";
import Reveal from "@components/ui/Reveal";
import CtaBand from "@layouts/home/CtaBand";
import Leadership from "@layouts/about/Leadership";
import site from "@config/site.json";
import {
  FaHandHoldingHeart, FaBalanceScale, FaEye, FaUsers, FaShieldAlt, FaSeedling,
} from "react-icons/fa";

export const metadata = {
  title: "About Us",
  description:
    "Kare Plus Rugby provides domiciliary care, supported living and care home staffing. Learn about our values, how we recruit, and how we are regulated.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  { icon: FaHandHoldingHeart, title: "Kindness, practically", body: "Warmth matters, but so does turning up on time and doing what we said we would. We treat reliability as part of being kind." },
  { icon: FaBalanceScale, title: "Dignity and choice", body: "People decide how they are supported — what time they get up, what they eat, what they would rather do themselves." },
  { icon: FaEye, title: "Openness", body: "Clear pricing, clear care plans, and honest answers. If we are not the right service for someone, we say so." },
  { icon: FaShieldAlt, title: "Safety first", body: "Safer recruitment, ongoing training, and a culture where raising a concern is expected rather than awkward." },
  { icon: FaUsers, title: "Looking after our staff", body: "Care work is hard. Well-supported carers stay longer, and continuity of carer is one of the strongest predictors of good care." },
  { icon: FaSeedling, title: "Independence, not dependence", body: "Good support helps people do things for themselves wherever possible, rather than taking over." },
];

const AboutPage = () => (
  <>
    <PageHeader
      eyebrow="About us"
      title="Caring from the heart"
      intro="Kare Plus Rugby supports people to live well at home, and supplies the nurses and carers that care homes depend on."
      breadcrumbs={[{ label: "About" }]}
      primary={{ label: "Get in touch", href: "/contact" }}
      secondary={{ label: "Work with us", href: "/careers" }}
    />

    <Section tone="white" size="lg">
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            as="h2" align="left"
            eyebrow="Our story"
            title="Who we are"
            className="mb-5"
          />
          <div className="space-y-4 text-lg leading-relaxed text-textMuted">
            <p>
              Kare Plus Rugby works across two sides of the same sector.
              We provide care directly to people in their own homes, and we
              supply trained staff to care homes that need cover.
            </p>
            <p>
              Doing both gives us an unusual vantage point. We see what good care
              looks like from the inside of a care home and from a client&apos;s
              front room, and we hold our own service to the standard we would
              want for our own families.
            </p>
            <div className="rounded-card border-2 border-dashed border-amber-500 bg-amber-50 p-4 text-[15px] font-semibold text-amber-900">
              [TODO: REPLACE THIS SECTION WITH THE REAL COMPANY STORY — when
              Kare Plus Rugby was founded, by whom, and why. Nothing about the
              founding date, founder or history has been invented here.]
            </div>
          </div>
        </div>
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-primary-100 shadow-card">
            <Image
              src="/images/services/care-unique-domiliciary.jpeg"
              alt="A carer talking with a client in their living room"
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
        eyebrow="What we stand for"
        title="Our values"
        subtitle="Not a poster on a wall — these are the things we actually check ourselves against."
        className="mb-12"
      />
      <FeatureGrid items={VALUES} columns={3} />
    </Section>

    {/* Regulation - handled carefully, nothing asserted */}
    <Section tone="white" size="md">
      <Container width="narrow">
        <div className="rounded-card border border-border bg-white p-7 shadow-card md:p-9">
          <h2 className="text-2xl font-bold text-primary-950">
            Regulation and governance
          </h2>
          <p className="mt-3 leading-relaxed text-textMuted">
            Personal care delivered in someone&apos;s home is a regulated
            activity in England and must be registered with the Care Quality
            Commission. Care homes we supply staff to are regulated in their own
            right.
          </p>
          <dl className="mt-6 space-y-4">
            {[
              ["Legal entity", site.business.legal_name],
              ["Trading as", site.business.trading_name],
              ["Companies House number", `${site.business.companies_house_number} (incorporated ${site.business.incorporated})`],
              ["CQC provider", site.business.cqc_provider_name],
              ["CQC provider ID", site.business.cqc_provider_id],
              ["CQC status", site.business.cqc_status],
              ["ICO registration", site.business.ico_registration],
            ].map(([label, value]) => (
              <div key={label} className="border-t border-border pt-4">
                <dt className="text-sm font-semibold uppercase tracking-wide text-textMuted">
                  {label}
                </dt>
                <dd className="mt-1 font-medium text-text">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-[15px] leading-relaxed text-textMuted">
            These details are taken from the Companies House and CQC public
            registers. You can check our CQC registration yourself at{" "}
            <a
              href={site.business.cqc_profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary-700 underline underline-offset-4"
            >
              cqc.org.uk
            </a>
            . No rating is shown because this service has not yet been
            inspected.
          </p>
        </div>
      </Container>
    </Section>

    <Leadership />

    <CtaBand
      title="Want to know more?"
      body="Ask us anything — about how we work, how we recruit, or whether we cover your area."
      primary={{ label: "Contact us", href: "/contact" }}
      secondary={{ label: "Read our FAQs", href: "/faq" }}
    />
  </>
);

export default AboutPage;
