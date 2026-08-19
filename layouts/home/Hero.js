import Image from "next/image";
import Button from "@components/ui/Button";
import { Container } from "@components/ui/Section";
import site from "@config/site.json";
import { Phone, ShieldCheck, BadgeCheck, Clock, ArrowRight } from "lucide-react";

/**
 * Homepage hero.
 *
 * States what the business does in one sentence, then splits the two
 * commercial audiences immediately — families arranging care, and care homes
 * needing staff.
 *
 * Motion notes:
 *  - The headline entrance is a pure CSS animation defined in
 *    styles/animations.scss, so it runs before hydration and never leaves
 *    content invisible if JS fails.
 *  - The gradient drifts very slowly (18s). Anything faster reads as a
 *    distraction on a healthcare site.
 *  - Both are disabled under prefers-reduced-motion.
 *
 * No carousel: the previous hero auto-rotated between services, so a care
 * home manager could land on a home-care slide and assume the site was not
 * for them. Auto-rotation also fails WCAG 2.2.2 without a pause control.
 */

const TRUST = [
  { icon: ShieldCheck, label: "Fully insured" },
  { icon: BadgeCheck, label: "Vetted, DBS-checked staff" },
  { icon: Clock, label: "24/7 on-call support" },
];

const Hero = () => (
  <section className="relative isolate overflow-hidden bg-primary-950 text-white">
    {/* Background photo, deliberately low-contrast behind the text */}
    <div className="absolute inset-0 -z-10">
      <Image
        src="/images/home/banner_02.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        quality={45}
        className="object-cover object-center opacity-[0.18]"
      />
      {/* Slow-drifting blue wash */}
      <div aria-hidden="true" className="hero-gradient absolute inset-0" />
      {/* Soft dot pattern - texture without noise */}
      <div aria-hidden="true" className="hero-dots absolute inset-0" />
      {/* Keeps text contrast solid regardless of what the gradient is doing */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/85 to-transparent"
      />
    </div>

    <Container className="relative py-16 md:py-24 lg:py-28">
      <div className="max-w-3xl">
        <p className="hero-rise hero-rise-1 mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-primary-100 ring-1 ring-inset ring-white/20">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-300 opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-200" />
          </span>
          Home care &amp; care home staffing in Rugby
        </p>

        <h1 className="hero-rise hero-rise-2 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]">
          Care at home, and the carers care homes rely on.
        </h1>

        <p className="hero-rise hero-rise-3 mt-6 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
          {site.business.trading_name} supports people to live well in their own
          homes, and supplies vetted nurses and care staff to care homes that
          need cover they can trust.
        </p>

        <div className="hero-rise hero-rise-4 mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button href="/domiciliary-care" variant="onDark" size="lg" className="group">
            Arrange care at home
            <ArrowRight
              aria-hidden="true"
              className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
            />
          </Button>
          <Button href="/care-home-staffing" variant="onDarkOutline" size="lg">
            Request staff for my home
          </Button>
        </div>

        {/* Trust badges - generic, verifiable claims only. No numbers. */}
        <ul className="hero-rise hero-rise-5 mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-6">
          {TRUST.map((t) => {
            const Icon = t.icon;
            return (
              <li
                key={t.label}
                className="flex items-center gap-2 text-[15px] font-medium text-white/85"
              >
                <Icon aria-hidden="true" className="h-[18px] w-[18px] text-primary-200" />
                {t.label}
              </li>
            );
          })}
        </ul>

        <p className="hero-rise hero-rise-5 mt-7 text-white/80">
          Prefer to talk?{" "}
          <a
            href={site.business.phone_href}
            className="inline-flex items-center gap-2 font-semibold text-white underline underline-offset-4 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950"
          >
            <Phone aria-hidden="true" className="h-4 w-4" />
            {site.business.phone}
          </a>{" "}
          — on-call {site.business.opening_hours.on_call.toLowerCase()}.
        </p>
      </div>
    </Container>

    {/* Wave into the next section */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="h-[40px] w-full md:h-[64px]">
        <path d="M0,48 C240,84 480,10 720,32 C960,54 1200,88 1440,56 L1440,80 L0,80 Z" fill="#ffffff" />
      </svg>
    </div>
  </section>
);

export default Hero;
