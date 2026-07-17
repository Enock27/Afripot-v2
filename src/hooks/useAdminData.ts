import { useState, useEffect, useCallback } from "react";
import type { GalleryItem } from "@/data/galleryData";
import type { Event } from "@/data/eventsData";
import galleryJson from "@/data/galleryData.json";
import eventsJson from "@/data/eventsData.json";

const GALLERY_KEY = "afripot_gallery";
const EVENTS_KEY = "afripot_events";

function loadGallery(): GalleryItem[] {
  try {
    const raw = localStorage.getItem(GALLERY_KEY);
    if (raw) return JSON.parse(raw) as GalleryItem[];
  } catch {}
  return galleryJson as GalleryItem[];
}

function loadEvents(): Event[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    if (raw) return JSON.parse(raw) as Event[];
  } catch {}
  return eventsJson as Event[];
}

export function useAdminData() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setGallery(loadGallery());
    setEvents(loadEvents());
    setReady(true);
  }, []);

  const saveGallery = useCallback((items: GalleryItem[]) => {
    localStorage.setItem(GALLERY_KEY, JSON.stringify(items));
    setGallery(items);
  }, []);

  const saveEvents = useCallback((items: Event[]) => {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(items));
    setEvents(items);
  }, []);

  return { gallery, events, saveGallery, saveEvents, ready };
}

/** Used by gallery.tsx and events.tsx (read-only, no setters needed) */
export function usePublicGallery(): GalleryItem[] {
  const [items, setItems] = useState<GalleryItem[]>(galleryJson as GalleryItem[]);
  useEffect(() => { setItems(loadGallery()); }, []);
  return items;
}

export function usePublicEvents(): Event[] {
  const [items, setItems] = useState<Event[]>(eventsJson as Event[]);
  useEffect(() => { setItems(loadEvents()); }, []);
  return items;
}
