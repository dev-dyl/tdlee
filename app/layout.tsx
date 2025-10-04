import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import Image from "next/image";
import BackgroundParallax from "@/app/ui/BackgroundParallax";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} antialiased h-full`}>
        <BackgroundParallax />

        {/* Overlay gradient (optional, helps text contrast) */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />

        <div className="flex min-h-screen flex-col">
          {/* Header band */}
          <header className="w-full">
            <div className="mx-auto mt-6 w-[min(2200px,92%)] rounded-2xl border border-white/50 bg-white/70 p-6 text-center shadow-xl backdrop-blur-sm">
              <h1 className="font-serif text-4xl font-bold text-gray-800">
                T&amp;D Wedding
              </h1>
              <nav className="mt-4">
                <div className="flex justify-center gap-6 text-lg text-gray-700">
                  <a href="#" className="hover:underline">
                    Home
                  </a>
                  <b className="text-gray-400">|</b>
                  <a href="#" className="hover:underline">
                    Gallery
                  </a>
                  <b className="text-gray-400">|</b>
                  <a href="#" className="hover:underline">
                    About Us
                  </a>
                  <b className="text-gray-400">|</b>
                  <a href="#" className="hover:underline">
                    RSVP
                  </a>
                </div>
              </nav>
            </div>
          </header>

          {/* Main content (bands live inside) */}
          <main className="flex flex-1 flex-col items-center py-10">{children}</main>

          {/* Footer band */}
          <footer className="py-6">
            {/* <div className="mx-auto w-[min(2200px,92%)] rounded-2xl border border-white/50 bg-white/70 p-4 text-center text-gray-700 shadow-xl backdrop-blur-sm">
              <p>&copy; 2025 T&amp;D Wedding</p>
            </div> */}
          </footer>
        </div>
      </body>
    </html>
  );
}