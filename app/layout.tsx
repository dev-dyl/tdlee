// app/layout.tsx
import "@/app/ui/global.css";

import { inter } from "@/app/ui/fonts";
export default function Root({ children }: { children: React.ReactNode }) {
  return <html lang="en" className="h-full"><body className={`${inter.className} antialiased h-full`}>{children}</body></html>;
}