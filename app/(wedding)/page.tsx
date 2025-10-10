// app/page.tsx — Server Component (updated with Taylor & Dylan's details)
import JumpToContent from "../ui/JumpToContent";
import BackgroundParallax from "@/app/ui/BackgroundParallax";

export default function Page() {
  return (
    <>
      <BackgroundParallax />
      <div className="flex w-full flex-col items-center gap-8">
        {/* Spacer to reveal the parallax background before content */}
        <div className="h-[100vh] md:h-[100vh]" aria-hidden />

        <JumpToContent targetId="content" />

        {/* ====================== */}
        {/* Band 1: Hero / Intro   */}
        {/* ====================== */}
        <section
          id="content"
          className="w-[min(2200px,92%)] rounded-2xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-sm"
        >
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-medium tracking-wide text-gray-700">November 14, 2025 • Peoria, AZ • 4:00 PM</p>
            <h1 className="mt-2 text-4xl md:text-5xl font-semibold text-gray-800">
              The Wedding of Taylor and Dylan
            </h1>
            <p className="mt-2 text-base tracking-wide text-gray-600">A night under the stars</p>
            <p className="mx-auto mt-4 max-w-2xl text-gray-700">
              We can’t wait to celebrate with you in our backyard. Your presence is truly the greatest gift —
              if you’d still like to contribute, you’ll find our registry below.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#rsvp"
                className="inline-block rounded-lg bg-pink-500 px-6 py-3 font-medium text-white transition hover:bg-pink-600"
              >
                RSVP
              </a>
              <a
                href="/registry"
                className="inline-block rounded-lg border border-pink-400/60 bg-white/70 px-6 py-3 font-medium text-pink-600 transition hover:bg-white"
              >
                View Registry
              </a>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
              <div className="rounded-xl border border-gray-200/70 bg-white/70 p-4">
                <h3 className="font-semibold text-gray-900">When</h3>
                <p className="mt-1 text-gray-700">Friday, November 14, 2025</p>
                <p className="text-gray-700">Ceremony at 4:00 PM</p>
              </div>
              <div className="rounded-xl border border-gray-200/70 bg-white/70 p-4">
                <h3 className="font-semibold text-gray-900">Where</h3>
                <p className="mt-1 text-gray-700">Backyard Wedding</p>
                <p className="text-gray-700">Peoria, Arizona</p>
              </div>
              <div className="rounded-xl border border-gray-200/70 bg-white/70 p-4">
                <h3 className="font-semibold text-gray-900">Dress Code</h3>
                <p className="mt-1 text-gray-700">Cocktail Attire</p>
                <p className="text-gray-700">Outdoor-friendly footwear encouraged</p>
              </div>
            </div>
          </div>
        </section>

        {/* ====================== */}
        {/* Band 2: Schedule       */}
        {/* ====================== */}
        <section
          id="schedule"
          className="w-[min(2200px,92%)] rounded-2xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-sm"
          aria-labelledby="schedule-heading"
        >
          <div className="mx-auto max-w-4xl">
            <h2 id="schedule-heading" className="text-3xl font-semibold text-gray-800 text-center">
              Schedule
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-200/70 bg-white/70 p-5">
                <p className="text-sm font-medium text-pink-600">3:30 PM</p>
                <h3 className="mt-1 font-semibold text-gray-900">Guest Arrival</h3>
                <p className="mt-1 text-gray-700">Grab a seat and say hello.</p>
              </div>
              <div className="rounded-xl border border-gray-200/70 bg-white/70 p-5">
                <p className="text-sm font-medium text-pink-600">4:00 – ~4:30 PM</p>
                <h3 className="mt-1 font-semibold text-gray-900">Ceremony</h3>
                <p className="mt-1 text-gray-700">Dylan & Taylor say “I do”.</p>
              </div>
              <div className="rounded-xl border border-gray-200/70 bg-white/70 p-5">
                <p className="text-sm font-medium text-pink-600">~4:30 – 5:30 PM</p>
                <h3 className="mt-1 font-semibold text-gray-900">Cocktail Hour</h3>
                <p className="mt-1 text-gray-700">Mix, mingle, and enjoy drinks & apps.</p>
              </div>
              <div className="rounded-xl border border-gray-200/70 bg-white/70 p-5 sm:col-span-2">
                <p className="text-sm font-medium text-pink-600">5:30 PM – Evening</p>
                <h3 className="mt-1 font-semibold text-gray-900">Dinner & Reception</h3>
                <p className="mt-1 text-gray-700">Pizza dinner (gluten‑free options), toasts, and dancing.</p>
              </div>
              <div className="rounded-xl border border-gray-200/70 bg-white/70 p-5">
                <p className="text-sm font-medium text-pink-600">10:00 PM</p>
                <h3 className="mt-1 font-semibold text-gray-900">Noise Cutoff</h3>
                <p className="mt-1 text-gray-700">We’ll wind down to respect the neighborhood.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ====================== */}
        {/* Band 3: Venue          */}
        {/* ====================== */}
        <section
          id="venue"
          className="w-[min(2200px,92%)] rounded-2xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-sm"
          aria-labelledby="venue-heading"
        >
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h2 id="venue-heading" className="text-3xl font-semibold text-gray-800">
                Venue
              </h2>
              <p className="mt-3 text-gray-700">
                Ceremony and reception will be in our backyard. Most of the evening will be outdoors, with indoor
                space available for comfort.
              </p>
              <div className="mt-4 space-y-1 text-gray-800">
                <p className="font-medium">Address</p>
                <p className="text-gray-700">7015 W. Calavar Rd, Peoria, AZ 85381</p>
                <a
                  href="https://maps.google.com/?q=7015%20W.%20Calavar%20Rd,%20Peoria,%20AZ%2085381"
                  className="inline-block text-pink-600 underline underline-offset-4 hover:text-pink-700"
                >
                  Open in Maps
                </a>
              </div>
              <ul className="mt-4 list-disc pl-5 text-gray-700">
                <li>Parking is semi‑limited (~10 cars). Please carpool if you can.</li>
                <li>Contact us to coordinate rides/carpool options.</li>
                <li>Expected weather: high 71° / low 48°. Bring a layer for the evening.</li>
              </ul>
            </div>

            {/* Map placeholder / image slot */}
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gray-200/70 bg-white/60 shadow-inner">
              <div className="grid h-full w-full place-items-center text-center p-6">
                <p className="text-gray-700">
                  <span className="font-medium">Map Embed Placeholder</span>
                  <br />
                  Drop your map iframe or an image here.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ====================== */}
        {/* Band 4: Food & Drinks  */}
        {/* ====================== */}
        <section
          id="details"
          className="w-[min(2200px,92%)] rounded-2xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-sm"
        >
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-semibold text-gray-800 text-center">Food & Drinks</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6">
                <h3 className="font-semibold text-gray-900">Dinner</h3>
                <p className="mt-2 text-gray-700">Pizza dinner with gluten‑free options available.</p>
              </div>
              <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6">
                <h3 className="font-semibold text-gray-900">Drinks</h3>
                <p className="mt-2 text-gray-700">Beer, wine, and mixed drinks will be provided.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ====================== */}
        {/* Band 5: Gallery CTA    */}
        {/* ====================== */}
        <section
          id="gallery"
          className="w-[min(2200px,92%)] rounded-2xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-sm"
        >
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-semibold text-gray-800">Photo Gallery</h2>
            <p className="mt-2 text-gray-700">A few favorites—see the full gallery for more.</p>

            {/* Mini preview grid (replace with your images) */}
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="aspect-[4/3] rounded-xl bg-gray-200/60"></div>
              <div className="aspect-[4/3] rounded-xl bg-gray-200/60"></div>
              <div className="aspect-[4/3] rounded-xl bg-gray-200/60"></div>
              <div className="aspect-[4/3] rounded-xl bg-gray-200/60"></div>
            </div>

            <a
              href="#"
              className="mt-6 inline-block rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-black"
            >
              View Full Gallery
            </a>
          </div>
        </section>

        {/* ====================== */}
        {/* Band 6: RSVP CTA       */}
        {/* ====================== */}
        <section
          id="rsvp"
          className="w-[min(2200px,92%)] rounded-2xl border border-white/60 bg-white/80 p-8 text-center shadow-xl backdrop-blur-sm"
        >
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-semibold text-gray-800">RSVP</h2>
            <p className="mt-2 text-gray-700">
              Kindly let us know if you can join us. If you have dietary preferences, please include them with your response.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#" // Replace with your RSVP form link
                className="inline-block rounded-lg bg-pink-500 px-6 py-3 font-medium text-white transition hover:bg-pink-600"
              >
                Respond Online
              </a>
              <a
                href="mailto:?subject=Wedding%20RSVP%20—%20Taylor%20%26%20Dylan"
                className="inline-block rounded-lg border border-pink-400/60 bg-white/70 px-6 py-3 font-medium text-pink-600 transition hover:bg-white"
              >
                Email Your RSVP
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-600">Gifts are not required. If you’d like, you can visit our <a href="/registry" className="text-pink-600 underline underline-offset-4 hover:text-pink-700">registry</a>.</p>
          </div>
        </section>

        {/* ====================== */}
        {/* Band 7: Registry       */}
        {/* ====================== */}
        <section
          id="registry"
          className="w-[min(2200px,92%)] rounded-2xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-sm"
        >
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-semibold text-gray-800">Registry</h2>
            <p className="mt-2 text-gray-700">
              Your presence is more than enough. For those who’ve asked, our registry is linked below.
            </p>
            <div className="mt-6 flex items-center justify-center">
              <a
                href="/registry"
                className="rounded-xl border border-gray-200/70 bg-white/70 px-8 py-4 text-left font-semibold text-gray-900 transition hover:bg-white"
              >
                Open Registry
              </a>
            </div>
          </div>
        </section>

        {/* ====================== */}
        {/* Band 8: Practical Info */}
        {/* ====================== */}
        <section
          id="info"
          className="w-[min(2200px,92%)] rounded-2xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-sm"
          aria-labelledby="info-heading"
        >
          <div className="mx-auto max-w-3xl">
            <h2 id="info-heading" className="text-3xl font-semibold text-gray-800 text-center">
              Good to Know
            </h2>
            <ul className="mt-6 space-y-3">
              <li className="rounded-xl border border-gray-200/70 bg-white/70 p-4">
                <p className="mt-1 font-medium text-gray-900">Parking</p>
                <p className="text-gray-700">Semi‑limited (~10 cars). Please carpool when possible.</p>
              </li>
              <li className="rounded-xl border border-gray-200/70 bg-white/70 p-4">
                <p className="mt-1 font-medium text-gray-900">Carpool</p>
                <p className="text-gray-700">Contact us to coordinate rides.</p>
              </li>
              <li className="rounded-xl border border-gray-200/70 bg-white/70 p-4">
                <p className="mt-1 font-medium text-gray-900">Environment</p>
                <p className="text-gray-700">Primarily outdoors; inside available as needed.</p>
              </li>
              <li className="rounded-xl border border-gray-200/70 bg-white/70 p-4">
                <p className="mt-1 font-medium text-gray-900">Noise Cutoff</p>
                <p className="text-gray-700">10:00 PM neighborhood quiet hours.</p>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
