"use client";

import { useEffect, useState } from "react";
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
  const { phone, phone_href, mobile, mobile_href, whatsapp_href } =
    site.business;

  /**
   * Out of hours, the landline rings an empty office — which is precisely the
   * moment someone is most likely to be tapping this. So after mount we point
   * "Call" at the on-call mobile instead.
   *
   * Deliberately behind a mounted flag: the server has no idea what time it is
   * where the visitor is, so SSR always emits the office number and the swap
   * happens on the client. Computing this during render instead would produce
   * different HTML on each side and trip a hydration mismatch.
   *
   * Office hours are Monday–Friday, 9am–5pm, matching opening_hours.office and
   * the ContactPoint hours published in app/layout.js.
   */
  const [outOfHours, setOutOfHours] = useState(false);

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Sunday, 6 = Saturday
      const weekday = day >= 1 && day <= 5;
      const inHours = weekday && now.getHours() >= 9 && now.getHours() < 17;
      setOutOfHours(!inHours);
    };
    check();
    // Someone can sit on a page across 5pm; re-check so the button does not
    // go stale on an open tab.
    const t = setInterval(check, 60_000);
    return () => clearInterval(t);
  }, []);

  const callHref = outOfHours ? mobile_href : phone_href;
  const callNumber = outOfHours ? mobile : phone;

  const items = [
    {
      href: callHref,
      icon: Phone,
      label: outOfHours ? "On-call" : "Call",
      sr: outOfHours
        ? `Call our out-of-hours line on ${callNumber}`
        : `Call us on ${callNumber}`,
      className: "bg-primary-700 text-white hover:bg-primary-800",
    },
    {
      href: whatsapp_href,
      icon: MessageCircle,
      label: "WhatsApp",
      sr: `Message us on WhatsApp on ${mobile} (opens in a new tab)`,
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
                  className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-btn px-2 py-2 text-sm font-semibold ring-1 ring-inset ring-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 ${it.className}`}
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
