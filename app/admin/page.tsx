// app/admin/page.tsx
import Link from "next/link";
import { Users, ClipboardList, Settings } from "lucide-react";

export default function AdminHomePage() {
  return (
    <div className="mx-auto my-10 w-[min(900px,92%)]">
      <header className="mb-8 text-center">
        <h1 className="font-serif text-3xl font-semibold text-gray-900">Admin</h1>
        <p className="mt-2 text-gray-600">
          Quick links to management tools.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Guests & Permissions */}
        <Link
          href="/admin/guests"
          className="group block rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-pink-50 p-2 text-wedding-plum">
              <Users className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Guests &amp; Permissions
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Add guests, build parties, and edit RSVP targets.
              </p>
              <span className="mt-3 inline-flex items-center text-sm font-medium text-wedding-plum transition group-hover:translate-x-0.5">
                Open →
              </span>
            </div>
          </div>
        </Link>

        {/* Placeholder tiles (wire up later or remove) */}
        <div
          aria-disabled="true"
          className="rounded-2xl border border-dashed border-gray-200 bg-white/60 p-5 opacity-60"
          title="Coming soon"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-gray-100 p-2 text-gray-500">
              <ClipboardList className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">RSVP Dashboard</h2>
              <p className="mt-1 text-sm text-gray-600">
                Review latest RSVPs, exports, and trends.
              </p>
              <span className="mt-3 inline-flex items-center text-sm font-medium text-gray-500">
                Coming soon
              </span>
            </div>
          </div>
        </div>

        <div
          aria-disabled="true"
          className="rounded-2xl border border-dashed border-gray-200 bg-white/60 p-5 opacity-60 sm:col-span-2"
          title="Coming soon"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-gray-100 p-2 text-gray-500">
              <Settings className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Site Settings</h2>
              <p className="mt-1 text-sm text-gray-600">
                Registry links, schedule blocks, and content toggles.
              </p>
              <span className="mt-3 inline-flex items-center text-sm font-medium text-gray-500">
                Coming soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}