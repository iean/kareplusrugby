import Link from "next/link";
import Section, { Container } from "@components/ui/Section";
import SectionHeading from "@components/ui/SectionHeading";
import site from "@config/site.json";
import { MessageSquare, FileText, Wallet } from "lucide-react";

/**
 * "What does it cost?"
 *
 * Added after reading the homepage as a daughter arranging urgent care for her
 * mother (work plan, Phase 6 pass 5). Cost is the question she has, and the
 * homepage only touched it in passing inside step 3 of How It Works. Leaving
 * the most anxious question unanswered until the FAQ pushes people away.
 *
 * NO FIGURE APPEARS HERE, and none should be added without Alif confirming a
 * real, current, agreed one. Everything stated is already established
 * elsewhere on the site:
 *   - no charge for the first conversation or assessment -> the enquiry form
 *   - the price is written into the care plan before anything starts -> the
 *     "Agree a care plan" step in HowItWorks
 *   - rates depend on the support needed and are quoted on enquiry -> the FAQ
 * The funding routes are the same four the enquiry form asks about.
 *
 * TODO: Alif to decide whether to publish an indicative hourly range. Most
 * families compare providers on price, and a page that will not say anything
 * at all loses some of them — but a wrong or stale figure is worse than none.
 */
const POINTS = [
  {
    icon: MessageSquare,
    title: "The first conversation is free",
    body: "There is no charge and no obligation for an initial conversation or a home assessment. You are not committing to anything by asking.",
  },
  {
    icon: FileText,
    title: "You see the figure before anything starts",
    body: "The cost is written into your care plan — what happens at each visit, who provides it, and what it costs. Nothing begins until you are happy with it.",
  },
  {
    icon: Wallet,
    title: "There may be help with funding",
    body: "Care can be paid for privately, by the local authority, by the NHS, or through a direct payment. We will ask which applies when you get in touch.",
  },
];

const WhatItCosts = () => (
  <Section tone="surface" size="lg">
    <Container width="narrow">
      <SectionHeading
        eyebrow="Cost"
        title="What does care cost?"
        subtitle="Honestly: it depends on how much support you need and when you need it, so we quote it after we have talked rather than publishing one figure that would fit nobody."
        className="mb-10"
      />

      <ul className="space-y-5">
        {POINTS.map((p) => {
          const Icon = p.icon;
          return (
            <li key={p.title} className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700"
              >
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-primary-950">{p.title}</h3>
                <p className="mt-1.5 text-base leading-relaxed text-textMuted">
                  {p.body}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 text-base leading-relaxed text-textMuted">
        Would rather just ask? Call us on{" "}
        <a
          href={site.business.phone_href}
          className="font-semibold text-primary-700 underline underline-offset-4"
        >
          {site.business.phone}
        </a>{" "}
        and we will tell you what your situation is likely to cost. You can also
        read{" "}
        <Link
          href="/faq"
          className="font-semibold text-primary-700 underline underline-offset-4"
        >
          our frequently asked questions
        </Link>
        .
      </p>
    </Container>
  </Section>
);

export default WhatItCosts;
