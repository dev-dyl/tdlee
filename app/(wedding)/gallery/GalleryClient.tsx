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

type Props = { items: GalleryItem[] };

// overlay frame
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full w-full rounded-[18px]">
      {/* Image layer */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-[18px]">
        {children}
      </div>

      {/* Mat + inner border overlays (sit ABOVE the image) */}
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-[18px]"
        style={{
          // two inset borders = mat + frame lip
          boxShadow:
            "inset 0 0 0 6px #f8f5ef, inset 0 0 0 12px #d7c9b2",
        }}
      />

      {/* Subtle glass/shine overlay */}
      <div className="pointer-events-none absolute inset-0 z-20 rounded-[18px] bg-gradient-to-br from-white/20 to-black/10 mix-blend-overlay" />

      {/* Outer ring & soft drop for definition */}
      <div className="pointer-events-none absolute inset-0 z-20 rounded-[18px] ring-1 ring-black/10 shadow-[0_1px_3px_rgba(0,0,0,.25)]" />
    </div>
  );
}



const renderFramedPhoto = (
  { onClick }: { onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement> },
  { photo, width, height }: { photo: Photo; width: number; height: number }
) => {
  const blur = (photo as any).blurDataURL as string | undefined;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ width: Math.round(width), height: Math.round(height), position: "relative" }}
      className="block cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-wedding-plum/60 rounded-2xl"
      aria-label={photo.alt || "Open photo"}
    >
      <Frame>
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

export default function GalleryClient({ items }: Props) {
  const [index, setIndex] = React.useState<number>(-1);

  const photos = React.useMemo<Photo[]>(
    () =>
      items.map(({ src, width, height, alt, blurDataURL }) => ({
        src,
        width,
        height,
        alt,
        blurDataURL, // keep it on the object so render.photo can access it
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
        render={{ photo: renderFramedPhoto }}
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