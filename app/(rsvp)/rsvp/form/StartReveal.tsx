"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";

type Props = { children: React.ReactNode };

export default function StartReveal({ children }: Props) {
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  // Controls the second phase: sliding the whole envelope out
  const envelopeControls = useAnimation();

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

  // After the flap opens, slide the entire envelope down to reveal the letter.
  const handleFlapComplete = async () => {
    if (!started || prefersReduced) return;
    await envelopeControls.start({
      y: "50%", // move off the container
      transition: { duration: 0.6, ease: [0.2, 0.66, 0.2, 1] },
    });
    setDone(true);
  };

  return (
    <div className="relative [isolation:isolate]">
      {/* Letter (your content) stays fixed underneath */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }} // keep fully visible during the reveal
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {children}
      </motion.div>

      {/* Envelope overlay (transparent container with the two envelope pieces inside) */}
      <AnimatePresence>
        {!done && (
          <motion.div
            className="absolute inset-0 z-50 rounded-2xl overflow-visible"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.08 }}
            role="dialog"
            aria-modal
            aria-label="Open invitation"
          >
            {/* 3D stage for the flap; the whole group will slide down on phase 2 */}
            <motion.div
              className="absolute inset-0 will-change-transform"
              initial={{ y: 0 }}
              animate={envelopeControls}
            >
              <div className="absolute inset-0 [perspective:1200px]">
                {/* TOP FLAP (covers top half, then rotates up) */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-1/2 origin-top shadow-2xl z-30 will-change-transform"
                  style={{ backgroundColor: "#943c54", transformStyle: "preserve-3d" }}
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: started && !prefersReduced ? 200 : 0 }}
                  transition={{ duration: 0.66, ease: [0.2, 0.66, 0.2, 1] }}
                  onAnimationComplete={handleFlapComplete}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/10 mix-blend-soft-light" />
                </motion.div>
                {/* Sides */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-1/2 origin-top shadow-2xl will-change-transform"
                  style={{ backgroundColor: "#943c54", transformStyle: "preserve-3d" }}
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: started && !prefersReduced ? 200 : 0 }}
                  transition={{ duration: 0.66, ease: [0.2, 0.66, 0.2, 1] }}
                  onAnimationComplete={handleFlapComplete}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/10 mix-blend-soft-light" />
                </motion.div>

                {/* BOTTOM PANEL (covers bottom half; revealed when the group slides down) */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1/2 z-20 will-change-transform"
                  style={{ backgroundColor: "#943c54" }}
                  initial={{ y: 0 }}
                  animate={{ y: 0 }} // stationary; the group handles the slide
                  transition={{ duration: 0.0 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>
              </div>
            </motion.div>

            {/* Centered Start button */}
            <div className="absolute inset-0 grid place-items-center p-4 pointer-events-none">
              <motion.button
                type="button"
                onClick={start}
                className="rounded-full px-6 py-3 text-lg font-semibold tracking-wide text-white shadow-lg hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 active:scale-[0.98] transition pointer-events-auto"
                style={{ backgroundColor: "#f4a2b5" }}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: started ? 0.95 : 1, opacity: started ? 0 : 1 }}
                transition={{ duration: 0.25 }}
                aria-disabled={started}
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
