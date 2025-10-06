import RegistryMapShell from "./RegistryMapShell";

export default function RegistryPage() {
  return (
    <div className="mx-auto w-[min(1100px,92%)] py-10">
      <header className="mb-6 text-center">
        <h1 className="font-serif text-3xl font-semibold text-gray-900">Honeymoon Roadtrip</h1>
        <p className="mt-2 text-gray-700">Follow our path! Pan and zoom the map to explore.</p>
      </header>

      {/* Client-only map, dynamically loaded */}
      <RegistryMapShell />

      <section className="mx-auto mt-8 max-w-2xl text-center">
        <p className="text-gray-700">
          If you’d like to contribute to our adventure, we’re grateful for gifts to our honeymoon fund.
        </p>
        <a
          href="#"
          className="mt-4 inline-block rounded-lg bg-pink-500 px-6 py-3 font-medium text-white transition hover:bg-pink-600"
        >
          View Registry
        </a>
      </section>
    </div>
  );
}
