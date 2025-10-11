// app/api/gdrive/image/[id]/route.ts
export const runtime = "nodejs";

type RouteCtx = { params: Promise<{ id: string }> };

function isImageContent(res: Response) {
  const ct = res.headers.get("content-type") || "";
  return ct.startsWith("image/");
}

export async function GET(req: Request, ctx: RouteCtx) {
  const { id } = await ctx.params;
  const key = process.env.GOOGLE_API_KEY;
  if (!id) return new Response("Missing id", { status: 400 });
  if (!key) return new Response("Missing GOOGLE_API_KEY", { status: 500 });

  // Prefer explicit origin for Google's HTTP referrer checks
  const devOrigin = "http://localhost:3000";
  const prodOrigin = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;
  const referer = prodOrigin || devOrigin;

  // 1) Drive API (needs API key + acceptable Referer)
  const apiUrl = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(
    id
  )}?alt=media&key=${encodeURIComponent(key)}`;

  let upstream = await fetch(apiUrl, {
    cache: "no-store",
    headers: { Referer: referer },
    redirect: "follow",
  });

  // If blocked or not an image, try the public "uc" download
  if (!upstream.ok || !isImageContent(upstream)) {
    // 2) Public fallback (works for public files without API key)
    const publicUrl = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`;
    upstream = await fetch(publicUrl, {
      cache: "no-store",
      redirect: "follow",
      // Some deployments like a Referer here too; harmless to include
      headers: { Referer: referer },
    });
    if (!upstream.ok || !isImageContent(upstream)) {
      const msg = await upstream.text().catch(() => "");
      return new Response(msg || "Upstream error", { status: upstream.status || 502 });
    }
  }

  const headers = new Headers();
  headers.set("Content-Type", upstream.headers.get("content-type") || "application/octet-stream");
  const etag = upstream.headers.get("etag");
  const len = upstream.headers.get("content-length");
  if (etag) headers.set("ETag", etag);
  if (len) headers.set("Content-Length", len);

  // Cache at the edge (SWR). Adjust if you want longer/shorter.
  headers.set("Cache-Control", "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800");

  return new Response(upstream.body, { status: 200, headers });
}
