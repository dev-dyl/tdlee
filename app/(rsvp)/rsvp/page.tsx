// app/(rsvp)/rsvp/page.tsx
"use client";
export const dynamic = "force-static";

import { motion, Variants } from "framer-motion";
import StartReveal from "./form/StartReveal";
import RsvpFlow from "./form/RsvpFlow";
import StarsLayer from "./_bg/StarsLayer";
import StarAt, { StarAtProps } from "./_bg/StarAt";


const StarList: StarAtProps[] = [
  { x: 5, y: 18, size: 90, className: "text-wedding-green" },
  { x: 20, y: 5, size: 130, className: "text-wedding-green" },
  { x: 21, y: 22, size: 70, className: "text-wedding-green" },
  { x: 75, y: 12, size: 80, className: "text-wedding-green" },
  { x: 89, y: 30, size: 110, className: "text-wedding-green" },
  { x: 72, y: 66, size: 60, className: "text-wedding-green" },
  
  { x: 80, y: 58, size: 90, className: "text-wedding-green" },
  { x: 66, y: 45, size: 130, className: "text-wedding-green" },
  { x: 89, y: 72, size: 70, className: "text-wedding-green" },

  { x: 5, y: 62, size: 80, className: "text-wedding-green" },
  { x: 18, y: 80, size: 110, className: "text-wedding-green" },
  { x: 33, y: 50, size: 60, className: "text-wedding-green" },
  
];

const envelopeUp: Variants = {
  initial: { y: "100vh" },
  animate: {
    y: 0,
    transition: { duration: 1.2, ease: "easeOut", delay: 0.1 },
  },
};

export default function Page() {
  return (
    <>
      {/* Stars now animate themselves (drop-in + stagger + parallax) */}
      <StarsLayer fromVh={120} duration={1.2} bloom>
        {StarList.map((s, i) => (
          <StarAt key={`star-${i}`} {...s} />
        ))}
      </StarsLayer>

      {/* Envelope flies up from bottom */}
      <motion.div
        className="mx-auto my-10 w-[min(1600px,92%)]"
        variants={envelopeUp}
        initial="initial"
        animate="animate"
      >
        <StartReveal>
          <RsvpFlow />
        </StartReveal>
      </motion.div>
    </>
  );
}