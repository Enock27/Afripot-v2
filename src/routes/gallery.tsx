import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { motion, AnimatePresence } from "framer-motion";
import { usePublicGallery } from "@/hooks/useAdminData";
import type { GalleryItem } from "@/data/galleryData";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
  head: () => ({
    meta: [
      { title: "Gallery — AfriPot Restaurant" },
      { name: "description", content: "A visual journey through AfriPot." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Julius+Sans+One&family=Quicksand:wght@300..700&display=swap",
      },
    ],
  }),
});

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Split items into N columns as evenly as possible */
function buildColumns(items: GalleryItem[], count: number): GalleryItem[][] {
  const cols: GalleryItem[][] = Array.from({ length: count }, () => []);
  items.forEach((item, i) => cols[i % count].push(item));
  return cols;
}

/** How many columns based on viewport width */
function columnCount(width: number): number {
  if (width >= 1024) return 3;
  if (width >= 640)  return 2;
  return 1;
}

// ─── page ─────────────────────────────────────────────────────────────────────

function GalleryPage() {
  const { items, loading, error } = usePublicGallery();
  const [selected, setSelected]   = useState<GalleryItem | null>(null);
  const [cols, setCols]           = useState(3);

  // Responsive column count
  useEffect(() => {
    function update() { setCols(columnCount(window.innerWidth)); }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Close lightbox on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setSelected(null); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const columns = buildColumns(items, cols);

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", fontFamily: '"Quicksand", sans-serif' }}>
      <SiteHeader />

      {/* ── Hero ── */}
      <section style={S.hero}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ textAlign: "center" }}>
          <p style={S.eyebrow}>VISUAL EXPERIENCE</p>
          <h1 style={S.heading}>OUR GALLERY</h1>
          <div style={S.divider} />
        </motion.div>
      </section>

      {/* ── Grid ── */}
      <section style={S.gridSection}>
        {loading && (
          <div style={S.center}>
            <p style={{ color: "#555", fontSize: 14 }}>Loading…</p>
          </div>
        )}

        {!loading && error && (
          <div style={S.center}>
            <p style={{ color: "#cc0000", fontSize: 14 }}>Failed to load gallery.</p>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div style={S.center}>
            <p style={{ color: "#444", fontSize: 14 }}>Gallery coming soon.</p>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div style={{ ...S.masonry, gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {columns.map((col, ci) => (
              <div key={ci} style={S.column}>
                {col.map((item) => (
                  <motion.div
                    key={item.id}
                    style={S.tile}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => setSelected(item)}
                    className="gallery-tile"
                  >
                    <img
                      src={item.image}
                      alt={item.title || "Gallery photo"}
                      style={S.img}
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            style={S.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              style={S.lightboxWrap}
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              exit={{ scale: 0.88,    opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={e => e.stopPropagation()}
            >
              <img src={selected.image} alt={selected.title || "Photo"} style={S.lightboxImg} />
              <button style={S.close} onClick={() => setSelected(null)} aria-label="Close">✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{css}</style>
      <SiteFooter />
    </div>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────

const S: Record<string, React.CSSProperties> = {
  hero: {
    padding: "72px 20px 48px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#0a0a0a",
  },
  eyebrow: {
    color: "#CC0000",
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.22em",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  heading: {
    fontFamily: '"Julius Sans One", sans-serif',
    fontSize: "clamp(2rem, 5vw, 4rem)",
    color: "#fff",
    letterSpacing: "0.06em",
    margin: "0 0 18px",
    fontWeight: 400,
  },
  divider: {
    width: 56,
    height: 3,
    backgroundColor: "#CC0000",
    margin: "0 auto",
  },
  gridSection: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 12px 80px",
  },
  masonry: {
    display: "grid",
    gap: 6,
    alignItems: "start",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  tile: {
    cursor: "zoom-in",
    overflow: "hidden",
    borderRadius: 4,
    backgroundColor: "#111",
    lineHeight: 0,      // removes inline gap below img
  },
  img: {
    width: "100%",
    height: "auto",
    display: "block",
    transition: "transform 0.45s ease",
  },
  center: {
    minHeight: "40vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.92)",
    backdropFilter: "blur(12px)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    cursor: "zoom-out",
  },
  lightboxWrap: {
    position: "relative",
    maxWidth: "min(92vw, 1100px)",
    maxHeight: "90vh",
    lineHeight: 0,
    cursor: "default",
  },
  lightboxImg: {
    width: "100%",
    maxHeight: "90vh",
    objectFit: "contain",
    borderRadius: 6,
    display: "block",
  },
  close: {
    position: "absolute",
    top: -16,
    right: -16,
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: "none",
    background: "#CC0000",
    color: "#fff",
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    lineHeight: 1,
    zIndex: 10,
  },
};

const css = `
  .gallery-tile img:hover { transform: scale(1.04); }
`;
