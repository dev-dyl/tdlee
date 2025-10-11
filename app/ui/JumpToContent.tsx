"use client";

import { useEffect, useState } from "react";

type Props = {
  targetId: string;           // e.g., "content"
  threshold?: number;         // how much of the section must be visible (0-1)
  rootMargin?: string;        // expand/shrink viewport for intersection
};

export default function JumpToContent({
  targetId,
  threshold = 0.2,
  rootMargin = "2000% 0px 8% 0px",
}: Props) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Hide the button when the target section is in view
        setHidden(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [targetId, threshold, rootMargin]);

  return (
    <a
      href={`#${targetId}`}
      aria-label="Jump to content"
      aria-hidden={hidden}
      className={`
        group fixed left-1/2 bottom-[max(1.5rem,env(safe-area-inset-bottom))] -translate-x-1/2 z-20
        h-20 w-20 grid place-items-center rounded-full border border-white/60
        bg-white/60 backdrop-blur shadow-xl ring-1 ring-black/5
        transition duration-300 ease-out
        hover:bg-white hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-wedding-plum
        ${hidden ? "opacity-0 pointer-events-none translate-y-1" : "opacity-95"}
      `}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-12 w-12 text-gray-900/90 transition-transform duration-200 group-hover:translate-y-0.5"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M12 16.5a1 1 0 0 1-.7-.29l-5-5a1 1 0 1 1 1.4-1.42L12 13.59l4.3-4.3a1 1 0 1 1 1.4 1.42l-5 5a1 1 0 0 1-.7.29Z"
        />
      </svg>
    </a>
  );
}
