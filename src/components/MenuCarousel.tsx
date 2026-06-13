import { useState, useEffect } from "react";

interface MenuItem {
  name: string;
  ingredients: string;
  price?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuCarouselProps {
  sections: MenuSection[];
}

export function MenuCarousel({ sections }: MenuCarouselProps) {
  const [current, setCurrent] = useState(0);
  const total = sections.length;

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, 6000);
    return () => clearInterval(timer);
  }, [total]);

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  const currentSection = sections[current];

  return (
    <div className="relative w-full">
      {/* Main carousel container */}
      <div className="overflow-hidden">
        <div
          className="transition-all duration-700 ease-in-out"
          style={{
            transform: `translateX(-${current * 100}%)`,
          }}
        >
          <div className="flex">
            {sections.map((section, idx) => (
              <div key={idx} className="w-full flex-shrink-0">
                {/* Section Title */}
                <div className="text-center py-12">
                  <p className="text-gold text-xs tracking-[0.35em] uppercase font-sans">
                    {section.title}
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 w-full"></div>

                {/* Menu Items Grid */}
                <div className="max-w-full sm:max-w-[95vw] md:max-w-[1100px] mx-auto px-3 sm:px-6 md:px-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0">
                    {section.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className={`${itemIdx % 3 === 0 ? "md:pr-12" : ""} ${
                          itemIdx % 3 !== 0 ? "md:pl-4" : ""
                        }`}
                      >
                        <div className="py-5">
                          <div className="flex justify-between items-start">
                            <p className="text-white font-serif text-base mb-1">
                              {item.name}
                            </p>
                            {item.price && (
                              <p className="text-gold text-sm font-serif ml-4">
                                {item.price}
                              </p>
                            )}
                          </div>
                          <p className="text-white/40 text-xs tracking-wide">
                            {item.ingredients}
                          </p>
                          <div className="border-t border-white/10 w-full mt-3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        aria-label="Previous menu section"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 text-white/60 hover:text-white transition-colors text-2xl sm:text-3xl md:text-4xl leading-none"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Next menu section"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 text-white/60 hover:text-white transition-colors text-2xl sm:text-3xl md:text-4xl leading-none"
      >
        ›
      </button>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-8 pb-8">
        {sections.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to ${sections[idx].title}`}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background:
                idx === current
                  ? "rgba(181,140,103,1)"
                  : "rgba(255,255,255,0.3)",
              transform: idx === current ? "scale(1.4)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {/* Section Counter */}
      <div className="text-center pb-4">
        <p className="text-white/50 text-xs tracking-wide">
          {current + 1} / {total}
        </p>
      </div>
    </div>
  );
}
