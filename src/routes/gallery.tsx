import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { motion, AnimatePresence } from "framer-motion";
import { getGallery } from "@/lib/gallery.server";
import { GalleryItem } from "@/data/galleryData";

export const Route = createFileRoute("/gallery")({
  loader: async (): Promise<GalleryItem[]> => getGallery(),
  component: GalleryPage,
  head: () => ({
    meta: [
      { title: "Gallery — AfriPot Restaurant" },
      { name: "description", content: "Explore our beautiful dishes and restaurant atmosphere." },
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

const categories = ["All", "Food", "Breakfast", "Lunch"];

function GalleryPage() {
  const galleryItems = Route.useLoaderData();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filteredItems = galleryItems.filter(
    (item) => activeCategory === "All" || item.category === activeCategory
  );

  return (
    <div style={styles.pageWrapper}>
      <style>{customCSS}</style>
      <SiteHeader />

      {/* HERO SECTION */}
      <section style={styles.heroSection}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p style={styles.heroEyebrow}>VISUAL EXPERIENCE</p>
          <h1 style={styles.heroHeading}>OUR GALLERY</h1>
          <div style={styles.heroDivider}></div>
          <p style={styles.heroTagline}>A feast for your eyes before the real thing.</p>
        </motion.div>
      </section>

      {/* FILTER TABS */}
      <section style={styles.filterSection}>
        <div style={styles.container}>
          <div style={styles.tabsWrapper}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  ...styles.tabButton,
                  backgroundColor: activeCategory === cat ? "#CC0000" : "transparent",
                  color: activeCategory === cat ? "#FFFFFF" : "#CCCCCC",
                  borderColor: activeCategory === cat ? "#CC0000" : "#333333",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY GRID */}
      <section style={styles.gridSection}>
        <div style={styles.container}>
          <motion.div layout style={styles.galleryGrid}>
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  style={styles.imageCard}
                  onClick={() => setSelectedImage(item)}
                  className="gallery-card"
                >
                  <img src={item.image} alt={item.title} style={styles.image} loading="lazy" />
                  <div className="gallery-overlay" style={styles.imageOverlay}>
                    <h3 style={styles.imageTitle}>{item.title}</h3>
                    <span style={styles.imageCategory}>{item.category}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.lightboxOverlay}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={styles.lightboxContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button style={styles.closeButton} onClick={() => setSelectedImage(null)}>✕</button>
              <img src={selectedImage.image} alt={selectedImage.title} style={styles.lightboxImage} />
              <div style={styles.lightboxInfo}>
                <h2 style={styles.lightboxTitle}>{selectedImage.title}</h2>
                <span style={styles.lightboxCategory}>{selectedImage.category}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SiteFooter />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
    fontFamily: '"Quicksand", sans-serif',
    minHeight: '100vh',
    overflowX: 'hidden'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  heroSection: {
    minHeight: '35vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '60px 20px',
    background: 'solid black',
    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(204, 0, 0, 0.05) 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(204, 0, 0, 0.05) 50px)',
    backgroundSize: '50px 50px'
  },
  heroEyebrow: {
    color: '#CC0000',
    fontSize: '0.85rem',
    fontWeight: 600,
    letterSpacing: '0.2em',
    marginBottom: '10px'
  },
  heroHeading: {
    fontFamily: '"Julius Sans One", sans-serif',
    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
    color: '#FFFFFF',
    letterSpacing: '0.06em',
    margin: '0 0 20px 0',
    fontWeight: 400
  },
  heroDivider: {
    width: '60px',
    height: '3px',
    backgroundColor: '#CC0000',
    margin: '0 auto 20px'
  },
  heroTagline: {
    fontSize: '1.1rem',
    color: '#CCCCCC',
    fontWeight: 300
  },
  filterSection: {
    padding: '40px 0',
    backgroundColor: '#050505',
    borderBottom: '1px solid #1a1a1a'
  },
  tabsWrapper: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '15px'
  },
  tabButton: {
    fontFamily: '"Quicksand", sans-serif',
    fontSize: '0.9rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '10px 24px',
    borderRadius: '30px',
    border: '1px solid',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  gridSection: {
    padding: '60px 0',
    backgroundColor: '#000000',
    minHeight: '50vh'
  },
  galleryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px'
  },
  imageCard: {
    position: 'relative',
    aspectRatio: '4/3',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundColor: '#111'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease'
  },
  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: '24px',
    opacity: 0,
    transition: 'opacity 0.3s ease'
  },
  imageTitle: {
    fontFamily: '"Julius Sans One", sans-serif',
    fontSize: '1.4rem',
    color: '#FFFFFF',
    margin: '0 0 8px 0',
    transform: 'translateY(20px)',
    transition: 'transform 0.3s ease'
  },
  imageCategory: {
    color: '#CC0000',
    fontSize: '0.85rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    transform: 'translateY(20px)',
    transition: 'transform 0.3s ease 0.1s'
  },
  lightboxOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.95)',
    backdropFilter: 'blur(10px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  lightboxContent: {
    position: 'relative',
    maxWidth: '1000px',
    width: '100%',
    backgroundColor: '#111',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(204, 0, 0, 0.3)'
  },
  lightboxImage: {
    width: '100%',
    maxHeight: '75vh',
    objectFit: 'contain',
    backgroundColor: '#000'
  },
  lightboxInfo: {
    padding: '24px',
    textAlign: 'center',
    borderTop: '1px solid #222'
  },
  lightboxTitle: {
    fontFamily: '"Julius Sans One", sans-serif',
    fontSize: '2rem',
    color: '#FFF',
    margin: '0 0 8px 0'
  },
  lightboxCategory: {
    color: '#CC0000',
    fontSize: '1rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase'
  },
  closeButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#FFF',
    border: 'none',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    fontSize: '1.2rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.3s ease',
    zIndex: 10
  }
};

const customCSS = `
  .gallery-card:hover img {
    transform: scale(1.05);
  }
  .gallery-card:hover .gallery-overlay {
    opacity: 1;
  }
  .gallery-card:hover .gallery-overlay h3,
  .gallery-card:hover .gallery-overlay span {
    transform: translateY(0);
  }
  .gallery-card {
    border: 1px solid #1a1a1a;
  }
  .gallery-card:hover {
    border-color: #CC0000;
    box-shadow: 0 10px 30px rgba(204, 0, 0, 0.2);
  }
`;
