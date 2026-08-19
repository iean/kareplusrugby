"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fade/slide content in as it scrolls into view.
 *
 * Deliberately conservative:
 *  - content starts visible in markup and is only hidden once we know JS ran
 *    and motion is allowed, so nothing is ever permanently invisible if JS
 *    fails. An animation library that hides content first is a real
 *    accessibility risk on a care site.
 *  - honours prefers-reduced-motion by skipping the animation entirely.
 *  - unobserves after firing; no ongoing scroll listener.
 */
const Reveal = ({ children, delay = 0, className = "", as: As = "div" }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(true);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") return;

    const el = ref.current;
    if (!el) return;

    setShown(false);
    setArmed(true);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.unobserve(entry.target);
        }
      },
      // threshold 0 (not a fraction): an element taller than the viewport
      // can never reach a high intersection ratio, so a fractional threshold
      // would leave it permanently hidden.
      { threshold: 0, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <As
      ref={ref}
      style={armed ? { transitionDelay: `${delay}ms` } : undefined}
      className={`${
        armed
          ? "transition-[opacity,transform] duration-500 ease-out will-change-[opacity,transform]"
          : ""
      } ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} ${className}`}
    >
      {children}
    </As>
  );
};

export default Reveal;
