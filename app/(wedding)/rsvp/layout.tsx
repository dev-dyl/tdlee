// app/rsvp/layout.tsx
import type { Metadata } from "next";
export const metadata: Metadata = { title: "RSVP" };

export default function RsvpLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-white">
      {/* smaller nav */}
      <nav className="sticky top-0 z-30 w-full border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-12 w-[min(1100px,92%)] items-center justify-between">
          <span className="font-serif text-lg text-gray-900">Our Day</span>
          <a href="/" className="text-sm text-gray-700 hover:text-gray-900">Home</a>
        </div>
      </nav>
      <main className="mx-auto w-[min(1100px,92%)] py-8">{children}</main>
    </div>
  );
}