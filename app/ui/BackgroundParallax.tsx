"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/** Simple media-query hook */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange(); // set initial
    // Safari <14 fallback
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, [query]);

  return matches;
}

export default function BackgroundParallax() {
  const factor = 0.08;      // parallax strength
  const scale  = 1.2;       // image overscan
  const baseOffset = 150;   // desired upward offset (px)

  const [y, setY] = useState(0);
  const [limit, setLimit] = useState(0);

  // Choose image based on width
  const isNarrow = useMediaQuery("(max-width: 800px)");
  const src = isNarrow ? "/engagement.jpg" : "/wide-angle.jpg";
  //const src = isNarrow ? "/wide-angle.jpg" : "/wide-angle.jpg";

  // Recompute the max allowable translate when the viewport changes
  useEffect(() => {
    const recompute = () => {
      const vh = window.innerHeight;

      // With origin-top and scale, the extra vertical pixels available to scroll into view:
      const maxShift = vh * (scale - 1);

      // We want a constant -baseOffset shift. To avoid exposing gaps at the bottom,
      // clamp the *scrollable* portion so baseOffset + y never exceeds maxShift.
      const scrollable = Math.max(0, maxShift - baseOffset);
      setLimit(scrollable);
    };
    recompute();
    window.addEventListener("resize", recompute);
    window.addEventListener("orientationchange", recompute);
    return () => {
      window.removeEventListener("resize", recompute);
      window.removeEventListener("orientationchange", recompute);
    };
  }, [scale]);

  // Parallax with clamping
  useEffect(() => {
    const onScroll = () => {
      const target = Math.max(0, window.scrollY * factor); // no negative on iOS bounce
      setY(Math.min(target, limit));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [limit]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <Image
        src={src}
        alt=""
        fill
        priority
        sizes="100vw"
        quality={85}
        className="object-cover will-change-transform origin-top"
        // Apply the constant -200px baseline offset *plus* the parallax shift.
        style={{ transform: `translateY(${-baseOffset - y}px) scale(${scale})` }}
        aria-hidden
      />
      {/* Optional overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/10 to-black/25" />
    </div>
  );
}