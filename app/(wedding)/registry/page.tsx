'use client';
import BackgroundParallax from "@/app/ui/BackgroundParallax";
import RegistryMapShell from "./RegistryMapShell";
import { Higuen } from '@/app/ui/fonts';

export default function RegistryPage() {
  return (
    <><BackgroundParallax />
    <div className="mx-auto w-[min(1100px,92%)] py-10 rounded-2xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
      <header className="mb-2 text-center">
        <h1 className={`text-4xl ${Higuen.className} text-gray-800 text-center`}>Honeymoon Fund</h1>
      </header>
      <section className="mx-auto mt-2 max-w-2xl text-center">
        <p className="text-gray-700">
          We're taking a roadtrip up the coast! If you wish to support us with a gift, please visit our registry.
        </p>
        <a
          href="https://www.honeyfund.com/site/TaylorDylanWedding"
          className="mt-4 inline-block rounded-lg bg-wedding-plum px-6 py-3 font-medium text-white transition hover:bg-wedding-plum"
        >
          View Registry
        </a>
      </section>

      <div className="flex justify-between mt-2 text-center">
        <p className="mt-2 text-gray-700">Follow our path! Pan and zoom the map to explore.</p>
        <p className="mt-2 text-gray-700">Check in later for more info.</p>
      </div>
      
      {/* Client-only map, dynamically loaded */}
      <div className="pt-3">
      <RegistryMapShell />
      </div>
      
    </div></>
  );
}
