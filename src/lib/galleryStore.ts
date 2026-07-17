// Gallery store — reads from and writes to the Netlify Function API,
// which proxies to Supabase. No localStorage, works across all devices.

import type { GalleryItem } from "@/data/galleryData";

const API = "/api/gallery";

// The admin secret must match ADMIN_SECRET in your Netlify environment variables.
// It is baked in at build time via VITE_ADMIN_SECRET so it stays out of the repo.
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET as string ?? "";

export async function fetchGallery(): Promise<GalleryItem[]> {
  const res = await fetch(API, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load gallery (${res.status})`);
  return res.json() as Promise<GalleryItem[]>;
}

export async function persistGallery(items: GalleryItem[]): Promise<void> {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": ADMIN_SECRET,
    },
    body: JSON.stringify(items),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Save failed (${res.status})`);
  }
}
