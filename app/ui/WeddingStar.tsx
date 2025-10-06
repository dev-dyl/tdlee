// app/(rsvp)/rsvp/Star.tsx
"use client";

import * as React from "react";

type StarProps = {
  /** CSS length or number of pixels (default 120) */
  width?: number | string;
  /** Any CSS color; defaults to current text color so Tailwind classes work */
  color?: string;
  /** Optional: pass Tailwind classes (e.g., 'text-wedding-plum') */
  className?: string;
  /** Optional accessible title; omit to mark decorative */
  title?: string;
};

const VIEWBOX_W = 100.9464;
const VIEWBOX_H = 101.68213;
const RATIO = VIEWBOX_H / VIEWBOX_W;

export default function WeddingStar({
  width = 120,
  color = "currentColor",
  className,
  title,
}: StarProps) {
  // If width is numeric, compute an explicit height to avoid layout shift
  const height =
    typeof width === "number" ? Math.round(width * RATIO) : undefined;

  // If no title, hide from ATs (decorative)
  const ariaProps = title
    ? { role: "img", "aria-label": title }
    : { "aria-hidden": true };

  return (
    <svg
      {...ariaProps}
      className={className}
      width={width}
      height={height}
      viewBox="0 0 100.9464 101.68213"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      <g transform="translate(-45.849172,-63.58322)">
        <path
          d="m 96.108446,164.21537 c -1.264885,-14.1714 -2.197091,-28.3699 -3.42835,-42.5441 -6.94214,5.3912 -13.386369,11.38549 -20.265898,16.85351 5.457794,-6.84444 11.292817,-13.37425 16.921546,-20.07612 -14.453017,-1.75243 -29.024752,-2.22317 -43.486574,-3.88728 14.401871,-1.49333 28.886976,-2.04423 43.271867,-3.71722 -5.256862,-7.00939 -11.458493,-13.343452 -16.86318,-20.27412 6.972758,5.461322 13.344299,11.65047 20.414299,16.99164 1.317839,-14.651299 2.149355,-29.344006 3.65871,-43.97846 1.327681,14.678679 2.321008,29.385418 3.66505,44.06269 6.843284,-5.53967 13.377444,-11.449491 20.241264,-16.96431 -5.39386,6.886912 -11.47407,13.20845 -16.75179,20.18919 14.41046,1.5372 28.89587,2.22206 43.31018,3.71772 -14.48347,1.60287 -29.0653,2.12657 -43.53607,3.8589 5.61612,6.68991 11.45036,13.19838 16.87733,20.04576 -6.84583,-5.48471 -13.33059,-11.40154 -20.150924,-16.91708 -1.359726,14.5528 -2.166825,29.15372 -3.717451,43.68926 -0.05334,-0.34999 -0.106673,-0.69999 -0.160009,-1.04998 z"
          fill={color}
        />
      </g>
    </svg>
  );
}