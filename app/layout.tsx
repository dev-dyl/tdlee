// app/layout.tsx
import "@/app/ui/global.css";

import { josefin_sans } from "@/app/ui/fonts";
import { Analytics } from '@vercel/analytics/next';

// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Taylor & Dylan",
  icons: {
    icon: "/favicon.ico",              // PNG/ICO fallback
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function Root({ children }: { children: React.ReactNode }) {
  return <html lang="en" className="h-full"><body className={`${josefin_sans.className} antialiased h-full`}>{children}<Analytics /></body></html>;
}