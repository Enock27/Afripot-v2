/**
 * src/lib/assetsStore.ts
 *
 * Resolves site-asset keys → Supabase public URLs at runtime.
 * Images are served from Supabase Storage (CDN-backed) instead of
 * being bundled into the JS/CSS output.
 *
 * Usage:
 *   import { useAssets, ASSET_KEYS } from "@/lib/assetsStore";
 *
 *   function MyComponent() {
 *     const assets = useAssets();
 *     return <img src={assets["BackgroundHero1.jpg"]} />;
 *   }
 */

import { useState } from "react";

const SUPABASE_URL = "https://jvhorkrewhqyrwutakrv.supabase.co";
const BUCKET       = "site-assets";

// ─── Build public URL directly from the bucket — no API call needed ──────────
// Supabase public bucket URLs follow a predictable pattern so we can resolve
// them synchronously without any fetch.
function bucketUrl(key: string): string {
  // Encode path segments to handle spaces and special characters
  const encodedKey = key.split("/").map(encodeURIComponent).join("/");
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodedKey}`;
}

// ─── Asset key registry ───────────────────────────────────────────────────────
// Every image that used to be imported from @/assets is listed here.
// The values are the filenames (matching what was uploaded to the bucket).
export const ASSET_KEYS = {
  // Homepage
  heroBackground:    "BackgroundHero1.jpg",
  interiorStairs:    "Afri3.jpg",
  dishPlate:         "afri2.jpg",
  suiteGarden:       "suite-garden.jpg",
  chomaImg:          "choma.jpg",
  luwomboImg:        "Chicken_Luwombo.jpg",
  tilapiaImg:        "TILAPIA.jpg",
  grillsImg:         "mixedgrills.jpg",
  riceImg:           "AfripotRice.jpg",

  // About page
  diningRoom:        "afri5.jpg",
  interior:          "afri4.jpg",

  // Menu page carousel
  fd1:               "fd1.jpg",
  fd2:               "fd2.jpg",
  fd3:               "fd3.jpg",
  fd4:               "fd4.jpg",
  localfood1:        "localfood1.jpg",
  pilau:             "pilau.jpg",

  // Logo / brand (used everywhere)
  logo:              "AfriPot_logo2.png",
  staffordLogo:      "STAFFORD COFFEE BREWERS LOGO.png",
  anithaLogo:        "Anitha.png",

  // Events default images
  afroMusic1:        "AfroMusic1.jpg",
  afroMusic2:        "AfroMusic2.jpg",
  eventBanner1:      "eventBannerUI/eventBanner1.jpg",

  // Misc
  hero2:             "hero2.jpg",
  hero3:             "hero3.jpg",
  afri1:             "afri1.jpg",
} as const;

export type AssetKey = keyof typeof ASSET_KEYS;

// ─── Synchronous URL resolver (no loading state needed) ───────────────────────
// Since the bucket is public, URLs are deterministic — no fetch required.
// Components can call getAssetUrl() directly in render without any async.
export function getAssetUrl(key: AssetKey): string {
  return bucketUrl(ASSET_KEYS[key]);
}

// ─── Prebuilt map (object) for components that need multiple images ────────────
type AssetMap = Record<AssetKey, string>;

let _cachedMap: AssetMap | null = null;

export function getAssets(): AssetMap {
  if (_cachedMap) return _cachedMap;
  _cachedMap = Object.fromEntries(
    (Object.keys(ASSET_KEYS) as AssetKey[]).map(k => [k, getAssetUrl(k)])
  ) as AssetMap;
  return _cachedMap;
}

// ─── React hook (returns stable reference) ───────────────────────────────────
export function useAssets(): AssetMap {
  const [assets] = useState<AssetMap>(() => getAssets());
  return assets;
}
