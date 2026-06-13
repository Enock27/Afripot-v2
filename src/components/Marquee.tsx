import { useEffect, useRef, useState, useMemo } from "react";

export function Marquee({ items }: { items: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  // Memoize the loop to prevent unnecessary recalculations
  const loop = useMemo(() => [...items, ...items, ...items, ...items], [items]);
  
  // Memoize split items
  const line1Items = useMemo(() => loop.filter((_, i) => i % 2 === 0), [loop]);
  const line2Items = useMemo(() => loop.filter((_, i) => i % 2 === 1), [loop]);

  useEffect(() => {
    setIsHydrated(true);
    
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) return;
          
          const rect = containerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          if (rect.top < windowHeight && rect.bottom > 0) {
            const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
            setScrollOffset(scrollProgress * 120);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="overflow-hidden py-16 mt-32"
    >
      {/* Line 1 - moves right on scroll down */}
      <div 
        className="flex whitespace-nowrap mb-6 sm:mb-8 md:mb-12"
        style={{
          transform: isHydrated ? `translateX(${scrollOffset * 2}px)` : 'translateX(0)',
          transition: "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          willChange: "transform"
        }}
      >
        {line1Items.map((item, i) => (
          <span 
            key={`line1-${i}`} 
            className="font-slackey text-2xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl px-4 sm:px-6 md:px-8 lg:px-12 flex items-center gap-4 sm:gap-6 md:gap-8 text-outline-light"
          >
            {item}
            <span className="inline-flex items-center justify-center w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full border border-gold/25 sm:border-2"></span>
          </span>
        ))}
      </div>

      {/* Line 2 - moves left on scroll down */}
      <div 
        className="flex whitespace-nowrap"
        style={{
          transform: isHydrated ? `translateX(-${scrollOffset * 2}px)` : 'translateX(0)',
          transition: "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          willChange: "transform"
        }}
      >
        {line2Items.map((item, i) => (
          <span 
            key={`line2-${i}`} 
            className="font-slackey text-2xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl px-4 sm:px-6 md:px-8 lg:px-12 flex items-center gap-4 sm:gap-6 md:gap-8 text-outline-light"
          >
            {item}
            <span className="inline-flex items-center justify-center w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full border border-gold/25 sm:border-2"></span>
          </span>
        ))}
      </div>
    </div>
  );
}

