// app/gallery/layout.tsx
"use client";
import type { ReactNode } from "react";

// Load client-side only to avoid any SSR/hydration weirdness
import WallpaperBackground from "@/app/ui/WallpaperBackground";

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return (
    <>
    <WallpaperBackground
        type="quatrefoil"          // pick your flavor
        theme="plum"
        tint="white"
        className="!fixed inset-0 -z-10 pointer-events-none"
      />
      {children}
    </>
  );
}
