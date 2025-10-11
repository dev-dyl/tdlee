// TripMap.tsx
"use client";

import * as React from "react";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

/** Replace with your real route in [lat, lng] pairs */
const ROUTE: LatLngTuple[] = [
  [33.4483, -112.0740], // Phoenix
  [32.7157, -117.1610], // San Diego
  [32.736,  -117.1535], // San Diego Zoo
  [33.8125, -117.9189], // Disney
  [34.0549, -118.2426], // LA
  [36.6182, -121.9045], // Monterey Bay Aquarium
  [37.0049, -121.6316], // Gilroy Gardens
  [37.8528, -119.8628], // Yosemite
  [37.7749, -122.4194], // SF
  [37.9229, -122.6063], // Mount Tam
  [41.4357, -124.3525], // Redwood Forest
  [44.1217, -124.1292], // Sea Lion Cave
  [47.0379, -122.9007], // Olympia
];

/** Fit the initial view to the full route (runs once). */
function FitToRouteOnce({ coords }: { coords: LatLngTuple[] }) {
  const map = useMap();
  React.useEffect(() => {
    if (!coords.length) return;
    const bounds = L.latLngBounds(coords);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [coords, map]);
  return null;
}

function clearDashStyles(el: SVGPathElement) {
  el.style.removeProperty("stroke-dasharray");
  el.style.removeProperty("stroke-dashoffset");
  el.style.removeProperty("transition");
}

/** Single full polyline; Leaflet handles clipping during pan/zoom. */
function FullRoute({ route }: { route: LatLngTuple[] }) {
  const map = useMap();
  const animatedOnce = React.useRef(false);
  const pathElRef = React.useRef<SVGPathElement | null>(null);

  // Safety: if a zoom starts, nuke any dash styles that could interfere afterwards.
  React.useEffect(() => {
    const onZoomStart = () => {
      const el = pathElRef.current;
      if (el) clearDashStyles(el);
    };
    map.on("zoomstart", onZoomStart);
    return () => {
      map.off("zoomstart", onZoomStart);
    };
  }, [map]);

  return (
    <Polyline
      positions={route}
      pathOptions={{
        weight: 5,
        lineCap: "round",
        opacity: 1,
        color: "#ef476f",
        // Leaflet clips vectors by default; we want the default (noClip: false)
      }}
      eventHandlers={{
        add: (e: L.LeafletEvent) => {
          const el = (e.target as L.Polyline).getElement() as SVGPathElement | null;
          if (!el) return;
          pathElRef.current = el;

          // Run the draw animation only once, then remove the dash styles
          if (animatedOnce.current) {
            // If re-added after zoom, ensure styles are clean
            clearDashStyles(el);
            return;
          }

          requestAnimationFrame(() => {
            try {
              const total = el.getTotalLength?.();
              if (!total || !isFinite(total)) return;

              // apply dash animation
              el.style.strokeDasharray = `${total}`;
              el.style.strokeDashoffset = `${total}`;
              // force reflow
              void el.getBoundingClientRect();
              el.style.transition = "stroke-dashoffset 1200ms ease";
              el.style.strokeDashoffset = "0";

              // after the animation, remove dash styles so future zoom/pan is stable
              const onDone = () => {
                clearDashStyles(el);
                el.removeEventListener("transitionend", onDone);
              };
              el.addEventListener("transitionend", onDone);

              animatedOnce.current = true;
            } catch {
              // if anything goes wrong, make sure styles are cleared
              clearDashStyles(el);
            }
          });
        },
        remove: () => {
          // keep a clean slate if Leaflet removes/re-adds the layer
          const el = pathElRef.current;
          if (el) clearDashStyles(el);
        },
      }}
    />
  );
}

export default function TripMap() {
  return (
    <div className="h-[60vh] overflow-hidden rounded-2xl border border-gray-200">
      <MapContainer
        className="h-full w-full"
        center={[34.5, -112] as LatLngTuple}
        zoom={6}
        //scrollWheelZoom
        // default renderer is SVG (needed for the path animation)
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitToRouteOnce coords={ROUTE} />
        <FullRoute route={ROUTE} />
      </MapContainer>
    </div>
  );
}
