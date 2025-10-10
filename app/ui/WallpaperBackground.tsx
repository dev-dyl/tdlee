// app\ui\WallpaperBackground.tsx
"use client";

import clsx from "clsx";

type WallpaperType = "trellis" | "quatrefoil" | "petals";

type Props = {
  /** which pattern to use */
  type: WallpaperType;
  /** extra classes for positioning/z-index, etc. */
  className?: string;
  /** base theme; defaults to forest */
  theme?: "forest" | "plum";
  /** ink tint; defaults to white */
  tint?: "white" | "pink" | "gold";
};

export default function WallpaperBackground({
  type,
  className,
  theme = "forest",
  tint = "white",
}: Props) {
  const strongClass =
    type === "trellis"
      ? "wp-strong-trellis"
      : type === "petals"
      ? "wp-strong-quatrefoil-petals"
      : "wp-strong-quatrefoil";

  const patternClass =
    type === "trellis"
      ? "wp-trellis"
      : type === "petals"
      ? "wp-quatrefoil-petals"
      : "wp-quatrefoil";

  const themeClass = theme === "plum" ? "wp-theme-plum" : "wp-theme-forest";
  const tintClass =
    tint === "pink" ? "wp-ink-pink" : tint === "gold" ? "wp-ink-gold" : "wp-ink-white";

  return (
    <div
      className={clsx("absolute inset-0 -z-10 wp", themeClass, tintClass, strongClass, className)}
      aria-hidden
    >
      <div className="wp-base" />
      <div className={patternClass} />
      <div className="wp-ribs" />
      <div className="wp-vignette" />
    </div>
  );
}