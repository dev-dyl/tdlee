// app/rsvp/layout.tsx
import type { Metadata } from "next";
import WallpaperBackground from "@/app/ui/WallpaperBackground";
export const metadata: Metadata = { title: "RSVP" };

import { Higuen } from '@/app/ui/fonts';

export default function RsvpLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen [isolation:isolate]">
      {/* background */}
      
      <WallpaperBackground type="trellis" />

      {/* star layer target (children can portal into this) */}
      <div id="rsvp-stars-root" className="absolute inset-0 z-0 pointer-events-none" aria-hidden />

      {/* content */}
      <nav className="sticky top-0 z-30 w-full border-b border-black/5 bg-gradient-to-b from-wedding-pink/85 to-wedding-pink/90 backdrop-blur">
        <div className="mx-auto flex h-12 w-[min(1100px,92%)] items-center justify-between">
          <span className={`font-serif text-xl ${Higuen.className} text-gray-900`}>Taylor and Dylan's Wedding - RSVP</span>
          <a href="/" className={`font-serif text-xl ${Higuen.className} text-gray-900`}>Home</a>
        </div>
      </nav>

      <main className="relative z-10 mx-auto w-[min(600px,92%)] py-8">
        {children}
      </main>
    </div>
  );
}