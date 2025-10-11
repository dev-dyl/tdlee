// app/gallery/GalleryClient.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import PhotoAlbum, { type Photo } from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

export type GalleryItem = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt?: string;
  created?: string;
  blurDataURL?: string;
};

type Props = { items: GalleryItem[]; frames?: string[] };

/** String hash for seeding RNG (stable across SSR/CSR) */
function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h >>> 0; // unsigned
}

/** Mulberry32 PRNG for deterministic "random" */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Random choice using seeded RNG */
function seededChoice<T>(arr: T[], seedStr: string): T {
  const rng = mulberry32(hashString(seedStr));
  const idx = Math.floor(rng() * arr.length);
  return arr[Math.min(idx, arr.length - 1)];
}

/** Pick a random applicable frame by orientation; fallback to any */
function pickRandomFrame(
  frames: string[] | undefined,
  w: number,
  h: number,
  key: string
) {
  if (!frames?.length) return undefined;

  const r = w / h;
  const ORIENT =
    r > 1.05 ? "landscape" : r < 0.95 ? "portrait" : "square";

  const lower = frames.map((f) => f.toLowerCase());
  const candidates: string[] = [];

  lower.forEach((lf, i) => {
    if (lf.includes(`-${ORIENT}.png`)) candidates.push(frames[i]);
  });

  if (candidates.length > 0) {
    return seededChoice(candidates, `${key}:${ORIENT}`);
  }
  // Otherwise pick any at random (still seeded)
  return seededChoice(frames, key);
}

/** Frame component with overlay PNG */
function Frame({
  children,
  overlaySrc,
  alt = "",
  imageInsetPercent = 25, // photo smaller
  frameScalePercent = 101, // frame larger
}: {
  children: React.ReactNode;
  overlaySrc?: string;
  alt?: string;
  imageInsetPercent?: number;
  frameScalePercent?: number;
}) {
  return (
    <div className="relative h-full w-full">
      {/* Photo layer: inset so it stays tucked neatly beneath the frame */}
      <div
        className="absolute z-0 overflow-hidden"
        style={{
          inset: `${imageInsetPercent}%`,
          borderRadius: 14,
        }}
      >
        {children}
      </div>

      {/* Frame overlay: scaled up slightly to overlap the photo edges */}
      {overlaySrc && (
        <div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-visible"
          style={{
            transform: `scale(${frameScalePercent / 100})`,
            transformOrigin: "center center",
          }}
        >
          <Image
            src={overlaySrc}
            alt={alt}
            fill
            className="object-contain"
            priority={false}
          />
        </div>
      )}
    </div>
  );
}

const renderFramedPhoto =
  (frames?: string[]) =>
  (
    { onClick }: { onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement> },
    { photo, width, height }: { photo: Photo; width: number; height: number }
  ) => {
    const blur = (photo as any).blurDataURL as string | undefined;
    const id = (photo as any).id as string | undefined;

    const overlay = pickRandomFrame(
      frames,
      photo.width!,
      photo.height!,
      id || (photo.src as string)
    );

    return (
      <button
        type="button"
        onClick={onClick}
        style={{ width: Math.round(width), height: Math.round(height), position: "relative" }}
        className="block cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-wedding-plum/60 rounded-2xl"
        aria-label={photo.alt || "Open photo"}
      >
        <Frame overlaySrc={overlay} imageInsetPercent={10}>
          <Image
            src={photo.src as string}
            alt={photo.alt || ""}
            fill
            sizes={`${Math.ceil(width)}px`}
            className="object-cover transition-transform overflow-hidden duration-300 hover:scale-[1.02]"
            placeholder={blur ? "blur" : "empty"}
            blurDataURL={blur}
          />
        </Frame>
      </button>
    );
  };


export default function GalleryClient({ items, frames }: Props) {
  const [index, setIndex] = React.useState<number>(-1);

  const photos = React.useMemo<Photo[]>(
    () =>
      items.map(({ id, src, width, height, alt, blurDataURL }) => ({
        id,
        src,
        width,
        height,
        alt,
        blurDataURL,
      })),
    [items]
  );

  const slides = React.useMemo(
    () => items.map(({ src, width, height, alt }) => ({ src, width, height, alt })),
    [items]
  );

  return (
    <>
      <PhotoAlbum
        photos={photos}
        layout="masonry"
        spacing={16}
        padding={0}
        columns={(containerWidth) => {
          if (containerWidth < 480) return 1;
          if (containerWidth < 900) return 2;
          if (containerWidth < 1200) return 3;
          return 4;
        }}
        render={{ photo: renderFramedPhoto(frames) }}
        onClick={({ index: i }) => setIndex(i)}
      />

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
        plugins={[Thumbnails]}
        styles={{ container: { backgroundColor: "rgba(20,16,18,0.95)" } }}
      />
    </>
  );
}