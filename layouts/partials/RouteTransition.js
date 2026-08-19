"use client";

import { usePathname } from "next/navigation";

/**
 * Route transition.
 *
 * Keying a wrapper on the pathname makes React remount it on navigation, which
 * restarts the CSS animation. That is all it takes — no animation library, no
 * extra JS on the critical path.
 *
 * Fade plus a 6px rise only. Sliding whole pages sideways is disorientating
 * for older visitors, and the animation is disabled entirely under
 * prefers-reduced-motion (see styles/animations.scss).
 */
const RouteTransition = ({ children }) => {
  const pathname = usePathname();
  return (
    <div key={pathname} className="route-fade">
      {children}
    </div>
  );
};

export default RouteTransition;
