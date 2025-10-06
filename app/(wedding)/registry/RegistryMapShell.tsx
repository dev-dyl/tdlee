"use client";

import dynamic from "next/dynamic";

const TripMap = dynamic(() => import("./TripMap"), {
  ssr: false, // allowed here because this file is a Client Component
  loading: () => (
    <div className="h-[60vh] rounded-2xl border border-gray-200 bg-white/60" />
  ),
});

export default function RegistryMapShell() {
  return <TripMap />;
}