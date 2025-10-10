"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { Higuen } from '@/app/ui/fonts';

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

  const ENVELOPE_COLOR = "#943c54";

  return (
    <div className="relative [isolation:isolate]">
      {/* Envelope BACK (sits behind the letter to hide page background) */}
      {!done && (
        <motion.div
          aria-hidden
          className="absolute inset-0 z-0 rounded-2xl shadow-inner overflow-hidden will-change-transform"
          initial={{ y: 0, opacity: 1 }}
          animate={envelopeControls}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.66, 0.2, 1] }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: ENVELOPE_COLOR }} />
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent pointer-events-none" />
        </motion.div>
      )}
      {/* Letter (your content) stays fixed underneath */}
      <motion.div
        className="relative z-10 rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }} // keep fully visible during the reveal
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {children}
      </motion.div>

      {/* Envelope overlay (transparent container with the envelope parts inside) */}
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
                {/* SIDE RAILS (vertical bars to give a complete envelope silhouette) */}
                <div className="absolute inset-y-0 left-0 w-2.5 z-20 rounded-l-2xl shadow-xl overflow-hidden"
                  style={{ backgroundColor: ENVELOPE_COLOR }}
                >
                  {/* subtle lighting */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-black/20 mix-blend-soft-light" />
                </div>
                <div className="absolute inset-y-0 right-0 w-2.5 z-20 rounded-r-2xl shadow-xl overflow-hidden"
                  style={{ backgroundColor: ENVELOPE_COLOR }}
                >
                  <div className="absolute inset-0 bg-gradient-to-l from-white/10 to-black/20 mix-blend-soft-light" />
                </div>

                {/* TOP FLAP (covers top half, then rotates up) */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-1/2 origin-top shadow-2xl z-30 will-change-transform rounded-t-2xl"
                  style={{ backgroundColor: ENVELOPE_COLOR, transformStyle: "preserve-3d" }}
                  initial={{ rotateX: 0 }}
                  animate={{
                  rotateX: started && !prefersReduced ? [0, 270] : 0,
                  opacity: started && !prefersReduced ? [1, 1, 0] : 1
                }}
                  transition={{
                  rotateX: { duration: 0.66, ease: [0.2, 0.66, 0.2, 1] },
                  opacity: { duration: 0.66, ease: [0.2, 0.66, 0.2, 1], times: [0, 0.9, 1] }
                }}
                  onAnimationComplete={handleFlapComplete}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/10 mix-blend-soft-light" />
                  {/* top edge shine */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-white/30" />
                </motion.div>

                {/* BOTTOM PANEL (covers bottom half; revealed when the group slides down) */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1/2 z-10 will-change-transform rounded-b-2xl shadow-lg"
                  style={{ backgroundColor: ENVELOPE_COLOR }}
                  initial={{ y: 0 }}
                  animate={{ y: 0 }} // stationary; the group handles the slide
                  transition={{ duration: 0.0 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>

                {/* CENTER SLIT (optional: faint divider between flap and body for realism) */}
                <div className="absolute top-1/2 left-2.5 right-2.5 h-px z-20 bg-black/20" />
              </div>
            </motion.div>

            {/* Centered Start button */}
            <div className="absolute inset-0 grid place-items-center p-4 pointer-events-none">
              <motion.button
                type="button"
                onClick={start}
                className={`rounded-full px-6 py-3 text-lg ${Higuen.className} tracking-wide text-white shadow-lg hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 active:scale-[0.98] transition pointer-events-auto`}
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