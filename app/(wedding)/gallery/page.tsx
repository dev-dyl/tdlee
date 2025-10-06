import { listPublicDriveImages } from "@/lib/gdrive-public";
import { toDataURL } from "@/lib/blur";
import GalleryClient from "./GalleryClient";

export const runtime = "nodejs";
export const revalidate = 3600; // 1h ISR

export default async function GalleryPage() {
  const driveItems = await listPublicDriveImages({
    orderBy: "createdTime desc",
    pageSize: 200,
  });

  const MAX_BLURS = 40;

  const items = await Promise.all(
    driveItems.map(async (f, i) => {
      const blur =
        i < MAX_BLURS && f.thumb ? await toDataURL(f.thumb) : undefined;

      return {
        id: f.id,
        src: f.src,              // /api/gdrive/image/<id>
        width: f.width,
        height: f.height,
        alt: f.name,
        created: f.createdTime ?? undefined,
        blurDataURL: blur,       // <-- new
      };
    })
  );

  return (
    <div className="mx-auto w-[min(1600px,92%)] py-10">
      <GalleryClient items={items} />
    </div>
  );
}
