"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Phone, Menu, X } from "lucide-react";
import config from "@config/config.json";
import site from "@config/site.json";
import Button from "@components/ui/Button";

/**
 * Main site header.
 *
 * The utility bar carries the phone number, because a large share of care
 * enquiries are phone-first - families in a stressful moment want to talk to
 * someone, not fill in a form.
 *
 * Accessibility: the mobile menu traps nothing but does close on Escape and on
 * route change, restores focus to the toggle, and the toggle exposes
 * aria-expanded/aria-controls. Current page is marked with aria-current.
 */
const SiteHeader = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const toggleRef = useRef(null);
  const { logo, title } = config.site;
  const { phone, phone_href } = site.business;
  const nav = site.nav.primary;

  // Close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Condense the header once the user scrolls past the hero fold. The utility
  // bar collapses and the logo shrinks, so the CTA stays reachable without the
  // header eating a third of a small screen.
  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on Escape, and return focus to the button that opened it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (url) =>
    url === "/" ? pathname === "/" : pathname === url || pathname.startsWith(`${url}/`);

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        condensed ? "shadow-[0_2px_12px_rgba(6,36,99,0.10)]" : "shadow-header"
      }`}
    >
      {/* Skip link - first focusable thing on the page */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-btn focus:bg-primary-800 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      {/* Utility bar */}
      <div
        className={`hidden overflow-hidden bg-primary-950 text-white transition-[max-height,opacity] duration-300 md:block ${
          condensed ? "max-h-0 opacity-0" : "max-h-16 opacity-100"
        }`}
        aria-hidden={condensed}
      >
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-2 text-sm lg:px-8">
          <p className="text-primary-100">
            Office {site.business.opening_hours.office} · On-call{" "}
            {site.business.opening_hours.on_call}
          </p>
          <a
            href={phone_href}
            className="flex items-center gap-2 font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950"
          >
            <Phone aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="sr-only">Call us on </span>
            {phone}
          </a>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={`mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 transition-[padding] duration-300 lg:px-8 ${
          condensed ? "py-2" : "py-3"
        }`}
      >
        <Link
          href="/"
          className="flex shrink-0 items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
        >
          <Image
            src={logo}
            alt={`${title} — home`}
            width={640}
            height={239}
            priority
            className={`w-auto object-contain transition-[height] duration-300 ${condensed ? "h-10 sm:h-11" : "h-12 sm:h-14"}`}
          />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {nav.map((item) => (
              <li key={item.url}>
                <Link
                  href={item.url}
                  aria-current={isActive(item.url) ? "page" : undefined}
                  className={`whitespace-nowrap rounded-btn px-2.5 py-2 text-[15px] font-semibold transition-colors xl:px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 ${
                    isActive(item.url)
                      ? "bg-primary-50 text-primary-800"
                      : "text-primary-950 hover:bg-primary-50 hover:text-primary-800"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button href="/careers" variant="secondary" size="sm" className="whitespace-nowrap">
            Join our team
          </Button>
          <Button href="/contact" size="sm" className="whitespace-nowrap">
            Enquire now
          </Button>
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="rounded-btn p-2 text-2xl text-primary-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 lg:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? <X aria-hidden="true" className="h-7 w-7" /> : <Menu aria-hidden="true" className="h-7 w-7" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-border bg-white lg:hidden"
      >
        <nav aria-label="Mobile" className="mx-auto max-w-[1200px] px-5 py-4">
          <ul className="flex flex-col gap-1">
            {nav.map((item) => (
              <li key={item.url}>
                <Link
                  href={item.url}
                  aria-current={isActive(item.url) ? "page" : undefined}
                  className={`block rounded-btn px-3 py-3 text-base font-semibold ${
                    isActive(item.url)
                      ? "bg-primary-50 text-primary-800"
                      : "text-primary-950 hover:bg-primary-50"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            <Button href="/careers" variant="secondary">
              Join our team
            </Button>
            <Button href="/contact">Enquire now</Button>
            <a
              href={phone_href}
              className="mt-2 flex items-center justify-center gap-2 py-2 text-base font-semibold text-primary-800"
            >
              <Phone aria-hidden="true" className="h-4 w-4" />
              {phone}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
