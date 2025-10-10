"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, Variants, useReducedMotion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  /** How far above the viewport to start, in vh. e.g., 120 means -120vh */
  fromVh?: number;
  /** Entrance duration (seconds) */
  duration?: number;
  /** Entrance delay (seconds) */
  delay?: number;
  /** Subtle per-star scale bloom */
  bloom?: boolean;
};

export default function StarsLayer({
  children,
  fromVh = 80,
  duration = 0.9,
  delay = 0,
  bloom = true,
}: Props) {
  const [mounted, setMounted] = React.useState(false);
  const [root, setRoot] = React.useState<HTMLElement | null>(null);
  const prefersReduced = useReducedMotion();

  React.useEffect(() => {
    setMounted(true);
    setRoot(document.getElementById("rsvp-stars-root") as HTMLElement | null);
  }, []);

  if (!mounted || !root) return null;

  const parentVariants: Variants = prefersReduced
    ? {
        initial: { y: 0, opacity: 1 },
        animate: { y: 0, opacity: 1 },
      }
    : {
        initial: { y: `-${fromVh}vh`, opacity: 0 },
        animate: {
          y: 0,
          opacity: 1,
          transition: { duration, delay, ease: "easeOut" },
        },
      };

  const stars = React.Children.toArray(children).map((child, i) =>
    bloom && !prefersReduced ? (
      <motion.div
        key={i}
        initial={{ scale: 0.985 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut", delay: delay + 0.04 * i }}
      >
        {child}
      </motion.div>
    ) : (
      <div key={i}>{child}</div>
    )
  );

  return createPortal(
    <div className="absolute inset-0 pointer-events-none">
      <motion.div
        className="absolute inset-0 will-change-transform"
        variants={parentVariants}
        initial="initial"
        animate="animate"
      >
        {stars}
      </motion.div>
    </div>,
    root
  );
}