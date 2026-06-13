import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

/* ============================================
   ADMIN CONFIG — Edit these to update your event
   ============================================ */
const EVENT_CONFIG = {
  bannerImage: "/src/assets/eventBannerUI/eventBanner1.jpg", // Replace with your banner image filename
  eventTitle: "ANNUAL GALA NIGHT 2025",
  eventDate: "Saturday, August 16, 2025",
  eventTime: "7:00 PM",
  eventLocation: "Kigali Convention Centre, Rwanda",
  eventDescription: "An exclusive evening celebrating excellence, community, and vision. Join us for an unforgettable night of music, food, and culture.",
  registerLink: "/reservation", // Replace with your registration URL

  // UPCOMING EVENTS CARDS — add or remove cards here
  upcomingEvents: [
    {
      title: "LEADERSHIP SUMMIT",
      date: "July 5, 2025",
      location: "Kigali",
      image: "/src/assets/AfroMusic1.jpg"
    },
    {
      title: "TECH INNOVATION EXPO",
      date: "July 20, 2025",
      location: "Kigali",
      image: "/src/assets/AfroMusic2.jpg"
    },
    {
      title: "COMMUNITY AWARDS NIGHT",
      date: "August 2, 2025",
      location: "Musanze",
      image: "/src/assets/AfroMusic1.jpg"
    }
  ]
};
/* ============================================
   END OF ADMIN CONFIG — Do not edit below
   ============================================ */

export const Route = createFileRoute("/events")({
  component: EventsPage,
  head: () => ({
    meta: [
      { title: "Events — AfriPot Restaurant" },
      { name: "description", content: "Stay connected with upcoming events at AfriPot Restaurant." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Julius+Sans+One&family=Quicksand:wght@300..700&family=Swanky+and+Moo+Moo&display=swap",
      },
    ],
  }),
});

function EventsPage() {
  useEffect(() => {
    // Intersection Observer for reveal animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = "1";
          (entry.target as HTMLElement).style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div style={styles.pageWrapper}>
      <style>{customCSS}</style>

      {/* 1. NAVIGATION BAR */}
      <SiteHeader />

      {/* 2. HERO SECTION */}
      <section style={styles.heroSection} className="reveal">
        <p style={styles.heroEyebrow}>AFRIPOT CUISINE</p>
        <h1 style={styles.heroHeading}>UPCOMING EVENTS</h1>
        <div style={styles.heroDivider}></div>
        <p style={styles.heroTagline}>Stay connected. Experience what's next.</p>
      </section>

      {/* 3. FEATURED EVENT BANNER SECTION */}
      <section style={styles.featuredSection}>
        <div style={styles.container}>
          <div style={styles.bannerWrapper} className="reveal">
            {/* Red Corner Accents */}
            <div className="corner corner-tl"></div>
            <div className="corner corner-tr"></div>
            <div className="corner corner-bl"></div>
            <div className="corner corner-br"></div>
            
            <div style={styles.bannerImageContainer}>
              <img 
                src={EVENT_CONFIG.bannerImage} 
                alt={EVENT_CONFIG.eventTitle}
                style={styles.bannerImage}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLElement).parentElement!.style.background = 'linear-gradient(135deg, #000000 0%, #1a0000 50%, #CC0000 100%)';
                }}
              />
              <div style={styles.bannerOverlay}></div>
            </div>
          </div>

          {/* Event Details Block */}
          <div style={styles.detailsBlock} className="reveal">
            <div style={styles.detailsLeft}>
              <h2 style={styles.featuredTitle}>{EVENT_CONFIG.eventTitle}</h2>
              <p style={styles.featuredDesc}>{EVENT_CONFIG.eventDescription}</p>
            </div>
            
            <div style={styles.detailsRight}>
              <div style={styles.metaRow}>
                <span style={styles.datePill}>{EVENT_CONFIG.eventDate}</span>
              </div>
              <div style={styles.metaRow}>
                <span style={styles.metaIcon}>🕒</span>
                <span style={styles.metaText}>{EVENT_CONFIG.eventTime}</span>
              </div>
              <div style={styles.metaRow}>
                <span style={styles.metaIcon}>📍</span>
                <span style={styles.metaText}>{EVENT_CONFIG.eventLocation}</span>
              </div>
              
              <a href={EVENT_CONFIG.registerLink} style={styles.ctaButton}>
                REGISTER NOW →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. UPCOMING EVENTS GRID */}
      <section style={styles.gridSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle} className="reveal">MORE EVENTS</h2>
          <div style={styles.heroDivider} className="reveal"></div>
          
          <div style={styles.eventsGrid}>
            {EVENT_CONFIG.upcomingEvents.map((event, index) => (
              <div 
                key={index} 
                className="event-card reveal" 
                style={{...styles.card, transitionDelay: `${index * 0.1}s`}}
              >
                <div style={styles.cardImageArea}>
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    style={styles.cardImage}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLElement).parentElement!.style.background = 'linear-gradient(135deg, #000000 0%, #1a0000 50%, #CC0000 100%)';
                    }}
                  />
                  <div style={styles.cardDateBadge}>{event.date}</div>
                </div>
                <div style={styles.cardBody}>
                  <h3 style={styles.cardTitle}>{event.title}</h3>
                  <p style={styles.cardLocation}>{event.location}</p>
                  <a href="#" className="card-link">View Details →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
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
  navbar: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backgroundColor: '#000000',
    transition: 'all 0.3s ease',
    padding: '15px 0'
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navBrand: {
    fontFamily: '"Julius Sans One", sans-serif',
    color: '#CC0000',
    fontSize: '1.4rem',
    textDecoration: 'none',
    letterSpacing: '0.06em',
    fontWeight: 400
  },
  navLinks: {
    display: 'none', // Hidden on mobile, flex on desktop
    gap: '30px'
  },
  hamburger: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px'
  },
  hamburgerLine: {
    width: '25px',
    height: '2px',
    transition: '0.3s ease'
  },
  mobileNav: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    flexDirection: 'column',
    padding: '20px',
    gap: '15px',
    borderLeft: '4px solid #CC0000',
    zIndex: 999
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
  featuredSection: {
    padding: '60px 0',
    backgroundColor: '#000000'
  },
  bannerWrapper: {
    position: 'relative',
    width: '100%',
    marginBottom: '0'
  },
  bannerImageContainer: {
    width: '100%',
    aspectRatio: '16/9',
    maxHeight: '600px',
    overflow: 'hidden',
    position: 'relative'
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center'
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)'
  },
  detailsBlock: {
    backgroundColor: '#000000',
    padding: '40px',
    borderLeft: '4px solid #CC0000',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '30px'
  },
  detailsLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  featuredTitle: {
    fontFamily: '"Julius Sans One", sans-serif',
    fontSize: 'clamp(1.8rem, 4vw, 3rem)',
    color: '#FFFFFF',
    margin: 0,
    letterSpacing: '0.06em',
    fontWeight: 400
  },
  featuredDesc: {
    fontSize: '1rem',
    color: '#CCCCCC',
    lineHeight: 1.8,
    fontWeight: 300,
    margin: 0
  },
  detailsRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    justifyContent: 'center'
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  datePill: {
    backgroundColor: '#CC0000',
    color: '#FFFFFF',
    padding: '6px 16px',
    borderRadius: '4px',
    fontWeight: 700,
    fontSize: '0.9rem'
  },
  metaIcon: {
    fontSize: '1.1rem'
  },
  metaText: {
    fontSize: '1rem',
    color: '#FFFFFF',
    fontWeight: 500
  },
  ctaButton: {
    backgroundColor: '#CC0000',
    color: '#FFFFFF',
    fontFamily: '"Quicksand", sans-serif',
    fontWeight: 700,
    letterSpacing: '0.1em',
    padding: '16px 40px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    textDecoration: 'none',
    textAlign: 'center',
    marginTop: '10px',
    transition: 'all 0.3s ease'
  },
  gridSection: {
    padding: '60px 0',
    backgroundColor: '#000000'
  },
  sectionTitle: {
    fontFamily: '"Julius Sans One", sans-serif',
    fontSize: '2rem',
    textAlign: 'center',
    letterSpacing: '0.06em',
    margin: '0 0 20px 0',
    fontWeight: 400
  },
  eventsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
    marginTop: '40px'
  },
  card: {
    backgroundColor: '#111111',
    border: '1px solid #1a1a1a',
    borderRadius: '4px',
    borderLeft: '4px solid #CC0000',
    overflow: 'hidden',
    transition: 'all 0.3s ease'
  },
  cardImageArea: {
    height: '200px',
    width: '100%',
    position: 'relative',
    backgroundColor: '#1a1a1a'
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  cardDateBadge: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    backgroundColor: '#CC0000',
    color: '#FFFFFF',
    padding: '4px 12px',
    borderRadius: '4px',
    fontWeight: 700,
    fontSize: '0.75rem'
  },
  cardBody: {
    padding: '20px'
  },
  cardTitle: {
    fontFamily: '"Julius Sans One", sans-serif',
    fontSize: '1.1rem',
    color: '#FFFFFF',
    margin: '0 0 8px 0',
    letterSpacing: '0.06em',
    fontWeight: 400
  },
  cardLocation: {
    fontSize: '0.85rem',
    color: '#999999',
    fontWeight: 500,
    margin: 0
  },
  footer: {
    backgroundColor: '#000000',
    borderTop: '3px solid #CC0000',
    padding: '50px 0 30px'
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    marginBottom: '30px'
  },
  footerBrand: {
    fontFamily: '"Julius Sans One", sans-serif',
    color: '#CC0000',
    fontSize: '1.2rem',
    margin: '0 0 10px 0',
    letterSpacing: '0.06em',
    fontWeight: 400
  },
  footerTagline: {
    fontSize: '0.85rem',
    color: '#999999',
    fontWeight: 300,
    lineHeight: 1.6
  },
  footerTitle: {
    fontSize: '1rem',
    color: '#FFFFFF',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '20px'
  },
  footerLinks: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  footerContact: {
    color: '#999999',
    fontSize: '0.9rem',
    lineHeight: 1.6
  },
  footerBottom: {
    borderTop: '1px solid #1a1a1a',
    paddingTop: '30px',
    textAlign: 'center',
    fontSize: '0.8rem',
    color: '#666666'
  }
};

const customCSS = `
  @media (min-width: 768px) {
    .nav-link-container { display: flex !important; }
    #nav-links { display: flex !important; }
    .details-block { grid-template-columns: 1fr 300px !important; }
  }

  .nav-link {
    font-family: "Quicksand", sans-serif;
    font-weight: 500;
    color: #FFFFFF;
    text-decoration: none;
    font-size: 0.9rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: color 0.3s ease;
  }

  .nav-link:hover, .nav-link.active {
    color: #CC0000;
  }

  @media (min-width: 1024px) {
    nav div div { display: flex !important; }
    nav button { display: none !important; }
    .details-block { grid-template-columns: 1fr 400px !important; }
  }

  /* Reveal Animations */
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
  }

  /* Corners */
  .corner {
    position: absolute;
    width: 30px;
    height: 30px;
    border: 3px solid #CC0000;
    z-index: 10;
  }
  .corner-tl { top: -15px; left: -15px; border-right: 0; border-bottom: 0; }
  .corner-tr { top: -15px; right: -15px; border-left: 0; border-bottom: 0; }
  .corner-bl { bottom: -15px; left: -15px; border-right: 0; border-top: 0; }
  .corner-br { bottom: -15px; right: -15px; border-left: 0; border-top: 0; }

  /* Buttons */
  .cta-button:hover {
    background-color: #FF0000 !important;
    transform: translateY(-2px);
  }

  /* Cards */
  .event-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 40px rgba(204, 0, 0, 0.25);
    border-color: #CC0000 !important;
  }

  .card-link {
    font-family: "Quicksand", sans-serif;
    font-weight: 600;
    color: #CC0000;
    text-decoration: none;
    font-size: 0.9rem;
    margin-top: 16px;
    display: block;
    transition: color 0.3s ease;
  }
  .card-link:hover {
    color: #FF0000;
  }

  /* Footer Links */
  .f-link {
    color: #999999;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  .f-link:hover {
    color: #CC0000;
  }

  /* Utilities */
  .details-block {
    display: grid;
    grid-template-columns: 1fr;
    gap: 30px;
  }

  @media (min-width: 768px) {
    .details-block {
      grid-template-columns: 1fr 350px;
    }
  }
`;
