"use client";

import { Phone, MessageCircle, Mail } from "lucide-react";
import site from "@config/site.json";

/**
 * Floating contact cluster, mobile only.
 *
 * Care enquiries are overwhelmingly phone-first — someone arranging urgent
 * support for a relative wants to talk to a person, not fill in a form. This
 * keeps calling one thumb-tap away from anywhere on the site.
 *
 * Details that matter:
 *  - `pb-[env(safe-area-inset-bottom)]` keeps it clear of the iPhone home bar.
 *  - Hidden from print and from lg+ where the sticky header CTA takes over.
 *  - Each target is ≥48px tall for touch, and labelled for screen readers.
 *  - The page gets bottom padding via a spacer so the bar never covers the
 *    last of the footer content.
 */
const StickyContactBar = () => {
  const { phone, phone_href, whatsapp_href } = site.business;

  const items = [
    {
      href: phone_href,
      icon: Phone,
      label: "Call",
      sr: `Call us on ${phone}`,
      className: "bg-primary-700 text-white hover:bg-primary-800",
    },
    {
      href: whatsapp_href,
      icon: MessageCircle,
      label: "WhatsApp",
      sr: "Message us on WhatsApp (opens in a new tab)",
      external: true,
      // WhatsApp brand green is 4.14:1 on white, which fails AA for the small
      // label. Darkened to #118578 (4.52:1) - still unmistakably WhatsApp.
      className: "bg-[#118578] text-white hover:bg-[#0d6b60]",
    },
    {
      href: "/contact",
      icon: Mail,
      label: "Enquire",
      sr: "Send us an enquiry",
      className: "bg-white text-primary-800 hover:bg-primary-50",
    },
  ];

  return (
    <>
      {/* Spacer so fixed bar never sits over real content */}
      <div aria-hidden="true" className="h-[76px] lg:hidden print:hidden" />

      <nav
        aria-label="Quick contact"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 shadow-[0_-2px_16px_rgba(6,36,99,0.10)] backdrop-blur-sm lg:hidden print:hidden"
      >
        <ul className="mx-auto flex max-w-lg items-stretch gap-2 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {items.map((it) => {
            const Icon = it.icon;
            const props = it.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {};
            return (
              <li key={it.label} className="flex-1">
                <a
                  href={it.href}
                  {...props}
                  className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-btn px-2 py-2 text-xs font-semibold ring-1 ring-inset ring-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 ${it.className}`}
                >
                  <Icon aria-hidden="true" className="h-5 w-5" />
                  <span aria-hidden="true">{it.label}</span>
                  <span className="sr-only">{it.sr}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default StickyContactBar;
