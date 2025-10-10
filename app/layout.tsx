// app/layout.tsx
import "@/app/ui/global.css";

import { josefin_sans } from "@/app/ui/fonts";

export default function Root({ children }: { children: React.ReactNode }) {
  return <html lang="en" className="h-full"><body className={`${josefin_sans.className} antialiased h-full`}>{children}</body></html>;
}