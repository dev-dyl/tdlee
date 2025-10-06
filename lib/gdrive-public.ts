// lib/gdrive-public.ts
// Public-folder listing using a simple API key.
// Works when the folder is "Anyone with the link (Viewer)".

export type DriveImage = {
  id: string;
  name: string;
  width: number;
  height: number;
  mimeType: string;
  createdTime?: string;
  src: string;        // resolved to your proxy route
  thumb?: string;     // optional (Drive thumbnailLink, not proxied)
};

type ListOpts = {
  pageSize?: number;       // default 200 (max 1000)
  orderBy?: string;        // e.g. "createdTime desc", "name"
  folderId?: string;       // overrides env
};

/**
 * Lists images inside a public Drive folder.
 * Requires: GOOGLE_API_KEY, GDRIVE_FOLDER_ID
 */
export async function listPublicDriveImages(opts: ListOpts = {}): Promise<DriveImage[]> {
  const folderId = opts.folderId ?? process.env.GDRIVE_FOLDER_ID!;
  const key = process.env.GOOGLE_API_KEY!;
  if (!folderId) throw new Error("Missing GDRIVE_FOLDER_ID");
  if (!key) throw new Error("Missing GOOGLE_API_KEY");

  const pageSize = Math.min(Math.max(opts.pageSize ?? 200, 1), 1000);
  const base = "https://www.googleapis.com/drive/v3/files";

  const q =
    `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`;

  const fields =
    "nextPageToken,files(id,name,mimeType,createdTime,imageMediaMetadata(width,height),thumbnailLink)";

  let nextPageToken: string | undefined;
  const items: DriveImage[] = [];

  do {
    const params = new URLSearchParams({
      q,
      key,
      pageSize: String(pageSize),
      fields,
      supportsAllDrives: "true",           // harmless for My Drive, helpful if on a shared drive
      includeItemsFromAllDrives: "true",
    });
    if (opts.orderBy) params.set("orderBy", opts.orderBy);
    if (nextPageToken) params.set("pageToken", nextPageToken);

    const url = `${base}?${params.toString()}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Drive list failed (${res.status}): ${text || res.statusText}`);
    }

    const data = (await res.json()) as {
      nextPageToken?: string;
      files?: Array<{
        id: string;
        name: string;
        mimeType: string;
        createdTime?: string;
        thumbnailLink?: string;
        imageMediaMetadata?: { width?: number; height?: number };
      }>;
    };

    (data.files ?? []).forEach((f) => {
      const width = f.imageMediaMetadata?.width ?? 0;
      const height = f.imageMediaMetadata?.height ?? 0;
      if (!width || !height) return; // ignore non-images / missing metadata

      items.push({
        id: f.id,
        name: f.name,
        mimeType: f.mimeType,
        createdTime: f.createdTime,
        width,
        height,
        src: `/api/gdrive/image/${encodeURIComponent(f.id)}`, // use our proxy
        thumb: f.thumbnailLink, // optional (not proxied)
      });
    });

    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return items;
}
