import type { Event } from "@/data/eventsData";

const API     = "/api/events";
const UPLOAD  = "/api/events/upload";

export async function fetchEvents(): Promise<Event[]> {
  const res = await fetch(API, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load events (${res.status})`);
  return res.json() as Promise<Event[]>;
}

export async function persistEvents(items: Event[]): Promise<void> {
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

/** Upload an image file to Supabase Storage and return its public URL. */
export async function uploadEventImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(UPLOAD, { method: "POST", body: form });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Upload failed (${res.status})`);
  }
  const { url } = (await res.json()) as { url: string };
  return url;
}
