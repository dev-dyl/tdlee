import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <div className="flex flex-col min-h-screen">
          {/* Header with Title */}
          <header className="py-6 text-center">
            <h1 className="text-4xl font-bold text-gray-800 font-serif">
              T&D Wedding
            </h1>
            {/* Navigation Section */}
            <nav className="w-3/4 mx-auto mt-4">
              <div className="flex justify-center gap-6 text-gray-700 text-lg">
                <a href="#" className="hover:underline">Home</a>
                <b>|</b>
                <a href="#" className="hover:underline">Gallery</a>
                <b>|</b>
                <a href="#" className="hover:underline">RSVP</a>
              </div>
            </nav>
          </header>

          {/* Main Content */}
          <main className="flex min-h-screen flex-col items-center p-0 bg-gray-50">
            {children}
          </main>

          {/* Footer */}
          <footer className="py-4 text-center">
            <p>&copy; 2025 T&D Wedding</p>
          </footer>
        </div>
      </body>
    </html>
  );
}