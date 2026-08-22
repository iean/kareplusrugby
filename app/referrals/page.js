import PageHeader from "@components/ui/PageHeader";
import Section, { Container } from "@components/ui/Section";
import SectionHeading from "@components/ui/SectionHeading";
import Card from "@components/ui/Card";
import EnquiryForm from "@layouts/forms/EnquiryForm";
import CtaBand from "@layouts/home/CtaBand";
import site from "@config/site.json";
import { Phone, ShieldAlert, ClipboardList, Clock } from "lucide-react";

export const metadata = {
  title: "Referrals for Professionals",
  description:
    "Refer a patient or client to Kare Plus Rugby. For social workers, discharge teams, district nurses and case managers across Rugby, Coventry, Leicestershire and Northamptonshire.",
  alternates: { canonical: "/referrals" },
};

/**
 * Referral page for professionals.
 *
 * The whole page is built around one constraint: a public web form is not an
 * appropriate channel for identifiable health data about someone who has not
 * agreed to it being sent that way. So the form takes INITIALS ONLY, that is
 * enforced on the server as well as in the UI, and the page tells professionals
 * to phone for anything urgent or clinically detailed rather than typing it in.
 *
 * Nothing here claims a response time we have not agreed. It says what we do
 * next, not how fast.
 */
const WHAT_WE_NEED = [
  {
    icon: ClipboardList,
    title: "The shape of the need",
    body: "Roughly what support is required and how often — personal care, medication prompts, overnight cover. Detail can follow by phone.",
  },
  {
    icon: Clock,
    title: "Their area and your timescale",
    body: "A postcode or area tells us straight away whether we can cover it. If there is a discharge date, say so.",
  },
  {
    icon: Phone,
    title: "How to reach you",
    body: "A direct number is best. Most referrals are settled in one call once we have the outline.",
  },
];

const ReferralsPage = () => (
  <>
    <PageHeader
      eyebrow="For professionals"
      title="Refer someone to us"
      intro="For social workers, hospital discharge teams, district nurses, GPs and case managers arranging care on someone else's behalf."
      breadcrumbs={[{ label: "Referrals" }]}
      primary={{ label: `Call ${site.business.phone}`, href: site.business.phone_href }}
      secondary={{ label: "Make a referral", href: "#refer" }}
    />

    {/* Safety and data notice, deliberately before anything else */}
    <div className="border-b border-danger/30 bg-dangerBg">
      <Container className="py-5">
        <div className="mx-auto flex max-w-4xl items-start gap-3">
          <ShieldAlert
            aria-hidden="true"
            className="mt-0.5 h-6 w-6 shrink-0 text-danger"
          />
          <div className="text-base leading-relaxed text-text">
            <p className="font-semibold">
              Please phone us for anything urgent or clinically detailed.
            </p>
            <p className="mt-1.5">
              This form is not monitored around the clock. For a same-day
              discharge, a fast-deteriorating situation, or anything needing
              clinical detail, call{" "}
              <a
                href={site.business.phone_href}
                className="font-semibold text-primary-800 underline underline-offset-4"
              >
                {site.business.phone}
              </a>{" "}
              instead — we can act on a call immediately. If someone is at
              immediate risk, contact the local authority safeguarding team, or
              call 999.
            </p>
          </div>
        </div>
      </Container>
    </div>

    <Section tone="white" size="lg">
      <Container width="narrow">
        <SectionHeading
          eyebrow="Before you start"
          title="Please send initials only"
          align="left"
          className="mb-6"
        />
        <div className="rounded-card border border-primary-200 bg-primary-50 p-6">
          <p className="text-base leading-relaxed text-text">
            Please do <strong>not</strong> enter a full name, date of birth, NHS
            number, address or any clinical record in this form. A public web
            form is not a secure channel for identifiable health data about
            someone who has not agreed to it being sent this way.
          </p>
          <p className="mt-3 text-base leading-relaxed text-text">
            Give us the person&apos;s <strong>initials</strong> and the outline
            of what is needed. We will call you back and confirm their identity
            and the detail with you directly.
          </p>
        </div>
      </Container>
    </Section>

    <Section tone="surface" size="lg">
      <SectionHeading
        eyebrow="What helps us"
        title="What to include"
        className="mb-12"
      />
      <ul className="grid gap-6 md:grid-cols-3">
        {WHAT_WE_NEED.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.title}>
              <Card className="h-full p-6">
                <span
                  aria-hidden="true"
                  className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-primary-700"
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-primary-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-textMuted">
                  {item.body}
                </p>
              </Card>
            </li>
          );
        })}
      </ul>

      <p className="mx-auto mt-8 max-w-3xl text-center text-base leading-relaxed text-textMuted">
        We cover {site.business.areas_served}. Coverage depends on the level of
        support needed and our current staffing, so we will tell you honestly
        whether we can staff a package properly before anything is agreed.
      </p>
    </Section>

    <Section tone="white" size="lg" id="refer">
      <Container width="narrow">
        <EnquiryForm variant="referral" id="referral" />
      </Container>
    </Section>

    <CtaBand
      title="Would rather talk it through?"
      body="Most referrals are settled in a single phone call. If it is easier to pick up the phone, please do."
      primary={{ label: `Call ${site.business.phone}`, href: site.business.phone_href }}
      secondary={{ label: "See what we provide", href: "/care-home-staffing" }}
    />
  </>
);

export default ReferralsPage;
