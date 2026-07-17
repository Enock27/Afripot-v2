import type { GalleryItem } from "@/data/galleryData";

const API = "/api/gallery";

export async function fetchGallery(): Promise<GalleryItem[]> {
  const res = await fetch(API, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load gallery (${res.status})`);
  return res.json() as Promise<GalleryItem[]>;
}

export async function persistGallery(items: GalleryItem[]): Promise<void> {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Save failed (${res.status})`);
  }
}
