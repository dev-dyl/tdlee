// app/page.tsx — Server Component
import JumpToContent from "./ui/JumpToContent";
export default function Page() {
  return (
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
          <p className="font-medium tracking-wide text-gray-700">June 14, 2026 • Sedona, AZ</p>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl font-semibold text-gray-800">
            Celebrate With Us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-700">
            We can’t wait to share this day with our favorite people. Your presence is our greatest gift,
            but if you wish to contribute, you’ll find our registry below.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#rsvp"
              className="inline-block rounded-lg bg-pink-500 px-6 py-3 font-medium text-white transition hover:bg-pink-600"
            >
              RSVP
            </a>
            <a
              href="#registry"
              className="inline-block rounded-lg border border-pink-400/60 bg-white/70 px-6 py-3 font-medium text-pink-600 transition hover:bg-white"
            >
              View Registry
            </a>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200/70 bg-white/70 p-4">
              <h3 className="font-semibold text-gray-900">When</h3>
              <p className="mt-1 text-gray-700">Saturday, June 14, 2026</p>
              <p className="text-gray-700">Ceremony at 4:00 PM</p>
            </div>
            <div className="rounded-xl border border-gray-200/70 bg-white/70 p-4">
              <h3 className="font-semibold text-gray-900">Where</h3>
              <p className="mt-1 text-gray-700">Red Rock Overlook</p>
              <p className="text-gray-700">Sedona, Arizona</p>
            </div>
            <div className="rounded-xl border border-gray-200/70 bg-white/70 p-4">
              <h3 className="font-semibold text-gray-900">Dress Code</h3>
              <p className="mt-1 text-gray-700">Garden party semi-formal</p>
              <p className="text-gray-700">Comfortable shoes encouraged</p>
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
          <h2 id="schedule-heading" className="font-serif text-3xl font-semibold text-gray-800 text-center">
            Schedule
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200/70 bg-white/70 p-5">
              <p className="text-sm font-medium text-pink-600">3:30 PM</p>
              <h3 className="mt-1 font-semibold text-gray-900">Guest Arrival</h3>
              <p className="mt-1 text-gray-700">Shuttle drop-off at the Overlook entrance.</p>
            </div>
            <div className="rounded-xl border border-gray-200/70 bg-white/70 p-5">
              <p className="text-sm font-medium text-pink-600">4:00 PM</p>
              <h3 className="mt-1 font-semibold text-gray-900">Ceremony</h3>
              <p className="mt-1 text-gray-700">A short and sweet ceremony with the red rocks.</p>
            </div>
            <div className="rounded-xl border border-gray-200/70 bg-white/70 p-5">
              <p className="text-sm font-medium text-pink-600">5:00 PM</p>
              <h3 className="mt-1 font-semibold text-gray-900">Cocktail Hour</h3>
              <p className="mt-1 text-gray-700">Refreshments, live acoustic set, lawn games.</p>
            </div>
            <div className="rounded-xl border border-gray-200/70 bg-white/70 p-5 sm:col-span-2">
              <p className="text-sm font-medium text-pink-600">6:00 PM</p>
              <h3 className="mt-1 font-semibold text-gray-900">Reception & Dinner</h3>
              <p className="mt-1 text-gray-700">Seasonal menu, speeches, and dancing.</p>
            </div>
            <div className="rounded-xl border border-gray-200/70 bg-white/70 p-5">
              <p className="text-sm font-medium text-pink-600">10:00 PM</p>
              <h3 className="mt-1 font-semibold text-gray-900">Sparkler Send-off</h3>
              <p className="mt-1 text-gray-700">Shuttles back to hotels after the send-off.</p>
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
            <h2 id="venue-heading" className="font-serif text-3xl font-semibold text-gray-800">
              Venue
            </h2>
            <p className="mt-3 text-gray-700">
              The ceremony and reception will be held at the Red Rock Overlook, with panoramic views of
              Cathedral Rock. Complimentary shuttles will run from the hotel block downtown to the venue.
            </p>
            <div className="mt-4 space-y-1 text-gray-800">
              <p className="font-medium">Address</p>
              <p className="text-gray-700">123 Overlook Rd, Sedona, AZ 86336</p>
              <a
                href="https://maps.google.com"
                className="inline-block text-pink-600 underline underline-offset-4 hover:text-pink-700"
              >
                Open in Maps
              </a>
            </div>
            <ul className="mt-4 list-disc pl-5 text-gray-700">
              <li>On-site parking is reserved for vendors and accessibility needs.</li>
              <li>Shuttle times will be posted in the Updates section below.</li>
              <li>Evening temperatures can dip—bring a light layer.</li>
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
      {/* Band 4: Travel & Stays */}
      {/* ====================== */}
      <section
        id="travel"
        className="w-[min(2200px,92%)] rounded-2xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-sm"
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="font-serif text-3xl font-semibold text-gray-800 text-center">
            Travel & Accommodations
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6">
              <h3 className="font-semibold text-gray-900">Getting to Sedona</h3>
              <ul className="mt-2 space-y-2 text-gray-700">
                <li><span className="font-medium">Closest airports:</span> Phoenix Sky Harbor (PHX), Flagstaff Pulliam (FLG)</li>
                <li><span className="font-medium">Drive:</span> ~2 hrs from PHX, ~45 min from FLG</li>
                <li><span className="font-medium">Rideshare:</span> Lyft/Uber available in Sedona until late evening</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6">
              <h3 className="font-semibold text-gray-900">Hotel Block</h3>
              <ul className="mt-2 space-y-2 text-gray-700">
                <li>
                  <span className="font-medium">Sedona Springs Hotel</span> — 0.4 mi •
                  <a href="#" className="ml-1 text-pink-600 underline underline-offset-4 hover:text-pink-700">Book with group rate</a>
                </li>
                <li>
                  <span className="font-medium">Oak Creek Inn</span> — 0.9 mi •
                  <a href="#" className="ml-1 text-pink-600 underline underline-offset-4 hover:text-pink-700">Reserve</a>
                </li>
                <li>
                  <span className="font-medium">Desert View Lodge</span> — 1.3 mi •
                  <a href="#" className="ml-1 text-pink-600 underline underline-offset-4 hover:text-pink-700">Reserve</a>
                </li>
              </ul>
              <p className="mt-2 text-gray-700"><span className="font-medium">Cutoff date:</span> May 15, 2026</p>
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
          <h2 className="font-serif text-3xl font-semibold text-gray-800">Photo Gallery</h2>
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
          <h2 className="font-serif text-3xl font-semibold text-gray-800">RSVP</h2>
          <p className="mt-2 text-gray-700">
            Kindly reply by <span className="font-medium">May 1, 2026</span>. If you have dietary preferences,
            please include them with your response.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#"
              className="inline-block rounded-lg bg-pink-500 px-6 py-3 font-medium text-white transition hover:bg-pink-600"
            >
              Respond Online
            </a>
            <a
              href="mailto:hello@example.com?subject=Wedding%20RSVP"
              className="inline-block rounded-lg border border-pink-400/60 bg-white/70 px-6 py-3 font-medium text-pink-600 transition hover:bg-white"
            >
              Email Your RSVP
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-600">Questions? Text (555) 123-4567.</p>
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
          <h2 className="font-serif text-3xl font-semibold text-gray-800">Registry</h2>
          <p className="mt-2 text-gray-700">
            Your presence is more than enough. For those who’ve asked, we’ve created a small registry.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <a
              href="#"
              className="rounded-xl border border-gray-200/70 bg-white/70 p-5 text-left transition hover:bg-white"
            >
              <p className="font-semibold text-gray-900">Zola</p>
              <p className="mt-1 text-gray-700">Kitchen, linens, and more</p>
            </a>
            <a
              href="#"
              className="rounded-xl border border-gray-200/70 bg-white/70 p-5 text-left transition hover:bg-white"
            >
              <p className="font-semibold text-gray-900">Target</p>
              <p className="mt-1 text-gray-700">Home essentials</p>
            </a>
            <a
              href="#"
              className="rounded-xl border border-gray-200/70 bg-white/70 p-5 text-left transition hover:bg-white"
            >
              <p className="font-semibold text-gray-900">Honeymoon Fund</p>
              <p className="mt-1 text-gray-700">Experiences & memories</p>
            </a>
          </div>
        </div>
      </section>

      {/* ====================== */}
      {/* Band 8: Updates        */}
      {/* ====================== */}
      <section
        id="updates"
        className="w-[min(2200px,92%)] rounded-2xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-sm"
        aria-labelledby="updates-heading"
      >
        <div className="mx-auto max-w-3xl">
          <h2 id="updates-heading" className="font-serif text-3xl font-semibold text-gray-800 text-center">
            Updates
          </h2>
          <ul className="mt-6 space-y-3">
            <li className="rounded-xl border border-gray-200/70 bg-white/70 p-4">
              <p className="text-sm text-gray-600">Apr 20, 2026</p>
              <p className="mt-1 font-medium text-gray-900">Shuttle schedule posted</p>
              <p className="text-gray-700">Downtown pickups every 20 minutes beginning at 2:50 PM.</p>
            </li>
            <li className="rounded-xl border border-gray-200/70 bg-white/70 p-4">
              <p className="text-sm text-gray-600">Mar 28, 2026</p>
              <p className="mt-1 font-medium text-gray-900">Hotel block extended</p>
              <p className="text-gray-700">We added a few more rooms at Sedona Springs through May 15.</p>
            </li>
            <li className="rounded-xl border border-gray-200/70 bg-white/70 p-4">
              <p className="text-sm text-gray-600">Feb 10, 2026</p>
              <p className="mt-1 font-medium text-gray-900">Menu preview</p>
              <p className="text-gray-700">Vegetarian and gluten-free options available—add notes to your RSVP.</p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}