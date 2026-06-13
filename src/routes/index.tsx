import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Marquee } from "@/components/Marquee";
import { PageLoader } from "@/components/PageLoader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PartnersSection } from "@/components/PartnersSection";
import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import interiorStairs from "@/assets/Afri3.jpg";
import dishPlate from "@/assets/afri2.jpg";
import suiteGarden from "@/assets/suite-garden.jpg";
import logo from "@/assets/AfriPot_logo2.png";
import backgroundHero from "@/assets/BackgroundHero1.jpg";
import HEROvid from "@/assets/HEROvid.mp4";
import chomaImg from "@/assets/choma.jpg";
import luwomboImg from "@/assets/Chicken_Luwombo.JPG";
import tilapiaImg from "@/assets/TILAPIA.jpg";
import grillsImg from "@/assets/mixedgrills.jpg";
import riceImg from "@/assets/AfripotRice.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [selectedDish, setSelectedDish] = useState("mbuzi");

  // Dish carousel component
  const DishCarousel = ({ selectedDish }: { selectedDish: string }) => {
    const dishes = {
      mbuzi: { img: chomaImg, alt: "Mbuzi Choma" },
      luwombo: { img: luwomboImg, alt: "Chicken Luwombo" },
      tilapia: { img: tilapiaImg, alt: "Grilled Fish Tilapia" },
      grills: { img: grillsImg, alt: "Mixed Grills" },
      rice: { img: riceImg, alt: "AfriPot Rice" },
    };

    const currentDish = dishes[selectedDish as keyof typeof dishes] || dishes.mbuzi;

    return (
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-lg shadow-elegant">
        <img
          key={selectedDish}
          src={currentDish.img}
          alt={currentDish.alt}
          className="w-full h-full object-cover animate-in fade-in zoom-in duration-500"
          style={{
            animation: "fadeInZoom 0.6s ease-out forwards",
          }}
        />
      </div>
    );
  };

  // Dish menu item component
  const DishMenuItem = ({ 
    name, 
    isActive, 
    onClick 
  }: { 
    name: string; 
    isActive: boolean; 
    onClick: () => void;
  }) => (
    <div
      onClick={onClick}
      className={`border-b pb-4 sm:pb-5 md:pb-6 group cursor-pointer transition-all duration-300 ${
        isActive ? "border-gold" : "border-border/40 hover:border-gold"
      }`}
    >
      <h3
        className={`font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl transition-all duration-300 ${
          isActive
            ? "text-gold translate-x-2"
            : "text-white group-hover:text-gold group-hover:translate-x-2"
        }`}
      >
        {name}
      </h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageLoader />
      <SiteHeader />

      {/* HERO */}
      <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen w-full overflow-hidden">
        {/* Hero video */}
        <div className="absolute inset-0">
          <video
            src={HEROvid}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover transition-all duration-[2000ms] ease-in-out opacity-100 scale-100"
            style={{ transform: "scale(1)" }}
          />
        </div>

        {/* Dark overlay: mobile-optimized (centered) → desktop (right-focused) */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.5) 25%, rgba(21,21,21,0.7) 50%, rgba(21,21,21,0.85) 75%, rgba(21,21,21,0.95) 100%)" }} />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10 md:py-12 lg:py-16 max-w-[1600px] mx-auto w-full">

          {/* Center on mobile, bottom-right on desktop */}
          <div className="flex-1 flex items-center justify-center sm:justify-center md:justify-end">
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[480px] animate-fade-up text-center sm:text-center md:text-right">
              <h1 className="leading-[1.1]">
                <span className="block text-[clamp(1.25rem,4vw,2.5rem)] text-white font-serif font-normal tracking-tight">
                  Restaurant
                </span>
                <span className="block text-[clamp(0.875rem,2.5vw,2rem)] font-indie font-bold tracking-tight mt-2 sm:mt-3">
                  <span className="text-green-400">Afri</span><span className="text-white">Pot</span>
                  <span className="text-white ml-1 sm:ml-2 md:ml-3">Cuisine</span>
                </span>
              </h1>

              <p className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 text-[0.75rem] sm:text-sm md:text-base text-white/80 leading-relaxed max-w-xs sm:max-w-sm mx-auto md:mx-0 md:ml-auto">
                Where tradition meets taste
              </p>

              {/* Michelin flower icons */}
              <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-7 flex items-center justify-center md:justify-end gap-2 sm:gap-3 md:gap-4">
                <svg width="24" height="24" viewBox="0 0 36 36" fill="none" aria-label="Michelin star" className="sm:w-8 sm:h-8 md:w-9 md:h-9" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="4" fill="white"/>
                  {[0,45,90,135,180,225,270,315].map((deg, i) => (
                    <ellipse key={i} cx="18" cy="9" rx="3.5" ry="5.5" fill="white" transform={`rotate(${deg} 18 18)`} opacity="0.9"/>
                  ))}
                </svg>
                <svg width="24" height="24" viewBox="0 0 36 36" fill="none" aria-label="Michelin star" className="sm:w-8 sm:h-8 md:w-9 md:h-9" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="4" fill="white"/>
                  {[0,45,90,135,180,225,270,315].map((deg, i) => (
                    <ellipse key={i} cx="18" cy="9" rx="3.5" ry="5.5" fill="white" transform={`rotate(${deg} 18 18)`} opacity="0.9"/>
                  ))}
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom bar - removed, using fixed button instead */}
        </div>

        {/* Vertical "AfriPot" badge on far right - hidden on mobile */}
        <Link 
          to="/"
          className="hidden sm:flex fixed right-0 top-[45%] z-50 bg-black text-white flex-col items-center justify-center py-2 sm:py-3 md:py-4 px-0.5 sm:px-1 gap-0.5 sm:gap-1 md:gap-2 hover:bg-gray-900 transition-colors" 
        >
          <div className="relative">
            <img 
              src={logo} 
              alt="AfriPot logo" 
              className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 object-contain brightness-125"
            />
          </div>
          <div style={{ writingMode: "vertical-rl", letterSpacing: "0.05em" }} className="text-center">
            <span className="text-[8px] sm:text-[9px] md:text-xs lg:text-sm font-swanky font-semibold block">AfriPot</span>
            <span className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-xs font-playful font-normal block mt-0.5">Cuisine</span>
          </div>
        </Link>
      </section>

      {/* MARQUEE */}
      <Marquee items={["AfriPot Restaurant", "Cultural Heritage", "Where Tradition Meets Taste"]} />

      {/* STORY */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
            {/* Left Image */}
            <ScrollReveal>
              <img src={interiorStairs} alt="Antique staircase and wine cabinet" loading="lazy" className="w-full aspect-[3/4] object-cover shadow-elegant" />
            </ScrollReveal>

            {/* Center Content */}
            <ScrollReveal>
              <div className="text-center px-2 sm:px-4">
                <p className="text-[0.65rem] sm:text-xs tracking-[0.4em] uppercase text-gold mb-4 sm:mb-6">Our Story</p>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
                  Authentic African flavors from <em className="text-gradient-gold">the heart of Kigali</em>
                </h2>
                <p className="mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                  At AfriPot, we celebrate the rich culinary traditions of Rwanda and across Africa. Our kitchen honors time-tested recipes while embracing modern techniques, creating dishes that connect you to our heritage. Every meal is a journey through authentic flavors, warmth, and genuine hospitality.
                </p>
                <Link
                  to="/about"
                  className="mt-6 sm:mt-8 md:mt-10 inline-block border-b border-gold text-gold pb-1 text-[0.65rem] sm:text-xs tracking-[0.3em] uppercase hover:border-foreground hover:text-foreground transition-colors"
                >
                  Read our story
                </Link>
              </div>
            </ScrollReveal>

            {/* Right Image */}
            <ScrollReveal>
              <img src={dishPlate} alt="Plated signature dish" loading="lazy" className="w-full aspect-[3/4] object-cover shadow-elegant" />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden">
        {/* Fixed Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundHero})`,
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content - Scrolls Over Background */}
        <div className="relative z-10 mx-auto max-w-[1400px] text-center px-2 sm:px-4">
          <p className="text-[0.65rem] sm:text-xs tracking-[0.4em] uppercase text-gold mb-4 sm:mb-6">The Journey Menu</p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl max-w-4xl mx-auto leading-tight">
            Around the world, <em className="text-gradient-gold">one plate at a time</em>
          </h2>
          <p className="mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Our six-course journey traces Soenil's path from Paramaribo to Provence, finished with Brabant warmth and paired wines poured at the perfect moment.
          </p>

          <Link
            to="/menu"
            className="mt-6 sm:mt-8 md:mt-10 inline-block bg-gold text-gold-foreground px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 text-[0.65rem] sm:text-xs md:text-sm tracking-[0.3em] uppercase hover:bg-foreground transition-colors"
          >
            View our menu
          </Link>
        </div>
      </section>

      {/* SIGNATURE */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center">
            {/* Left - Menu Items */}
            <div>
              <p className="text-[0.65rem] sm:text-xs tracking-[0.4em] uppercase text-gold mb-8 sm:mb-10 md:mb-12">Signature Selections</p>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-10 md:mb-12 lg:mb-16">Our Favorites</h2>

              <div className="space-y-6 sm:space-y-7 md:space-y-8">
                <DishMenuItem 
                  name="Mbuzi Choma" 
                  isActive={selectedDish === "mbuzi"}
                  onClick={() => setSelectedDish("mbuzi")}
                />
                <DishMenuItem 
                  name="Chicken Luwombo" 
                  isActive={selectedDish === "luwombo"}
                  onClick={() => setSelectedDish("luwombo")}
                />
                <DishMenuItem 
                  name="Grilled Fish Tilapia" 
                  isActive={selectedDish === "tilapia"}
                  onClick={() => setSelectedDish("tilapia")}
                />
                <DishMenuItem 
                  name="Mixed Grills" 
                  isActive={selectedDish === "grills"}
                  onClick={() => setSelectedDish("grills")}
                />
                <DishMenuItem 
                  name="AfriPot Rice" 
                  isActive={selectedDish === "rice"}
                  onClick={() => setSelectedDish("rice")}
                />
              </div>

              <Link
                to="/menu"
                className="mt-8 sm:mt-10 md:mt-12 inline-block text-[0.65rem] sm:text-xs md:text-sm tracking-[0.3em] uppercase text-gold border-b border-gold pb-1 hover:text-foreground hover:border-foreground transition-colors"
              >
                Explore full menu
              </Link>
            </div>

            {/* Right - Carousel Image */}
            <div className="hidden lg:block">
              <DishCarousel selectedDish={selectedDish} />
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE 2 */}
      <Marquee items={["AfriPot Restaurant", "Cultural Heritage", "Where Tradition Meets Taste"]} />

      {/* PARTNERS */}
      <PartnersSection />

      <SiteFooter />
    </div>
  );
}
