/**
 * scripts/upload-assets.mjs
 *
 * One-time script: uploads every image in src/assets/ to Supabase Storage
 * bucket "site-assets", then upserts a row in the "assets" table so the
 * app can resolve key → public URL at runtime without bundling the files.
 *
 * Usage:
 *   node scripts/upload-assets.mjs
 *
 * Requires env vars (reads from .env automatically via --env-file or dotenv):
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname, basename } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { config } from "dotenv";

// Load .env
config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = join(__dirname, "../src/assets");
const BUCKET = "site-assets";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ALLOWED_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);

// Mime type map
const MIME = {
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png":  "image/png",
  ".webp": "image/webp",
  ".gif":  "image/gif",
  ".svg":  "image/svg+xml",
};

/** Recursively collect image files from a directory */
function collectImages(dir, prefix = "") {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...collectImages(fullPath, prefix ? `${prefix}/${entry}` : entry));
    } else {
      const ext = extname(entry).toLowerCase();
      if (ALLOWED_EXTS.has(ext)) {
        files.push({ fullPath, key: prefix ? `${prefix}/${entry}` : entry });
      }
    }
  }
  return files;
}

async function main() {
  console.log(`\n🔍 Scanning ${ASSETS_DIR} for images…\n`);
  const images = collectImages(ASSETS_DIR);
  console.log(`Found ${images.length} images. Starting upload to bucket "${BUCKET}"…\n`);

  let uploaded = 0;
  let skipped = 0;
  let errors = 0;

  for (const { fullPath, key } of images) {
    const ext = extname(key).toLowerCase();
    const contentType = MIME[ext] ?? "application/octet-stream";
    const fileBuffer = readFileSync(fullPath);
    const sizeKB = Math.round(fileBuffer.length / 1024);

    // Upload to Storage (upsert so re-running is safe)
    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(key, fileBuffer, { contentType, upsert: true });

    if (uploadErr) {
      console.error(`  ❌ ${key} (${sizeKB} KB) — ${uploadErr.message}`);
      errors++;
      continue;
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(key);
    const publicUrl = urlData.publicUrl;

    // Upsert into assets table
    const { error: dbErr } = await supabase.from("assets").upsert(
      { key, url: publicUrl, alt: basename(key, extname(key)).replace(/[-_]/g, " ") },
      { onConflict: "key" }
    );

    if (dbErr) {
      console.error(`  ❌ DB upsert for ${key} — ${dbErr.message}`);
      errors++;
      continue;
    }

    console.log(`  ✅ ${key.padEnd(45)} ${sizeKB} KB → ${publicUrl.slice(0, 60)}…`);
    uploaded++;
  }

  console.log(`\n──────────────────────────────────────────`);
  console.log(`✅ Uploaded : ${uploaded}`);
  console.log(`⏭  Skipped  : ${skipped}`);
  console.log(`❌ Errors   : ${errors}`);
  console.log(`──────────────────────────────────────────\n`);

  if (errors > 0) process.exit(1);
}

main().catch(err => { console.error(err); process.exit(1); });
