"use client";

import * as React from "react";
import { MapContainer, TileLayer, Polyline, useMap, useMapEvents } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

/** Replace with your real route in [lat, lng] pairs */
const ROUTE: LatLngTuple[] = [
  [33.4483, -112.0740], // Phoenix

  [33.8125, -117.9189], // Disney

  [32.7157, -117.1610], // San Diego

  [34.0549, -118.2426], // LA

  [37.7749, -122.4194], // SF
  [47.0379, -122.9007], // Olympia
];

/** Clip a polyline to the current map viewport in lat/lng space (Cohen–Sutherland). */
function clipRouteToViewport(route: LatLngTuple[], map: L.Map): LatLngTuple[][] {
  if (route.length < 2) return [];

  const b = map.getBounds(); // LatLngBounds
  const south = b.getSouth(); // min lat
  const north = b.getNorth(); // max lat
  const west  = b.getWest();  // min lng
  const east  = b.getEast();  // max lng

  // NOTE: if your map can cross the antimeridian, add wrap handling here.

  const INSIDE = 0, LEFT = 1, RIGHT = 2, BOTTOM = 4, TOP = 8;
  const code = (lat: number, lng: number) => {
    let c = INSIDE;
    if (lng < west) c |= LEFT; else if (lng > east) c |= RIGHT;
    if (lat < south) c |= BOTTOM; else if (lat > north) c |= TOP;
    return c;
  };

  function clipSegment(a: LatLngTuple, b: LatLngTuple): [LatLngTuple, LatLngTuple] | null {
    let [lat0, lng0] = a, [lat1, lng1] = b;
    let c0 = code(lat0, lng0), c1 = code(lat1, lng1);

    while (true) {
      if (!(c0 | c1)) return [[lat0, lng0], [lat1, lng1]]; // both inside
      if (c0 & c1)   return null;                           // both outside same side

      const co = c0 ? c0 : c1;
      let lat = 0, lng = 0;

      if (co & TOP) {
        lng = lng0 + (lng1 - lng0) * (north - lat0) / (lat1 - lat0);
        lat = north;
      } else if (co & BOTTOM) {
        lng = lng0 + (lng1 - lng0) * (south - lat0) / (lat1 - lat0);
        lat = south;
      } else if (co & RIGHT) {
        lat = lat0 + (lat1 - lat0) * (east - lng0) / (lng1 - lng0);
        lng = east;
      } else {
        // LEFT
        lat = lat0 + (lat1 - lat0) * (west - lng0) / (lng1 - lng0);
        lng = west;
      }

      if (co === c0) { lat0 = lat; lng0 = lng; c0 = code(lat0, lng0); }
      else           { lat1 = lat; lng1 = lng; c1 = code(lat1, lng1); }
    }
  }

  // Build visible segments
  const segments: LatLngTuple[][] = [];
  let current: LatLngTuple[] = [];

  for (let i = 0; i < route.length - 1; i++) {
    const clipped = clipSegment(route[i], route[i + 1]);
    if (clipped) {
      const [aa, bb] = clipped;
      if (current.length === 0) current.push(aa);
      current.push(bb);
    } else if (current.length > 0) {
      segments.push(current);
      current = [];
    }
  }
  if (current.length > 0) segments.push(current);

  return segments;
}

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

/**
 * Render the route clipped to viewport.
 * Animate ONLY on the very first batch of mounted polylines, then never again.
 * Recompute segments continuously while moving/zooming (rAF-throttled) so the line never “falls behind”.
 */
function ClippedRoute({ route }: { route: LatLngTuple[] }) {
  const map = useMap();
  const [segments, setSegments] = React.useState<LatLngTuple[][]>([]);
  const shouldAnimateRef = React.useRef(true);        // ← one-shot animation gate
  const disableScheduledRef = React.useRef(false);    // one-tick disabler to let the first batch all animate
  const rafIdRef = React.useRef<number | null>(null); // rAF throttle

  const recomputeNow = React.useCallback(() => {
    setSegments(clipRouteToViewport(route, map));
  }, [route, map]);

  const scheduleRecompute = React.useCallback(() => {
    if (rafIdRef.current != null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      recomputeNow();
    });
  }, [recomputeNow]);

  // Compute after map fully loads (so bounds are correct after fitBounds)
  React.useEffect(() => {
    const onLoad = () => scheduleRecompute();
    map.once("load", onLoad);
    return () => { map.off("load", onLoad); if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current); };
  }, [map, scheduleRecompute]);

  // Also recompute continuously during interaction (move/zoom/resize)
  useMapEvents({
    move: scheduleRecompute,
    zoom: scheduleRecompute,
    resize: scheduleRecompute,
  });

  return (
    <>
      {segments.map((seg, idx) => (
        <Polyline
          key={`seg-${idx}`}
          positions={seg}
          pathOptions={{
            weight: 5,
            lineCap: "round",
            opacity: 1,
            color: "#ef476f",
          }}
          eventHandlers={{
            add: (e: L.LeafletEvent) => {
              if (!shouldAnimateRef.current) return; // only on very first mount

              const layer = e.target as L.Polyline;
              const el = layer.getElement() as SVGPathElement | null;
              if (!el || !el.getTotalLength) return;

              requestAnimationFrame(() => {
                const total = el.getTotalLength();
                if (!total) return;
                el.style.strokeDasharray = `${total}`;
                el.style.strokeDashoffset = `${total}`;
                // force reflow
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                el.getBoundingClientRect();
                el.style.transition = "stroke-dashoffset 1200ms ease";
                el.style.strokeDashoffset = "0";
              });

              // Allow all “first-batch” polylines to animate, then disable forever
              if (!disableScheduledRef.current) {
                disableScheduledRef.current = true;
                setTimeout(() => { shouldAnimateRef.current = false; }, 0);
              }
            },
          }}
        />
      ))}
    </>
  );
}

export default function TripMap() {
  return (
    <div className="h-[60vh] overflow-hidden rounded-2xl border border-gray-200">
      <MapContainer
        className="h-full w-full"
        center={[34.5, -112] as LatLngTuple}
        zoom={6}
        scrollWheelZoom
        // Default SVG renderer (needed for the stroke-dash animation)
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitToRouteOnce coords={ROUTE} />
        <ClippedRoute route={ROUTE} />
      </MapContainer>
    </div>
  );
}