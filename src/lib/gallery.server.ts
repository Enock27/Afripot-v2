import { GalleryItem } from "@/data/galleryData";
import galleryJson from "@/data/galleryData.json";

/**
 * Returns gallery items from the static JSON file bundled at build time.
 * No Node.js fs/path — safe for Hostinger shared (static) hosting.
 */
export async function getGallery(): Promise<GalleryItem[]> {
  return galleryJson as GalleryItem[];
}

/**
 * No-op on static hosting — changes cannot be persisted without a server.
 */
export async function updateGallery(_items: GalleryItem[]): Promise<{ success: boolean }> {
  console.warn("updateGallery: no-op on static hosting.");
  return { success: false };
}

/**
 * No-op on static hosting — file uploads require a server.
 */
export async function uploadImage(
  _payload: { fileName: string; base64Data: string }
): Promise<{ success: boolean; url: string }> {
  console.warn("uploadImage: no-op on static hosting.");
  return { success: false, url: "" };
}
