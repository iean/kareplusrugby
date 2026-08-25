"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Count-up number, triggered when it scrolls into view.
 *
 * Two things this does that naive counters get wrong:
 *
 *  1. The final value is rendered in the markup from the start and only
 *     animated once JS confirms it can. If JS never runs, the real number is
 *     still there — a counter that starts at 0 and needs JS to reach its value
 *     shows "0" forever on failure, which on a stats section is worse than no
 *     animation at all.
 *  2. Under prefers-reduced-motion it jumps straight to the value.
 *  3. It groups thousands ONLY if the value it was given was already written
 *     that way. "2022" is a year and must stay "2022"; toLocaleString turned it
 *     into "2,022" on the homepage. If you want grouping, write "1,200".
 *
 * It uses requestAnimationFrame with an eased curve rather than setInterval,
 * so it stays smooth and stops cleanly when the tab is backgrounded.
 */
const StatCounter = ({ value, duration = 1600, className = "" }) => {
  // Split "500+" into 500 and "+" so suffixes survive the animation.
  const match = String(value).match(/^([^\d-]*)([\d.,]+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const numeric = match ? Number(match[2].replace(/,/g, "")) : NaN;
  // Only group thousands if the author wrote it grouped. Years must not be.
  const grouped = match ? match[2].includes(",") : false;
  const suffix = match?.[3] ?? "";
  const animatable = match && Number.isFinite(numeric);

  const ref = useRef(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!animatable) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);

        const start = performance.now();
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1);
          // easeOutExpo - fast then settling, reads as confident rather than laboured
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          const current = numeric * eased;
          const whole = Math.round(current);
          const rounded =
            numeric % 1 === 0
              ? (grouped ? whole.toLocaleString("en-GB") : String(whole))
              : current.toFixed(1);
          setDisplay(`${prefix}${rounded}${suffix}`);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [animatable, numeric, grouped, prefix, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
};

export default StatCounter;
