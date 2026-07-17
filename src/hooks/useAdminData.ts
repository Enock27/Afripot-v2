import { useState, useEffect, useCallback } from "react";
import type { GalleryItem } from "@/data/galleryData";
import type { Event } from "@/data/eventsData";
import type { MenuItem, MenuSection } from "@/data/menuData";
import galleryJson from "@/data/galleryData.json";
import eventsJson from "@/data/eventsData.json";
import { defaultMenuSections } from "@/data/menuData";

const GALLERY_KEY = "afripot_gallery";
const EVENTS_KEY  = "afripot_events";
const MENU_KEY    = "afripot_menu";

// ─── in-process pub/sub ───────────────────────────────────────────────────────
// StorageEvent only fires in *other* tabs. For same-tab (SPA) reactivity we
// maintain a tiny typed event bus so every subscriber updates the moment a save
// is committed — no polling, no delay.

type DataKey = typeof GALLERY_KEY | typeof EVENTS_KEY | typeof MENU_KEY;
type Listener = () => void;

const listeners = new Map<DataKey, Set<Listener>>();

function subscribe(key: DataKey, fn: Listener): () => void {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(fn);
  return () => listeners.get(key)!.delete(fn);
}

function notify(key: DataKey) {
  listeners.get(key)?.forEach(fn => fn());
}

// ─── loaders ─────────────────────────────────────────────────────────────────

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

function loadMenu(): MenuSection[] {
  try {
    const raw = localStorage.getItem(MENU_KEY);
    if (raw) return JSON.parse(raw) as MenuSection[];
  } catch {}
  return defaultMenuSections();
}

// ─── safe saver ───────────────────────────────────────────────────────────────

function trySave(key: DataKey, value: unknown): string | null {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // 1. Notify same-tab subscribers immediately via the in-process bus
    notify(key);
    // 2. Dispatch StorageEvent so *other* tabs also update
    window.dispatchEvent(new StorageEvent("storage", { key, storageArea: localStorage }));
    return null;
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      return "Storage full. Use image URLs instead of uploads, or delete some items first.";
    }
    return "Failed to save. Please try again.";
  }
}

// ─── admin hook (full CRUD) ───────────────────────────────────────────────────

export function useAdminData() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [events,  setEvents]  = useState<Event[]>([]);
  const [menu,    setMenu]    = useState<MenuSection[]>([]);
  const [ready,   setReady]   = useState(false);

  useEffect(() => {
    setGallery(loadGallery());
    setEvents(loadEvents());
    setMenu(loadMenu());
    setReady(true);
  }, []);

  const saveGallery = useCallback((items: GalleryItem[]): string | null => {
    const err = trySave(GALLERY_KEY, items);
    if (!err) setGallery(items);
    return err;
  }, []);

  const saveEvents = useCallback((items: Event[]): string | null => {
    const err = trySave(EVENTS_KEY, items);
    if (!err) setEvents(items);
    return err;
  }, []);

  const saveMenu = useCallback((sections: MenuSection[]): string | null => {
    const err = trySave(MENU_KEY, sections);
    if (!err) setMenu(sections);
    return err;
  }, []);

  return { gallery, events, menu, saveGallery, saveEvents, saveMenu, ready };
}

// ─── public hooks (read-only, for public pages) ───────────────────────────────

export function usePublicGallery(): GalleryItem[] {
  const [items, setItems] = useState<GalleryItem[]>(() => loadGallery());

  useEffect(() => {
    // Sync on mount in case localStorage changed before this component rendered
    setItems(loadGallery());

    // Same-tab updates via the in-process bus (fires instantly on admin save)
    const unsubscribe = subscribe(GALLERY_KEY, () => setItems(loadGallery()));

    // Cross-tab updates via the native StorageEvent
    function onStorage(e: StorageEvent) {
      if (e.key === GALLERY_KEY) setItems(loadGallery());
    }
    window.addEventListener("storage", onStorage);

    return () => {
      unsubscribe();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return items;
}

export function usePublicEvents(): Event[] {
  const [items, setItems] = useState<Event[]>(() => loadEvents());

  useEffect(() => {
    setItems(loadEvents());
    const unsubscribe = subscribe(EVENTS_KEY, () => setItems(loadEvents()));
    function onStorage(e: StorageEvent) {
      if (e.key === EVENTS_KEY) setItems(loadEvents());
    }
    window.addEventListener("storage", onStorage);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return items;
}

export function usePublicMenu(): MenuSection[] {
  const [sections, setSections] = useState<MenuSection[]>(() => loadMenu());

  useEffect(() => {
    setSections(loadMenu());
    const unsubscribe = subscribe(MENU_KEY, () => setSections(loadMenu()));
    function onStorage(e: StorageEvent) {
      if (e.key === MENU_KEY) setSections(loadMenu());
    }
    window.addEventListener("storage", onStorage);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return sections;
}
