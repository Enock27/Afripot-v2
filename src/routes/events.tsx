import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getEvents } from "@/lib/events.server";
import { Event } from "@/data/eventsData";

export const Route = createFileRoute("/events")({
  loader: () => getEvents(),
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
  const upcomingEventsData = Route.useLoaderData();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Auto-sort events: nearest first
  const upcomingEvents = [...upcomingEventsData].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

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
  }, [upcomingEvents]);

  // The first event in the sorted list is always the featured one
  const featuredEvent = upcomingEvents[0];
  const moreEvents = upcomingEvents.slice(1);

  if (!featuredEvent) return (
    <div style={styles.pageWrapper}>
      <SiteHeader />
      <section style={{...styles.heroSection, minHeight: '60vh'}} className="reveal">
        <h1 style={styles.heroHeading}>NO UPCOMING EVENTS</h1>
        <p style={styles.heroTagline}>Check back soon for cultural celebrations and culinary nights.</p>
      </section>
      <SiteFooter />
    </div>
  );

  const formatDisplayDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatShortDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

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
                src={featuredEvent.image} 
                alt={featuredEvent.title}
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
              <h2 style={styles.featuredTitle}>{featuredEvent.title}</h2>
              <p style={styles.featuredDesc}>{featuredEvent.description}</p>
            </div>
            
            <div style={styles.detailsRight}>
              <div style={styles.metaRow}>
                <span style={styles.datePill}>{formatDisplayDate(featuredEvent.date)}</span>
              </div>
              <div style={styles.metaRow}>
                <span style={styles.metaIcon}>🕒</span>
                <span style={styles.metaText}>{featuredEvent.time}</span>
              </div>
              <div style={styles.metaRow}>
                <span style={styles.metaIcon}>📍</span>
                <span style={styles.metaText}>Address: {featuredEvent.location}</span>
              </div>
              
              <button 
                onClick={() => setSelectedEvent(featuredEvent)}
                className="cta-button"
                style={{
                  backgroundColor: '#CC0000',
                  color: 'white',
                  border: 'none',
                  padding: '16px 40px',
                  fontFamily: '"Quicksand", sans-serif',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  marginTop: '20px',
                  transition: 'all 0.3s ease'
                }}
              >
                VIEW FULL DETAILS →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. UPCOMING EVENTS GRID */}
      {moreEvents.length > 0 && (
        <section style={styles.gridSection}>
          <div style={styles.container}>
            <h2 style={styles.sectionTitle} className="reveal">MORE EVENTS</h2>
            <div style={styles.heroDivider} className="reveal"></div>
            
            <div style={styles.eventsGrid}>
              {moreEvents.map((event, index) => (
                <div 
                  key={event.id} 
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
                    <div style={styles.cardDateBadge}>{formatShortDate(event.date)}</div>
                  </div>
                  <div style={styles.cardBody}>
                    <h3 style={styles.cardTitle}>{event.title}</h3>
                    <p style={styles.cardLocation}>{event.location}</p>
                    <button 
                      onClick={() => setSelectedEvent(event)}
                      className="card-link"
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. DETAIL OVERLAY MODAL */}
      {selectedEvent && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            overflowY: 'auto'
          }}
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            style={{
              backgroundColor: '#0a0a0a',
              border: '1px solid #1a1a1a',
              borderRadius: '20px',
              maxWidth: '900px',
              width: '100%',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(204, 0, 0, 0.25)',
              margin: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedEvent(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: 'white',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                fontSize: '20px'
              }}
            >
              ✕
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              <div style={{ height: '100%', minHeight: '300px', position: 'relative' }}>
                <img 
                  src={selectedEvent.image} 
                  alt={selectedEvent.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, #0a0a0a, transparent 40%)'
                }} />
              </div>
              
              <div style={{ padding: '40px', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ 
                  fontFamily: '"Julius Sans One", sans-serif', 
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', 
                  color: 'white', 
                  marginBottom: '25px',
                  lineHeight: 1.2,
                  letterSpacing: '0.05em'
                }}>
                  {selectedEvent.title}
                </h2>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '30px' }}>
                  <span style={{ ...styles.datePill, fontSize: '0.8rem' }}>{formatDisplayDate(selectedEvent.date)}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#999', fontSize: '0.9rem' }}>
                    <span>🕒</span> {selectedEvent.time}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#999', fontSize: '0.9rem' }}>
                    <span>📍</span> {selectedEvent.location}
                  </div>
                </div>

                <div style={{ width: '40px', height: '2px', backgroundColor: '#CC0000', marginBottom: '25px' }} />

                <p style={{ 
                  color: '#CCCCCC', 
                  fontSize: '1rem', 
                  lineHeight: 1.8, 
                  fontWeight: 300,
                  marginBottom: '35px'
                }}>
                  {selectedEvent.description}
                </p>

                <button 
                  onClick={() => setSelectedEvent(null)}
                  style={{
                    backgroundColor: '#CC0000',
                    color: 'white',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '4px',
                    fontFamily: '"Quicksand", sans-serif',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    marginTop: 'auto',
                    transition: 'background 0.3s ease'
                  }}
                >
                  CLOSE PREVIEW
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. FOOTER */}
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
  }
};

const customCSS = `
  @media (min-width: 768px) {
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
`;
