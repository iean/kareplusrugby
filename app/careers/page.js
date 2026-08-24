import PageHeader from "@components/ui/PageHeader";
import Section, { Container } from "@components/ui/Section";
import SectionHeading from "@components/ui/SectionHeading";
import FeatureGrid from "@components/ui/FeatureGrid";
import Card from "@components/ui/Card";
import CtaBand from "@layouts/home/CtaBand";
import site from "@config/site.json";
import VacancyList from "@layouts/careers/VacancyList";
import { getVacancies } from "@lib/vacancies";
import {
  FaCalendarAlt, FaGraduationCap, FaUserFriends, FaRoute,
  FaHeadset, FaChartLine,
} from "react-icons/fa";
import { BadgeCheck } from "lucide-react";

export const metadata = {
  title: "Careers — Carer & Nurse Jobs",
  description:
    "Join Kare Plus Rugby. We recruit care assistants, senior carers, support workers and registered nurses for home care and care home placements. Apply online.",
  openGraph: {
    title: "Careers at Kare Plus Rugby",
    description: "Carer, support worker and nurse roles. Apply online in a few minutes.",
  },
  alternates: { canonical: "/careers" },
};

const BENEFITS = [
  { icon: FaCalendarAlt, title: "Shifts that fit your life", body: "Tell us when you can work. Full time, part time, nights, weekends or bank shifts around study or family." },
  { icon: FaGraduationCap, title: "Training that counts", body: "A paid induction, the Care Certificate, and all the mandatory training the role requires — kept up to date. If you want to go further we can support you towards an NVQ Level 2 or Level 3." },
  { icon: FaUserFriends, title: "A real person to call", body: "You get a named coordinator who knows you — not a different voice on the phone every time." },
  { icon: FaRoute, title: "Work near home", body: "We match you to work close to where you live wherever we can, so you spend less of your day travelling." },
  { icon: FaHeadset, title: "Out-of-hours support", body: "Someone is on call whenever you are working, so you are never on your own with a difficult situation." },
  { icon: FaChartLine, title: "Somewhere to go", body: "Routes from care assistant to senior carer and beyond, for people who want to build a career rather than take a job." },
];

const STEPS = [
  { n: 1, title: "Apply", body: "Fill in the form below. It takes a few minutes and a CV is optional." },
  { n: 2, title: "A chat", body: "We will call you to talk about what you are looking for and answer your questions." },
  { n: 3, title: "Interview and checks", body: "A face-to-face interview, then enhanced DBS, references and right-to-work checks." },
  { n: 4, title: "Induction and first shift", body: "Paid induction training, then shadow shifts before you work on your own." },
];

const CareersPage = () => {
  const vacancies = getVacancies();

  return (
  <>
    <PageHeader
      eyebrow="Join our team"
      title="Care work, done properly"
      intro="We are looking for carers, support workers and nurses who want to do this job well — and to be supported while they do it."
      breadcrumbs={[{ label: "Careers" }]}
      primary={{ label: "Apply now", href: "/careers/apply" }}
      secondary={{ label: `Call ${site.business.phone}`, href: site.business.phone_href }}
    />

    <Section tone="white" size="lg">
      <Container width="narrow" className="text-center">
        <SectionHeading
          eyebrow="No experience? Read this."
          title="You do not need care experience to start"
          subtitle="Plenty of our best carers came from retail, hospitality or caring for their own family. If you are reliable, patient and genuinely interested in people, we will train you in the rest."
        />
      </Container>
    </Section>

    <Section tone="surface" size="lg">
      <SectionHeading
        eyebrow="Why work with us"
        title="What we offer"
        className="mb-12"
      />
      <FeatureGrid items={BENEFITS} columns={3} />

      {/*
        Sponsor licence. Worded to state only the verifiable fact - that the
        licence exists and is A-rated. It deliberately does NOT promise
        sponsorship to any individual, imply a visa will be granted, or suggest
        every role is open to sponsorship. Overstating this would mislead
        candidates making major life decisions.
      */}
      <div className="mx-auto mt-10 max-w-3xl rounded-card border border-primary-200 bg-primary-50 p-6">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-primary-700"
          >
            <BadgeCheck className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-primary-950">
              Licensed UK visa sponsor
            </h3>
            <p className="mt-1.5 leading-relaxed text-textMuted">
              {site.business.legal_name} holds an active, A-rated UK sponsor
              licence. Sponsorship is not available for every role and depends
              on the position, your circumstances and Home Office requirements —
              so please ask us before applying if this matters to you.
            </p>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-3xl text-center text-base leading-relaxed text-textMuted">
        Pay depends on the role, your experience and whether the shifts are
        weekdays, weekends or nights. Tell us which role you are interested in
        and we will give you the rate for it — along with holiday, pension and
        mileage — before you decide whether to apply.
      </p>
    </Section>

    <Section tone="white" size="lg">
      <SectionHeading
        eyebrow="How it works"
        title="From application to first shift"
        className="mb-12"
      />
      <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s) => (
          <li key={s.n}>
            <Card className="h-full p-6">
              <span
                aria-hidden="true"
                className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-800 text-base font-bold text-white"
              >
                {s.n}
              </span>
              <h3 className="text-lg font-bold text-primary-950">
                <span className="sr-only">Step {s.n}: </span>
                {s.title}
              </h3>
              <p className="mt-2 leading-relaxed text-textMuted">{s.body}</p>
            </Card>
          </li>
        ))}
      </ol>
      <p className="mx-auto mt-8 max-w-3xl text-center text-base leading-relaxed text-textMuted">
        All roles are subject to an enhanced DBS check — and we register our
        carers on the DBS update service — along with satisfactory references. We are committed to safer recruitment and to equality of
        opportunity — we welcome applications from everyone, regardless of
        background.
      </p>
    </Section>

    {/* Current vacancies */}
    <Section tone="tint" size="md">
      <Container width="narrow">
        <SectionHeading
          eyebrow="Vacancies"
          title="Current openings"
          subtitle="We recruit continuously across all our roles. If you do not see the right thing, apply anyway — we will keep your details on file."
          className="mb-8"
        />
        {/* Driven by content/vacancies/*.md - see lib/vacancies.js. Adding a
            markdown file publishes a role; no code change, no admin login. */}
        <VacancyList vacancies={vacancies} />

        {/* A plain link so a crawler with no JavaScript reaches the job pages,
            which is what Google for Jobs requires. */}
        <p className="mt-6 text-center text-base text-textMuted">
          <a
            href="/jobs"
            className="font-semibold text-primary-700 underline underline-offset-4"
          >
            See all current vacancies and full job details
          </a>
        </p>
      </Container>
    </Section>

    {/*
      Applying now happens at /careers/apply, which walks people through the two
      Google Forms already in use.

      The on-page ApplicationForm was removed from here rather than left
      alongside it. It emails the application, and no SMTP transport is
      configured, so every submission returned a 503 — a form that visibly fails
      next to a route that works loses applicants who try the broken one first.
      The component is still in the codebase for when the built-in system
      (branch main-kare-plus) has a database and mail credentials.
    */}
    <Section tone="white" size="lg" id="apply">
      <Container width="narrow">
        <div className="rounded-card border border-primary-200 bg-primary-50 p-7 text-center">
          <h2 className="text-2xl font-bold text-primary-950">
            Ready to apply?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-text">
            Two short forms, about ten minutes, and you can do it on your phone.
            You do not need care experience — we train people new to the job.
          </p>
          <a
            href="/careers/apply"
            className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-btn bg-primary-700 px-8 py-4 text-lg font-semibold text-white transition hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
          >
            Start your application
          </a>
          <p className="mt-4 text-base text-textMuted">
            Would rather talk first? Call{" "}
            <a
              href={site.business.phone_href}
              className="font-semibold text-primary-700 underline underline-offset-4"
            >
              {site.business.phone}
            </a>
            .
          </p>
        </div>
      </Container>
    </Section>

    <CtaBand
      title="Questions before you apply?"
      body="Give us a call — we would rather talk it through than have you wonder."
      primary={{ label: `Call ${site.business.phone}`, href: site.business.phone_href }}
      secondary={{ label: "Read our FAQs", href: "/faq" }}
    />
  </>
  );
};

export default CareersPage;
