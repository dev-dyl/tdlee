// app/(rsvp)/rsvp/page.tsx
export const dynamic = "force-static"; // or "force-dynamic"

import StartReveal from "./form/StartReveal";
import RsvpFlow from "./form/RsvpFlow";
import StarsLayer from "./_bg/StarsLayer";
import StarAt, { StarAtProps } from "./_bg/StarAt";


const StarList : StarAtProps[] = [
  { x: 12, y: 18, size: 70, className: "text-wedding-pink/70", rotate: 8 },

  { x: "85%", y: "30%", size: 110, color: "#D4AF37", opacity: 0.9 },

  { x: 5, y: 18, size: 90, className: "text-wedding-green" },
  { x: 20, y: 5, size: 130, className: "text-wedding-green" },

]

export default function Page() {
  return (
    <>
      <StarsLayer>
        {
          StarList.map((s, i) => <StarAt key={`star-${i}`} {...s} />)
        }
      </StarsLayer>
    <div className="mx-auto my-10 w-[min(1600px,92%)]">
      {/* Overlay is scoped to this container only */}
      <StartReveal>
        <RsvpFlow />
      </StartReveal>
    </div>
    </>
  );
}
