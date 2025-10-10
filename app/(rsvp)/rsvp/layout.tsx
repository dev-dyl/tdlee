// app/rsvp/layout.tsx
import type { Metadata } from "next";
export const metadata: Metadata = { title: "RSVP" };

export default function RsvpLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen [isolation:isolate]">
      {/* background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-wedding-forest/85 via-wedding-forest/95 to-wedding-forest/100" />

      {/* star layer target (children can portal into this) */}
      <div id="rsvp-stars-root" className="absolute inset-0 z-0 pointer-events-none" aria-hidden />

      {/* content */}
      <nav className="sticky top-0 z-30 w-full border-b border-black/5 bg-gradient-to-b from-wedding-pink/85 to-wedding-pink/90 backdrop-blur">
        <div className="mx-auto flex h-12 w-[min(1100px,92%)] items-center justify-between">
          <span className="font-serif text-lg text-gray-900">Our Day</span>
          <a href="/" className="text-sm text-gray-700 hover:text-gray-900">Home</a>
        </div>
      </nav>

      <main className="relative z-10 mx-auto w-[min(600px,92%)] py-8">
        {children}
      </main>
    </div>
  );
}
