export const dynamic = "force-static"; // or "force-dynamic" if you prefer

import RsvpFlow from "./form/RsvpFlow";

export default function Page() {
  return (
    <div className="mx-auto my-10 w-[min(1200px,92%)]">
      <RsvpFlow />
    </div>
  );
}
