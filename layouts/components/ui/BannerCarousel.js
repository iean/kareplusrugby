"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Keyboard, A11y } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

/**
 * The banner carousel shared by the domiciliary and staffing sections.
 *
 * Replaces three near-identical copies (layouts/domiciliary/Banner.js,
 * layouts/staffing/Banner.js, layouts/partials/HomeBanner.js), each of which
 * had the same four problems:
 *
 *  1. AUTOPLAY WITH NO PAUSE. Every one advanced itself every 4 seconds with
 *     no way to stop it. That fails WCAG 2.2.2 outright, and four seconds is
 *     nowhere near long enough for the readers this site is actually for.
 *     There is no autoplay here at all. The carousel moves when the reader
 *     moves it.
 *  2. `loop`, which makes Swiper clone slides into the DOM. Those clones are
 *     why /staffing rendered five <h1> elements from three slides, with two of
 *     the headings appearing twice — the duplicated-slides fault the work plan
 *     reported on the homepage, still live on the section pages.
 *  3. An <h1> per slide. A page gets one <h1>; slide titles are <h2>.
 *  4. A hardcoded hex gradient (#12469B, #1D5BC0, #847432) painted onto
 *     transparent text, against a dark blue background. Hardcoding hexes is
 *     against the house rules, and gradient-on-transparent text has no
 *     dependable contrast ratio. Plain white on the dark panel instead.
 *
 * Keyboard: arrow keys move between slides, the prev/next buttons are real
 * <button>s in the tab order, and Swiper's A11y module labels the region and
 * announces slide changes.
 */
const BannerCarousel = ({ items, ariaLabel }) => (
  <div className="relative">
    <Swiper
      modules={[Pagination, Navigation, Keyboard, A11y]}
      // No autoplay. See the note above - this is deliberate, not an omission.
      keyboard={{ enabled: true }}
      pagination={{ clickable: true }}
      navigation={{ prevEl: ".banner-prev", nextEl: ".banner-next" }}
      a11y={{
        enabled: true,
        containerMessage: ariaLabel,
        prevSlideMessage: "Previous slide",
        nextSlideMessage: "Next slide",
        paginationBulletMessage: "Go to slide {{index}}",
      }}
      spaceBetween={24}
    >
      {items.map((item) => (
        <SwiperSlide key={item.title} className="py-4 text-white">
          <h2 className="mb-4 text-4xl font-extrabold text-white md:text-5xl">
            {item.title}
          </h2>
          <p className="mb-6 max-w-xl text-lg leading-relaxed text-white/90">
            {item.text}
          </p>
          {item.buttonText && item.buttonLink && (
            <a
              href={item.buttonLink}
              className="inline-flex min-h-[44px] items-center rounded-full border-2 border-white px-6 py-3 text-lg font-semibold text-white shadow transition hover:bg-white hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
            >
              {item.buttonText}
            </a>
          )}
        </SwiperSlide>
      ))}
    </Swiper>

    {/* Real buttons, in the tab order, 44px minimum. */}
    <div className="mt-4 flex gap-3">
      <button
        type="button"
        className="banner-prev inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/70 text-white transition hover:bg-white hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
      >
        <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        <span className="sr-only">Previous slide</span>
      </button>
      <button
        type="button"
        className="banner-next inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/70 text-white transition hover:bg-white hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
      >
        <ChevronRight aria-hidden="true" className="h-5 w-5" />
        <span className="sr-only">Next slide</span>
      </button>
    </div>
  </div>
);

export default BannerCarousel;
