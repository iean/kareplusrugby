"use client";

import { useState, useId } from "react";
import Section from "@components/ui/Section";
import SectionHeading from "@components/ui/SectionHeading";
import Button from "@components/ui/Button";
import StepTimeline from "@components/ui/StepTimeline";
import {
  PhoneCall, ClipboardList, FileCheck2, HeartHandshake,
  Send, Users, UserCheck, ReceiptText,
} from "lucide-react";

/**
 * How it works, split by audience.
 *
 * The two journeys are genuinely different - a family arranging care needs an
 * assessment and a care plan, a care home manager needs a shift filled today.
 * Showing both in one list made neither clear, so they are tabbed.
 *
 * Implemented as a proper ARIA tablist with arrow-key navigation, since the
 * default div-with-onClick pattern is unusable by keyboard.
 */
const JOURNEYS = {
  care: {
    label: "Arranging care at home",
    steps: [
      {
        icon: PhoneCall,
        title: "Talk to us",
        body: "Call or send an enquiry. We will ask about the person needing support, what a typical day looks like, and what would help most.",
      },
      {
        icon: ClipboardList,
        title: "Free home assessment",
        body: "A coordinator visits at a time that suits you to understand needs, routines, risks and preferences — with family involved if you want them there.",
      },
      {
        icon: FileCheck2,
        title: "Agree a care plan",
        body: "We write a plan setting out exactly what will happen at each visit, who will provide it, and what it costs. Nothing starts until you are happy with it.",
      },
      {
        icon: HeartHandshake,
        title: "Care begins, and keeps adapting",
        body: "Your named coordinator stays in touch, and the plan is reviewed as things change. You can adjust or stop support at any point.",
      },
    ],
    cta: { label: "Arrange a home assessment", href: "/domiciliary-care#enquiry" },
  },
  staffing: {
    label: "Booking staff for a care home",
    steps: [
      {
        icon: Send,
        title: "Tell us what you need",
        body: "Send us the roles, dates and shift pattern — whether that is a planned block booking or cover for tonight.",
      },
      {
        icon: Users,
        title: "We match from our team",
        body: "We fill the shift with staff whose checks, training and experience suit your home, and confirm who is coming.",
      },
      {
        icon: UserCheck,
        title: "Staff arrive ready to work",
        body: "Workers arrive with ID and are briefed on your home's expectations. We ask for your feedback so we can send people who fit.",
      },
      {
        icon: ReceiptText,
        title: "Simple, transparent billing",
        body: "Timesheets are confirmed against the shifts worked and invoiced on agreed terms, with no hidden charges.",
      },
    ],
    cta: { label: "Request staff", href: "/care-home-staffing#request" },
  },
};

const HowItWorks = () => {
  const [active, setActive] = useState("care");
  const base = useId();
  const keys = Object.keys(JOURNEYS);

  const onKeyDown = (e) => {
    const i = keys.indexOf(active);
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const next = e.key === "ArrowRight" ? (i + 1) % keys.length : (i - 1 + keys.length) % keys.length;
      setActive(keys[next]);
      document.getElementById(`${base}-tab-${keys[next]}`)?.focus();
    }
  };

  const journey = JOURNEYS[active];

  return (
    <Section tone="tint" size="lg">
      <SectionHeading
        eyebrow="How it works"
        title="Simple steps, no jargon"
        subtitle="Two different journeys, depending on why you are here."
        className="mb-10"
      />

      <div
        role="tablist"
        aria-label="How it works"
        onKeyDown={onKeyDown}
        className="mx-auto mb-10 flex max-w-xl flex-col gap-2 rounded-btn bg-white p-1.5 shadow-card sm:flex-row"
      >
        {keys.map((k) => (
          <button
            key={k}
            id={`${base}-tab-${k}`}
            role="tab"
            type="button"
            aria-selected={active === k}
            aria-controls={`${base}-panel-${k}`}
            tabIndex={active === k ? 0 : -1}
            onClick={() => setActive(k)}
            className={`flex-1 rounded-btn px-5 py-3 text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 ${
              active === k
                ? "bg-primary-700 text-white"
                : "text-primary-900 hover:bg-primary-50"
            }`}
          >
            {JOURNEYS[k].label}
          </button>
        ))}
      </div>

      {keys.map((k) => (
        <div
          key={k}
          id={`${base}-panel-${k}`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${k}`}
          hidden={active !== k}
        >
          <StepTimeline steps={JOURNEYS[k].steps} />
        </div>
      ))}

      <div className="mt-10 text-center">
        <Button href={journey.cta.href} size="lg">
          {journey.cta.label}
        </Button>
      </div>
    </Section>
  );
};

export default HowItWorks;
