// app/rsvp/_bg/StarAt.tsx
"use client";

import * as React from "react";
import WeddingStar from "@/app/ui/WeddingStar";

export type StarAtProps = {
  x: number | string;     // e.g. 20 (=> 20%) or "180px"
  y: number | string;     // e.g. "35%" or 240
  size?: number;          // px width (default 80)
  color?: string;         // defaults to currentColor
  rotate?: number;        // degrees
  opacity?: number;       // 0..1
  className?: string;     // Tailwind classes (e.g., "text-wedding-pink/70")
  interactive?: boolean;  // set true if you want clicks
  title?: string;
};

export default function StarAt({
  x,
  y,
  size = 80,
  color = "currentColor",
  rotate = 0,
  opacity = 1,
  className,
  interactive = false,
  title,
}: StarAtProps) {
  const style: React.CSSProperties = {
    position: "absolute",
    left: typeof x === "number" ? `${x}%` : x,
    top: typeof y === "number" ? `${y}%` : y,
    transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
    opacity,
    pointerEvents: interactive ? "auto" : "none",
  };

  return (
    <div style={style} className={className}>
      <WeddingStar width={size} color={color} title={title} />
    </div>
  );
}