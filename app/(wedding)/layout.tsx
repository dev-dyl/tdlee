import "@/app/ui/global.css";
import Link from "next/link";
import { Higuen } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <>
        {/* Overlay gradient (optional, helps text contrast) */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />

        <div className="flex min-h-screen flex-col">
          {/* Header band */}
          <header className="w-full">
            <div className="mx-auto mt-6 w-[min(2200px,92%)] rounded-2xl border border-white/50 bg-white/70 p-6 text-center shadow-xl backdrop-blur-sm">
              <h1 className={`${Higuen.className} text-5xl text-wedding-forest`}>
                The Wedding of Taylor and Dylan
              </h1>
              <nav className="mt-6">
                <div className="flex flex-wrap justify-center gap-5 text-lg text-gray-700">
                  <Link href="/" className="hover:underline">
                    HOME
                  </Link>
                  <b className="text-gray-400">|</b>
                  <Link href="/info" className="hover:underline">
                    INFO
                  </Link>
                  <b className="text-gray-400">|</b>
                  <Link href="/registry" className="hover:underline">
                    REGISTRY
                  </Link>
                  <b className="text-gray-400">|</b>
                  <Link href="/gallery" className="hover:underline">
                    GALLERY
                  </Link>
                  <b className="text-gray-400">|</b>
                  <Link href="/rsvp" className="hover:underline">
                    RSVP
                  </Link>
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
      </>
  );
}