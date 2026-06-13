import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Marquee } from "@/components/Marquee";
import { MenuCarousel } from "@/components/MenuCarousel";
import { useState, useEffect } from "react";
import * as menuData from "@/data/menuData";
import * as beveragesData from "@/data/beveragesData";

// Food images for the hero gallery
import fd3 from "@/assets/fd3.jpg";
import fd4 from "@/assets/fd4.jpg";
import localfood1 from "@/assets/localfood1.jpg";
import pilau from "@/assets/pilau.jpg";

export const Route = createFileRoute("/menu")({
  component: MenuPage,
  head: () => ({
    meta: [
      { title: "Menu — AfriPot Restaurant" },
      {
        name: "description",
        content:
          "Authentic African cuisine with international flavors. Explore our curated menu of traditional and contemporary dishes.",
      },
    ],
  }),
});

// ─── Data ────────────────────────────────────────────────────────────────────

// Import menu items from data files
const breakfastItems = menuData.breakfastItems;
const soupsItems = menuData.soupsItems;
const saladItems = menuData.saladItems;
const mainCourseItems = menuData.mainCourseItems;
const wrapsItems = menuData.wrapsItems;
const sandwichItems = menuData.sandwichItems;
const burgerItems = menuData.burgerItems;
const pizzaItems = menuData.pizzaItems;
const pastaItems = menuData.pastaItems;
const grillsItems = menuData.grillsItems;
const extrasItems = menuData.extrasItems;
const asianItems = menuData.asianItems;
const sizzlingItems = menuData.sizzlingItems;
const noodlesItems = menuData.noodlesItems;
const snacksItems = menuData.snacksItems;
const kidsMenuItems = menuData.kidsMenuItems;
const localFoodItems = menuData.localFoodItems;

// Beverages
const coffeeItems = beveragesData.coffeeItems;
const flavoredCoffeeItems = beveragesData.flavoredCoffeeItems;
const specialCoffeeItems = beveragesData.specialCoffeeItems;
const icedCoffeeItems = beveragesData.icedCoffeeItems;
const milkShakesItems = beveragesData.milkShakesItems;
const freshJuicesItems = beveragesData.freshJuicesItems;
const mojitoItems = beveragesData.mojitoItems;
const fruitTeaItems = beveragesData.fruitTeaItems;
const smoothiesItems = beveragesData.smoothiesItems;
const teaItems = beveragesData.teaItems;
const winesByBottleItems = beveragesData.winesByBottleItems;
const sparklingWineItems = beveragesData.sparklingWineItems;
const champagneItems = beveragesData.champagneItems;
const whiskyItems = beveragesData.whiskyItems;
const beersItems = beveragesData.beersItems;
const tequilaItems = beveragesData.tequilaItems;
const ginItems = beveragesData.ginItems;
const cognacItems = beveragesData.cognacItems;
const cocktailsItems = beveragesData.cocktailsItems;

const marqueeItems = [
  "AfriPot Restaurant",
  "Where Tradition Meets Taste",
  "Cultural Heritage",
  "Authentic African Cuisine",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function MenuDivider() {
  return <div className="border-t border-white/10 w-full" />;
}

function MenuItemRow({
  name,
  ingredients,
  price,
}: {
  name: string;
  ingredients: string;
  price?: string;
}) {
  return (
    <div className="py-5">
      <div className="flex justify-between items-start">
        <p className="text-white font-serif text-base mb-1">{name}</p>
        {price && <p className="text-gold text-sm font-serif ml-4">{price}</p>}
      </div>
      <p className="text-white/40 text-xs tracking-wide">{ingredients}</p>
      <MenuDivider />
    </div>
  );
}

function ThreeColGrid({ items }: { items: { name: string; ingredients: string; price?: string }[] }) {
  // Pad to multiple of 3
  const padded = [...items];
  while (padded.length % 3 !== 0) padded.push({ name: "", ingredients: "", price: "" });

  const rows: { name: string; ingredients: string; price?: string }[][] = [];
  for (let i = 0; i < padded.length; i += 3) {
    rows.push(padded.slice(i, i + 3));
  }

  return (
    <div>
      {rows.map((row, ri) => (
        <div key={ri} className="grid grid-cols-1 md:grid-cols-3">
          {row.map((item, ci) => (
            <div key={ci} className={`${ci < 2 ? "md:pr-12" : ""} ${ci > 0 ? "md:pl-4" : ""}`}>
              {item.name ? (
                <MenuItemRow name={item.name} ingredients={item.ingredients} price={item.price} />
              ) : (
                <div className="py-5" />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center py-12">
      <p className="text-gold text-xs tracking-[0.35em] uppercase font-sans">{children}</p>
    </div>
  );
}

// ─── Carousel images ─────────────────────────────────────────────────────────

const carouselImages = [fd3, fd4, localfood1, pilau];

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const total = carouselImages.length;

  // Auto-advance every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, 4000);
    return () => clearInterval(timer);
  }, [total]);

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  return (
    <div className="relative mt-16 w-full overflow-hidden select-none">
      {/* Track — slides in 3-up peek layout */}
      <div className="flex items-center justify-center">
        {carouselImages.map((src, i) => {
          const offset = (i - current + total) % total;
          // 0 = active center, 1 = right peek, total-1 = left peek, others hidden
          const isCenter = offset === 0;
          const isRight = offset === 1;
          const isLeft = offset === total - 1;
          const isVisible = isCenter || isRight || isLeft;

          return (
            <div
              key={i}
              className="absolute transition-all duration-700 ease-in-out"
              style={{
                width: isCenter ? "min(1000px, 90vw)" : "min(300px, 25vw)",
                height: isCenter ? "min(600px, 50vw)" : "min(400px, 50vw)",
                transform: isCenter
                  ? "translateX(0) scale(1)"
                  : isRight
                    ? "translateX(calc(min(400px, 35vw) + min(100px, 8vw) + 8px)) scale(0.92)"
                    : isLeft
                      ? "translateX(calc(-1 * (min(400px, 35vw) + min(100px, 8vw) + 8px))) scale(0.92)"
                      : isRight
                        ? "translateX(200%) scale(0.85)"
                        : "translateX(-200%) scale(0.85)",
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? "auto" : "none",
                zIndex: isCenter ? 10 : 5,
              }}
            >
              <img
                src={src}
                alt={`Dish ${i + 1}`}
                className="w-full h-full object-cover"
                style={{
                  filter: isCenter ? "none" : "brightness(0.55)",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Spacer to give the section height */}
      <div style={{ height: "min(400px, 50vw)" }} />

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 text-white/60 hover:text-white transition-colors text-2xl sm:text-3xl leading-none"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Next"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 text-white/60 hover:text-white transition-colors text-2xl sm:text-3xl leading-none"
      >
        ›
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {carouselImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: i === current ? "rgba(181,140,103,1)" : "rgba(255,255,255,0.3)",
              transform: i === current ? "scale(1.4)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MenuPage() {
  // Organize all menu sections for carousel
  const foodSections = [
    { title: "BREAKFAST", items: breakfastItems },
    { title: "SOUPS & STARTERS", items: soupsItems },
    { title: "SALAD BAR", items: saladItems },
    { title: "MAIN COURSES", items: mainCourseItems },
    { title: "WRAPS", items: wrapsItems },
    { title: "SANDWICHES", items: sandwichItems },
    { title: "BURGERS", items: burgerItems },
    { title: "PIZZA", items: pizzaItems },
    { title: "PASTA", items: pastaItems },
    { title: "GRILLS & BBQ", items: grillsItems },
    { title: "EXTRAS", items: extrasItems },
    { title: "ASIAN DISHES", items: asianItems },
    { title: "SIZZLING", items: sizzlingItems },
    { title: "NOODLES & RICE", items: noodlesItems },
    { title: "SNACKS", items: snacksItems },
    { title: "KIDS MENU", items: kidsMenuItems },
    { title: "LOCAL FOOD MENU", items: localFoodItems },
  ];

  const beverageSections = [
    { title: "COFFEE", items: coffeeItems },
    { title: "FLAVORED COFFEE", items: flavoredCoffeeItems },
    { title: "SPECIAL COFFEES", items: specialCoffeeItems },
    { title: "ICED COFFEE", items: icedCoffeeItems },
    { title: "MILK SHAKES", items: milkShakesItems },
    { title: "FRESH JUICES", items: freshJuicesItems },
    { title: "MOJITOS", items: mojitoItems },
    { title: "FRUIT TEA", items: fruitTeaItems },
    { title: "SMOOTHIES", items: smoothiesItems },
    { title: "TEA", items: teaItems },
    { title: "WINES BY BOTTLE", items: winesByBottleItems },
    { title: "SPARKLING WINE", items: sparklingWineItems },
    { title: "CHAMPAGNE", items: champagneItems },
    { title: "WHISKY", items: whiskyItems },
    { title: "BEERS", items: beersItems },
    { title: "TEQUILA", items: tequilaItems },
    { title: "GIN", items: ginItems },
    { title: "COGNAC", items: cognacItems },
    { title: "COCKTAILS", items: cocktailsItems },
  ];

  return (
    <div className="min-h-screen bg-[#151515] text-white">
      <SiteHeader />

      {/* ── Hero ── */}
      <section className="pt-24 pb-16 text-center px-6">
        {/* Label */}
        <p className="text-[0.6rem] tracking-[0.45em] uppercase text-white/70 mb-8 font-sans">
          THE MENU
        </p>

        {/* Heading */}
        <h1 className="font-serif font-light leading-none mb-10 whitespace-nowrap">
          <span className="text-white text-[clamp(3.5rem,10vw,7.5rem)]">Our&nbsp;</span>
          <span
            className="font-serif font-light text-[clamp(3.5rem,10vw,7.5rem)]"
            style={{
              color: "transparent",
              WebkitTextStroke: "1px rgba(181,140,103,0.6)",
            }}
          >
            Menu
          </span>
        </h1>

        {/* Description */}
        <p
          className="font-sans text-white/60 max-w-xl mx-auto mb-12 leading-[1.85]"
          style={{ fontSize: "clamp(0.8rem, 1.2vw, 0.95rem)" }}
        >
          AfriPot restaurant invites you to explore the rich world of African
          flavours. Choose between our signature tasting menu and a plant-based
          journey, each woven from East African spice, traditional technique and
          the finest local seasons.
        </p>

        {/* CTA */}
        <Link
          to="/contact"
          className="inline-block border border-gold/60 text-gold text-[0.6rem] tracking-[0.4em] uppercase px-10 py-4 hover:bg-gold/10 transition-colors duration-300 font-sans"
        >
          MAKE A RESERVATION
        </Link>
      </section>

      {/* ── Hero Carousel ── */}
      <HeroCarousel />

      {/* ── Marquee ── */}
      <Marquee items={marqueeItems} />

      {/* ── Food Menu Carousel ── */}
      <section className="py-16">
        <div className="text-center mb-8">
          <p className="text-gold text-xs tracking-[0.35em] uppercase font-sans mb-2">
            EXPLORE OUR
          </p>
          <h2 className="text-white text-3xl font-serif tracking-wide">
            Food Menu
          </h2>
        </div>
        <MenuCarousel sections={foodSections} />
      </section>

      {/* ── Beverages Menu Carousel ── */}
      <section className="py-16 mt-16">
        <div className="text-center mb-8">
          <p className="text-gold text-xs tracking-[0.35em] uppercase font-sans mb-2">
            REFRESH WITH
          </p>
          <h2 className="text-white text-3xl font-serif tracking-wide">
            Beverages
          </h2>
        </div>
        <MenuCarousel sections={beverageSections} />
      </section>

      <SiteFooter />
    </div>
  );
}
