// app/api/gallery/list/route.ts
import { listPublicDriveImages } from "@/lib/gdrive-public";

export const runtime = "nodejs";

export async function GET() {
  try {
    const items = await listPublicDriveImages({ orderBy: "createdTime desc" });
    // Small payload: only what the gallery needs
    return Response.json({ items });
  } catch (e: any) {
    return new Response(e?.message || "Failed to list images", { status: 500 });
  }
}
