// app/gallery/page.tsx
import { listPublicDriveImages } from "@/lib/gdrive-public";
import { toDataURL } from "@/lib/blur";
import GalleryClient from "./GalleryClient";

import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const revalidate = 3600; // 1h ISR

export default async function GalleryPage() {
  const driveItems = await listPublicDriveImages({
    orderBy: "createdTime desc",
    pageSize: 200,
  });

  // Load frame image paths from /public/frames
  let framePaths: string[] = [];
  try {
    const dir = path.join(process.cwd(), "public", "frames");
    const files = await fs.readdir(dir);
    framePaths = files
      .filter((f) => f.toLowerCase().endsWith(".png"))
      .map((f) => `/frames/${f}`);
  } catch {
    // If folder missing, just continue with no frames.
  }

  const MAX_BLURS = 40;
  const items = await Promise.all(
    driveItems.map(async (f, i) => {
      const blur = i < MAX_BLURS && f.thumb ? await toDataURL(f.thumb) : undefined;
      return {
        id: f.id,
        src: f.src,
        width: f.width,
        height: f.height,
        alt: f.name,
        created: f.createdTime ?? undefined,
        blurDataURL: blur,
      };
    })
  );

  return (
    <div className="mx-auto w-[min(1600px,92%)]">
      <GalleryClient items={items} frames={framePaths} />
    </div>
  );
}
