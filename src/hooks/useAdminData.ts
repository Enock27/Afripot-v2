import { useState, useEffect, useCallback, useRef } from "react";
import type { GalleryItem } from "@/data/galleryData";
import type { Event } from "@/data/eventsData";
import type { MenuItem, MenuSection } from "@/data/menuData";
import { defaultMenuSections } from "@/data/menuData";
import { fetchGallery, persistGallery } from "@/lib/galleryStore";
import { fetchEvents, persistEvents, uploadEventImage } from "@/lib/eventsStore";

// ─── localStorage key (menu only — events now live in Supabase) ───────────────
const MENU_KEY = "afripot_menu";

// ─── in-process pub/sub (instant same-tab updates) ───────────────────────────
type Listener = () => void;
const galleryListeners = new Set<Listener>();
const eventsListeners  = new Set<Listener>();

function notifyGallery() { galleryListeners.forEach(fn => fn()); }
function notifyEvents()  { eventsListeners.forEach(fn => fn()); }

export function subscribeGallery(fn: Listener): () => void {
  galleryListeners.add(fn);
  return () => galleryListeners.delete(fn);
}
export function subscribeEvents(fn: Listener): () => void {
  eventsListeners.add(fn);
  return () => eventsListeners.delete(fn);
}

// ─── localStorage helpers (menu only) ────────────────────────────────────────
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
    setMenu(loadMenu());

    // Load gallery and events in parallel.
    // Either can fail gracefully — we still set ready=true so the admin page loads.
    Promise.allSettled([
      fetchGallery().then(items => setGallery(items)),
      fetchEvents().then(items => setEvents(items)),
    ]).finally(() => {
      setReady(true);
    });
  }, []);

  // ── gallery ──
  const saveGallery = useCallback(async (items: GalleryItem[]): Promise<string | null> => {
    try {
      await persistGallery(items);
      setGallery(items);
      notifyGallery();
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : String(e);
    }
  }, []);

  // ── events ──
  const saveEvents = useCallback(async (items: Event[]): Promise<string | null> => {
    try {
      await persistEvents(items);
      setEvents(items);
      notifyEvents();
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : String(e);
    }
  }, []);

  const uploadImage = useCallback(async (file: File): Promise<{ url: string; error: string | null }> => {
    try {
      const url = await uploadEventImage(file);
      return { url, error: null };
    } catch (e) {
      return { url: "", error: e instanceof Error ? e.message : String(e) };
    }
  }, []);

  // ── menu ──
  const saveMenu = useCallback((sections: MenuSection[]): string | null => {
    const err = trySaveLocal(MENU_KEY, sections);
    if (!err) setMenu(sections);
    return err;
  }, []);

  return { gallery, events, menu, saveGallery, saveEvents, saveMenu, uploadImage, ready };
}

// ─── public gallery hook ──────────────────────────────────────────────────────

export function usePublicGallery(): { items: GalleryItem[]; loading: boolean; error: string | null } {
  const [items,   setItems]   = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const mountedRef = useRef(true);

  const load = useCallback(() => {
    fetchGallery()
      .then(data => {
        if (mountedRef.current) { setItems(data); setError(null); setLoading(false); }
      })
      .catch(e => {
        if (mountedRef.current) { setError(String(e)); setLoading(false); }
      });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    load();

    const unsub = subscribeGallery(load);

    function onVisible() {
      if (document.visibilityState === "visible") load();
    }
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      mountedRef.current = false;
      unsub();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  return { items, loading, error };
}

// ─── public events hook ───────────────────────────────────────────────────────

export function usePublicEvents(): { items: Event[]; loading: boolean; error: string | null } {
  const [items,   setItems]   = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const mountedRef = useRef(true);

  const load = useCallback(() => {
    fetchEvents()
      .then(data => {
        if (mountedRef.current) { setItems(data); setError(null); setLoading(false); }
      })
      .catch(e => {
        if (mountedRef.current) { setError(String(e)); setLoading(false); }
      });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    load();

    // Re-fetch when admin saves (same tab)
    const unsub = subscribeEvents(load);

    // Re-fetch when user navigates back to this tab
    function onVisible() {
      if (document.visibilityState === "visible") load();
    }
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      mountedRef.current = false;
      unsub();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  return { items, loading, error };
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
