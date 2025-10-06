"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = { children: React.ReactNode };

export default function StartReveal({ children }: Props) {
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReduced(mql.matches);
    onChange();
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  const start = () => {
    if (prefersReduced) {
      setStarted(true);
      setDone(true);
      return;
    }
    setStarted(true);
  };

  return (
    // Create a stacking context so the overlay stays within this box only
    <div className="relative [isolation:isolate]">
      {/* Dim/undim the content while the cover is present */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: done || prefersReduced ? 1 : 0.25 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        aria-hidden={!done && !prefersReduced}
      >
        {children}
      </motion.div>

      {/* Container-scoped overlay */}
      <AnimatePresence>
        {!done && (
          <motion.div
            className="absolute inset-0 z-50 rounded-2xl overflow-hidden shadow-xl"
            style={{ backgroundColor: "#943c54" }} // themed backdrop
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
            role="dialog"
            aria-modal
            aria-label="Open invitation"
          >
            {/* 3D stage clipped to this container */}
            <div className="absolute inset-0 [perspective:1200px]">
              {/* Top flap folds away */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1/2 origin-top shadow-2xl"
                style={{ backgroundColor: "#943c54" }}
                initial={{ rotateX: 0 }}
                animate={{ rotateX: started ? -110 : 0 }}
                transition={{ duration: 0.66, ease: [0.2, 0.66, 0.2, 1] }}
                onAnimationComplete={() => {
                  if (started) setDone(true);
                }}
              >
                {/* Subtle sheen */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/10 mix-blend-soft-light" />
              </motion.div>

              {/* Bottom panel with a light parallax nudge */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1/2"
                style={{ backgroundColor: "#943c54" }}
                initial={{ y: 0 }}
                animate={{ y: started ? 10 : 0 }}
                transition={{ duration: 0.66, ease: [0.2, 0.66, 0.2, 1] }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </motion.div>
            </div>

            {/* Centered Start button (gold star later) */}
            <div className="absolute inset-0 grid place-items-center p-4">
              <motion.button
                type="button"
                onClick={start}
                className="rounded-full px-6 py-3 text-lg font-semibold tracking-wide text-white shadow-lg hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 active:scale-[0.98] transition"
                style={{ backgroundColor: "#f4a2b5" }}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: started ? 0.95 : 1, opacity: started ? 0 : 1 }}
                transition={{ duration: 0.25 }}
              >
                Click Me :)
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}