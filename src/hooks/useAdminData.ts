import { useState, useEffect, useCallback, useRef } from "react";
import type { GalleryItem } from "@/data/galleryData";
import type { Event } from "@/data/eventsData";
import type { MenuItem, MenuSection } from "@/data/menuData";
import eventsJson from "@/data/eventsData.json";
import { defaultMenuSections } from "@/data/menuData";
import { fetchGallery, persistGallery } from "@/lib/galleryStore";

// ─── localStorage keys (events + menu) ───────────────────────────────────────
const EVENTS_KEY = "afripot_events";
const MENU_KEY   = "afripot_menu";

// ─── in-process pub/sub (instant same-tab updates) ───────────────────────────
type Listener = () => void;
const galleryListeners = new Set<Listener>();

function notifyGallery() { galleryListeners.forEach(fn => fn()); }

export function subscribeGallery(fn: Listener): () => void {
  galleryListeners.add(fn);
  return () => galleryListeners.delete(fn);
}

// ─── localStorage helpers (events + menu) ────────────────────────────────────
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

function trySaveLocal(key: string, value: unknown): string | null {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new StorageEvent("storage", { key, storageArea: localStorage }));
    return null;
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError")
      return "Storage full. Please delete some items first.";
    return "Failed to save. Please try again.";
  }
}

// ─── admin hook ───────────────────────────────────────────────────────────────

export function useAdminData() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [events,  setEvents]  = useState<Event[]>([]);
  const [menu,    setMenu]    = useState<MenuSection[]>([]);
  const [ready,   setReady]   = useState(false);

  useEffect(() => {
    setEvents(loadEvents());
    setMenu(loadMenu());
    fetchGallery().then(items => {
      setGallery(items);
      setReady(true);
    });
  }, []);

  const saveGallery = useCallback(async (items: GalleryItem[]): Promise<string | null> => {
    try {
      await persistGallery(items);
      setGallery(items);
      notifyGallery(); // instant update for any mounted public gallery
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : String(e);
    }
  }, []);

  const saveEvents = useCallback((items: Event[]): string | null => {
    const err = trySaveLocal(EVENTS_KEY, items);
    if (!err) setEvents(items);
    return err;
  }, []);

  const saveMenu = useCallback((sections: MenuSection[]): string | null => {
    const err = trySaveLocal(MENU_KEY, sections);
    if (!err) setMenu(sections);
    return err;
  }, []);

  return { gallery, events, menu, saveGallery, saveEvents, saveMenu, ready };
}

// ─── public gallery hook ──────────────────────────────────────────────────────

export function usePublicGallery(): { items: GalleryItem[]; loading: boolean; error: string | null } {
  const [items,   setItems]   = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const mountedRef = useRef(true);

  const load = useCallback(() => {
    fetchGallery().then(data => {
      if (mountedRef.current) { setItems(data); setError(null); setLoading(false); }
    }).catch(e => {
      if (mountedRef.current) { setError(String(e)); setLoading(false); }
    });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    load();

    // Same-tab instant update when admin saves
    const unsub = subscribeGallery(load);

    // Cross-tab update — not needed for API-based store, but keep for safety
    function onStorage(_e: StorageEvent) { /* no-op */ }
    window.addEventListener("storage", onStorage);

    // Re-sync when user navigates back to this page/tab
    function onVisible() {
      if (document.visibilityState === "visible") load();
    }
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      mountedRef.current = false;
      unsub();
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  return { items, loading, error };
}

// ─── public events hook ───────────────────────────────────────────────────────

export function usePublicEvents(): Event[] {
  const [items, setItems] = useState<Event[]>(() => loadEvents());

  useEffect(() => {
    setItems(loadEvents());
    function onStorage(e: StorageEvent) {
      if (e.key === EVENTS_KEY) setItems(loadEvents());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return items;
}

// ─── public menu hook ─────────────────────────────────────────────────────────

export function usePublicMenu(): MenuSection[] {
  const [sections, setSections] = useState<MenuSection[]>(() => loadMenu());

  useEffect(() => {
    setSections(loadMenu());
    function onStorage(e: StorageEvent) {
      if (e.key === MENU_KEY) setSections(loadMenu());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return sections;
}
