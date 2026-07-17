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

// ─── safe saver — returns error string or null ────────────────────────────────

function trySave(key: string, value: unknown): string | null {
  try {
    localStorage.setItem(key, JSON.stringify(value));
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
  const [gallery,  setGallery]  = useState<GalleryItem[]>([]);
  const [events,   setEvents]   = useState<Event[]>([]);
  const [menu,     setMenu]     = useState<MenuSection[]>([]);
  const [ready,    setReady]    = useState(false);

  useEffect(() => {
    setGallery(loadGallery());
    setEvents(loadEvents());
    setMenu(loadMenu());
    setReady(true);
  }, []);

  /** Returns an error string on failure, null on success */
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
  const [items, setItems] = useState<GalleryItem[]>(galleryJson as GalleryItem[]);
  useEffect(() => { setItems(loadGallery()); }, []);
  return items;
}

export function usePublicEvents(): Event[] {
  const [items, setItems] = useState<Event[]>(eventsJson as Event[]);
  useEffect(() => { setItems(loadEvents()); }, []);
  return items;
}

export function usePublicMenu(): MenuSection[] {
  const [sections, setSections] = useState<MenuSection[]>(() => defaultMenuSections());
  useEffect(() => { setSections(loadMenu()); }, []);
  return sections;
}
