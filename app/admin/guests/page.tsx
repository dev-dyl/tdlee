import GuestsAdmin from "./GuestsAdmin";

export default function Page() {
  return (
    <div className="mx-auto my-10 w-[min(1200px,92%)]">
      <h1 className="mb-6 text-center font-serif text-3xl font-semibold text-gray-900">
        Guests • Party Builder • RSVP Permissions
      </h1>
      <GuestsAdmin />
    </div>
  );
}