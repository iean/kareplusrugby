"use client";

import { useId, useState } from "react";
import EnquiryForm from "./EnquiryForm";

/**
 * Tab switcher between a general enquiry and a professional referral, which
 * the brief asks to keep separate. They collect different information and go
 * to different people, so mixing them into one form would mean asking every
 * visitor questions that only apply to a minority.
 *
 * Proper ARIA tablist with arrow-key support - the same pattern as
 * HowItWorks on the homepage.
 */
const TABS = [
  { id: "general", label: "General enquiry" },
  { id: "referral", label: "Professional referral" },
];

const ContactTabs = () => {
  const [active, setActive] = useState("general");
  const base = useId();

  const onKeyDown = (e) => {
    const i = TABS.findIndex((t) => t.id === active);
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next =
      e.key === "ArrowRight"
        ? (i + 1) % TABS.length
        : (i - 1 + TABS.length) % TABS.length;
    setActive(TABS[next].id);
    document.getElementById(`${base}-tab-${TABS[next].id}`)?.focus();
  };

  return (
    <div className="rounded-card border border-border bg-white p-6 shadow-card md:p-8">
      <div
        role="tablist"
        aria-label="Enquiry type"
        onKeyDown={onKeyDown}
        className="mb-8 flex flex-col gap-2 rounded-btn bg-surface p-1.5 sm:flex-row"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`${base}-tab-${t.id}`}
            role="tab"
            type="button"
            aria-selected={active === t.id}
            aria-controls={`${base}-panel-${t.id}`}
            tabIndex={active === t.id ? 0 : -1}
            onClick={() => setActive(t.id)}
            className={`flex-1 rounded-btn px-5 py-3 text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 ${
              active === t.id
                ? "bg-primary-700 text-white"
                : "text-primary-900 hover:bg-primary-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {TABS.map((t) => (
        <div
          key={t.id}
          id={`${base}-panel-${t.id}`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${t.id}`}
          hidden={active !== t.id}
        >
          {/* Unique ids per panel so the two forms never collide in the DOM */}
          <EnquiryForm variant={t.id} id={`contact-${t.id}`} />
        </div>
      ))}
    </div>
  );
};

export default ContactTabs;
