import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// Plain SPA build — no SSR, no TanStack Start server plugin.
// This produces dist/index.html + dist/assets/*, which is what
// Netlify (and any static host) expects.
export default defineConfig({
  plugins: [
    // Generate routeTree.gen.ts from src/routes/** — client-only mode
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),

    // ── Image compression ────────────────────────────────────────────────────
    // Runs at build time. Compresses every image that Vite processes through
    // the asset pipeline (imported in JS/TSX). Does NOT affect Supabase-hosted
    // images (those are already served as URLs, not bundled).
    ViteImageOptimizer({
      // JPEG / JPG — quality 75 is visually near-lossless but ~60-80% smaller
      jpg: { quality: 75 },
      jpeg: { quality: 75 },
      // PNG — lossless compression + palette reduction
      png: { quality: 75 },
      // WebP output for any .webp source files
      webp: { quality: 75, lossless: false },
      // Log each file's before/after size so you can see the gains
      logStats: true,
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    // Raise the warning threshold — our images are big, warning isn't useful
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // Split vendor chunks so the browser can cache them separately
        manualChunks: {
          "vendor-react":  ["react", "react-dom"],
          "vendor-router": ["@tanstack/react-router", "@tanstack/router-core"],
          "vendor-motion": ["framer-motion"],
          "vendor-gsap":   ["gsap"],
        },
      },
    },
  },
  server: {
    host: "::",
    port: 8080,
  },
});
