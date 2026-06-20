import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import logo from "@/assets/AfriPot_logo2.png";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Show header when scrolling up, hide when scrolling down
          if (currentScrollY < lastScrollY) {
            setIsVisible(true);
          } else if (currentScrollY > 100) {
            // Only hide after scrolling past 100px
            setIsVisible(false);
          }
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const header = document.querySelector('header');
      if (open && header && !header.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [lastScrollY, open]);

  return (
    <header 
      className={`sticky top-0 left-0 right-0 z-50 py-2 bg-green-600/80 border-b border-border/20 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12">
        <Link to="/" className="leading-none relative flex items-center gap-2">
          <img src={logo} alt="Restaurant logo" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain relative z-10" />
        </Link>

        <button
          aria-label="Open menu"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 sm:gap-3 text-foreground hover:text-gold transition-colors"
        >
          <span className="text-xs sm:text-sm tracking-[0.3em] uppercase">Menu</span>
          {open ? <X size={20} className="sm:w-6 sm:h-6" /> : (
            <span className="flex flex-col gap-1 sm:gap-[5px]">
              <span className="block w-5 sm:w-6 h-px bg-current" />
              <span className="block w-5 sm:w-6 h-px bg-current" />
            </span>
          )}
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border animate-in fade-in slide-in-from-top-2 duration-300">
          <nav className="mx-auto max-w-[1600px] flex flex-col items-center text-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 gap-4 sm:gap-6 text-xs sm:text-sm tracking-[0.3em] uppercase">
            <Link to="/" onClick={() => setOpen(false)} className="hover:text-gold transition-colors py-2 w-full">Home</Link>
            <Link to="/menu" onClick={() => setOpen(false)} className="hover:text-gold transition-colors py-2 w-full">Menu</Link>
            <Link to="/events" onClick={() => setOpen(false)} className="hover:text-gold transition-colors py-2 w-full">Events</Link>
            <Link to="/gallery" onClick={() => setOpen(false)} className="hover:text-gold transition-colors py-2 w-full">Gallery</Link>
            <Link to="/about" onClick={() => setOpen(false)} className="hover:text-gold transition-colors py-2 w-full">About</Link>
            <Link to="/contact" onClick={() => setOpen(false)} className="hover:text-gold transition-colors py-2 w-full">Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
