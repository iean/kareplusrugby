import PageHeader from "@components/ui/PageHeader";
import Section, { Container } from "@components/ui/Section";
import CtaBand from "@layouts/home/CtaBand";
import Accordion from "@components/ui/Accordion";
import site from "@config/site.json";

export const metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about home care, supported living, care home staffing and working for Kare Plus Rugby.",
  alternates: { canonical: "/faq" },
};

/**
 * FAQ content.
 *
 * Answers describe how the service works in general terms. Anything that would
 * require a specific verified fact - prices, CQC rating, coverage area, notice
 * periods - is left as a visible TODO instead of being guessed at.
 */
const GROUPS = [
  {
    id: "home-care",
    heading: "About care at home",
    items: [
      {
        q: "How quickly can care start?",
        a: "It depends on the level of support needed and where you are. After your assessment we will tell you honestly when we could start — and if we cannot meet your timescale we will say so rather than keep you waiting.",
      },
      {
        q: "Do I get the same carer each time?",
        a: "We plan rotas for continuity, so you should see a small group of familiar faces rather than someone different each visit. Complete continuity is not possible — carers take holiday and get ill — but we introduce anyone new wherever we can.",
      },
      {
        q: "What is the shortest visit you offer?",
        a: "[TODO: CONFIRM MINIMUM VISIT LENGTH — commonly 30 or 60 minutes. Not stated here because it has not been verified.]",
      },
      {
        q: "Can care be changed or stopped?",
        a: "Yes. Care plans are reviewed regularly and can be adjusted whenever your needs change. If you want to stop, you can. [TODO: CONFIRM NOTICE PERIOD FOR ENDING A CARE PACKAGE.]",
      },
      {
        q: "What happens in an emergency?",
        a: "Our carers are trained in what to do and there is an on-call line whenever care is being delivered. If someone needs urgent medical help, the first call is always 999.",
      },
    ],
  },
  {
    id: "staffing",
    heading: "For care homes",
    items: [
      {
        q: "How quickly can you fill a shift?",
        a: "It depends on the role, the time and your location. Call us and we will tell you what we can realistically cover and by when — we would rather be straight with you than take a booking we cannot fill.",
      },
      {
        q: "Are your staff DBS checked?",
        a: "Yes. Every worker we place holds an enhanced DBS check appropriate to the role, alongside verified identity, right to work, references, and — for nurses — current NMC registration checked before placement.",
      },
      {
        q: "Can we request the same staff again?",
        a: "Yes, and we encourage it. Continuity is better for your residents and means less time spent on induction. Tell us who worked well and we will try to send them back.",
      },
      {
        q: "What are your rates?",
        a: "[TODO: INSERT RATE CARD OR CONFIRM RATES ARE PROVIDED ON ENQUIRY. No rates have been invented.]",
      },
    ],
  },
  {
    id: "careers",
    heading: "Working for us",
    items: [
      {
        q: "Do I need experience to apply?",
        a: "No. We recruit people new to care as well as experienced staff. If you are reliable, patient and genuinely interested in people, we will train you in the rest.",
      },
      {
        q: "Do I need a driving licence?",
        a: "It helps, particularly for home care visits across a wider area, but it is not essential for every role. Tell us your situation on the application form.",
      },
      {
        q: "What training will I get?",
        a: "A paid induction aligned to the Care Certificate, mandatory training kept up to date, and shadow shifts before you work independently. There are routes on to senior roles for people who want them.",
      },
      {
        q: "What do you pay?",
        a: "[TODO: INSERT PAY RATES, HOLIDAY, PENSION AND MILEAGE. This is the question applicants care most about and the page is much weaker without a real answer.]",
      },
    ],
  },
  {
    id: "practical",
    heading: "Practical and legal",
    items: [
      {
        q: "Which areas do you cover?",
        a: "We cover Rugby, Coventry, Leicestershire and Northamptonshire. Our office is in Rugby, so that is where we have the deepest coverage, and we work outwards from there. Coverage also depends on the level of support needed and our current staffing, so please call us to check your specific address — we would rather tell you honestly up front than agree to a package we cannot staff properly.",
      },
      {
        q: "Are you regulated?",
        a: "Personal care delivered in someone's home is a regulated activity in England and must be registered with the Care Quality Commission. [TODO: VERIFY AND STATE CURRENT CQC REGISTRATION STATUS AND PROVIDER ID.]",
      },
      {
        q: "How do you handle my personal information?",
        a: "We only use your details to provide and arrange care, and we handle them in line with UK GDPR. Our privacy policy explains what we collect, why, and how long we keep it. You can ask for a copy of your data at any time.",
      },
      {
        q: "How do I make a complaint?",
        a: "Tell us as early as you can — by phone, email or in writing. Our complaints procedure sets out how we investigate and how long it takes. Raising a complaint will never affect the care you receive.",
      },
    ],
  },
];

/**
 * FAQPage structured data. Only questions with a real answer are included -
 * publishing a TODO placeholder as an answer in structured data would put
 * nonsense straight into search results.
 */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: GROUPS.flatMap((g) => g.items)
    .filter((i) => !i.a.includes("[TODO"))
    .map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
};

const FaqPage = () => (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />

    <PageHeader
      eyebrow="FAQs"
      title="Questions people ask us"
      intro="If your question is not here, call us — we would rather answer it properly than have you guess."
      breadcrumbs={[{ label: "FAQs" }]}
    />

    <Section tone="white" size="lg">
      <Container width="narrow">
        <div className="space-y-12">
          {GROUPS.map((g) => (
            <section key={g.id} aria-labelledby={g.id}>
              <h2
                id={g.id}
                className="mb-5 text-2xl font-bold text-primary-950"
              >
                {g.heading}
              </h2>
              <Accordion items={g.items} idPrefix={g.id} />
            </section>
          ))}
        </div>
      </Container>
    </Section>

    <CtaBand
      title="Still not sure?"
      body="Ask us directly. There is no such thing as a silly question when you are arranging care."
      primary={{ label: `Call ${site.business.phone}`, href: site.business.phone_href }}
      secondary={{ label: "Send an enquiry", href: "/contact" }}
    />
  </>
);

export default FaqPage;
