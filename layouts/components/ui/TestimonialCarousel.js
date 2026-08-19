"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote, Pause, Play } from "lucide-react";

/**
 * Testimonial carousel.
 *
 * ⚠ The CONTENT passed in is placeholder — see Testimonials.js. This component
 * is the polished shell; the words must be replaced with real, consented
 * quotes before launch.
 *
 * Accessibility, which is where most carousels fail:
 *  - Auto-play pauses on hover, on keyboard focus, and when the tab is hidden,
 *    and there is an explicit pause/play control. WCAG 2.2.2 requires any
 *    auto-updating content lasting more than 5s to be pausable.
 *  - Auto-play does not start at all under prefers-reduced-motion.
 *  - The track is a labelled group with aria-roledescription="carousel";
 *    slides are announced as "N of M".
 *  - Dots are real buttons with aria-current, not divs.
 *  - Left/right arrow keys move between slides when the carousel has focus.
 *  - Off-screen slides get inert-style hiding so a screen reader does not read
 *    all of them at once.
 */

const AUTOPLAY_MS = 7000;

const TestimonialCarousel = ({ items }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [canAuto, setCanAuto] = useState(false);
  const regionRef = useRef(null);
  const count = items.length;

  const go = useCallback((next) => setIndex(((next % count) + count) % count), [count]);

  // Only ever auto-play if the user has not asked for reduced motion.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setCanAuto(!mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // Pause when the tab is not visible - background animation is wasted work.
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (!canAuto || paused || count < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [canAuto, paused, count]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    }
  };

  return (
    <div
      ref={regionRef}
      role="group"
      aria-roledescription="carousel"
      aria-label="What people say about us"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!regionRef.current?.contains(e.relatedTarget)) setPaused(false);
      }}
      onKeyDown={onKeyDown}
      className="relative"
    >
      {/* Track */}
      <div className="overflow-hidden rounded-card">
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((t, i) => (
            <div
              key={t.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== index}
              // Keeps off-screen slides out of the tab order and out of the
              // accessibility tree without unmounting them.
              {...(i !== index ? { inert: "" } : {})}
              className="w-full shrink-0 px-1"
            >
              <figure className="flex h-full flex-col rounded-card border-2 border-dashed border-amber-500 bg-amber-50 p-6 md:p-8">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <Quote aria-hidden="true" className="h-8 w-8 text-amber-500" />
                  <div className="flex items-center gap-0.5" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="mb-3 inline-flex w-fit rounded bg-amber-200 px-2 py-1 text-xs font-bold uppercase tracking-wide text-amber-900">
                  Placeholder — not a real quote
                </p>

                <blockquote className="flex-1 text-[17px] leading-relaxed text-amber-950">
                  {t.quote}
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-3 border-t border-amber-300 pt-5">
                  {/* Initials avatar - no invented photos of real-looking people */}
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-200 text-sm font-bold text-amber-900"
                  >
                    ?
                  </span>
                  <span className="text-sm text-amber-900">
                    <span className="block font-semibold">{t.name}</span>
                    <span className="block">{t.context}</span>
                  </span>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-5 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous testimonial"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-primary-800 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
        >
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          {items.map((t, i) => (
            <button
              key={t.id}
              type="button"
              aria-label={`Show testimonial ${i + 1} of ${count}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => go(i)}
              // The visible dot is small, but the button itself is 24x24 so it
              // meets the WCAG 2.2 minimum target size.
              className="group flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
            >
              <span
                aria-hidden="true"
                className={`block h-2.5 rounded-full transition-all ${
                  i === index
                    ? "w-6 bg-primary-700"
                    : "w-2.5 bg-primary-200 group-hover:bg-primary-400"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next testimonial"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-primary-800 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
        >
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>

        {canAuto && count > 1 && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Resume automatic rotation" : "Pause automatic rotation"}
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-primary-800 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
          >
            {paused ? (
              <Play aria-hidden="true" className="h-4 w-4" />
            ) : (
              <Pause aria-hidden="true" className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Announce slide changes without moving focus */}
      <p aria-live="polite" className="sr-only">
        Testimonial {index + 1} of {count}
      </p>
    </div>
  );
};

export default TestimonialCarousel;
