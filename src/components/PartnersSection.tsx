import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "@/lib/gsap-config";
import staffordLogo from "@/assets/STAFFORD COFFEE BREWERS LOGO.png";
import anithLogo from "@/assets/Anitha.png";
import afriPotLogo from "@/assets/AfriPot_logo2.png";

interface PartnerLogoProps {
  src: string;
  alt: string;
  index: number;
  size?: "small" | "large";
}

const PartnerLogo: React.FC<PartnerLogoProps> = ({ src, alt, index, size = "large" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current) return;

    // GSAP: Staggered entrance animation with scale and opacity
    gsap.fromTo(
      containerRef.current,
      {
        opacity: 0,
        scale: 0.3,
        y: 50,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.2,
        ease: "back.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      gsap.killTweensOf(containerRef.current);
    };
  }, [index]);

  const containerHeight = "h-36 sm:h-44 md:h-52";
  const imageSizeClass =
    size === "small"
      ? "max-h-24 sm:max-h-28 md:max-h-32"
      : "max-h-36 sm:max-h-40 md:max-h-48";

  return (
    <motion.div
      ref={containerRef}
      className={`flex items-center justify-center ${containerHeight} rounded-lg transition-all duration-300 cursor-pointer group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.img
        ref={imageRef}
        src={src}
        alt={alt}
        className={`partner-logo ${imageSizeClass} max-w-full object-contain filter group-hover:brightness-110 transition-all duration-300`}
        animate={{
          y: isHovered ? 0 : [0, -8, 0],
          rotateZ: isHovered ? 0 : [0, 2, -2, 0],
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{
          y: {
            duration: 4,
            repeat: isHovered ? 0 : Infinity,
            ease: "easeInOut",
          },
          rotateZ: {
            duration: 5,
            repeat: isHovered ? 0 : Infinity,
            ease: "easeInOut",
          },
          scale: {
            duration: 0.3,
            ease: "easeOut",
          },
        }}
        whileHover={{
          filter: "brightness(1.3) drop-shadow(0 0 20px rgba(217, 119, 6, 0.6))",
        }}
      />
    </motion.div>
  );
};

export const PartnersSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // GSAP: Parallax effect on scroll
    gsap.to(sectionRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom center",
        scrub: 1,
        markers: false,
      },
      y: -50,
      opacity: 1,
    });

    // GSAP: Animate title with letter spacing
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 30,
          letterSpacing: "-0.05em",
        },
        {
          opacity: 1,
          y: 0,
          letterSpacing: "0em",
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // GSAP: Animate subtitle with blur effect
    if (subtitleRef.current) {
      gsap.fromTo(
        subtitleRef.current,
        {
          opacity: 0,
          y: 20,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          delay: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // GSAP: Animated label with opacity fade-in
    if (labelRef.current) {
      gsap.fromTo(
        labelRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        }
      );
    }
  }, []);

  const partners: Array<{
    src: string;
    alt: string;
    size?: "small" | "large";
  }> = [
    { src: staffordLogo, alt: "Stafford Coffee Brewers", size: "small" },
    { src: anithLogo, alt: "Anitha", size: "small" },
    { src: afriPotLogo, alt: "AfriPot", size: "large" },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-24 md:py-32 lg:py-40 px-4 sm:px-6 md:px-8 lg:px-12 bg-white relative overflow-hidden"
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="mx-auto max-w-[1400px] relative z-10">
        {/* Header with animations */}
        <motion.div
          className="text-center mb-16 sm:mb-20 md:mb-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.p
            ref={labelRef}
            className="text-[0.65rem] sm:text-xs tracking-[0.4em] uppercase text-gold mb-4 sm:mb-6 font-semibold"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Our Partners
          </motion.p>

          <motion.h2
            ref={titleRef}
            className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight text-gray-900 mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Trusted by the best
          </motion.h2>

          <motion.p
            ref={subtitleRef}
            className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            We collaborate with industry leaders to bring you the finest culinary
            experience
          </motion.p>
        </motion.div>

        {/* Partners Grid with staggered animations */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {partners.map((partner, index) => (
            <PartnerLogo
              key={index}
              src={partner.src}
              alt={partner.alt}
              size={partner.size}
              index={index}
            />
          ))}
        </motion.div>

        {/* Animated divider line */}
        <motion.div
          className="mt-16 sm:mt-20 md:mt-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
        />

        {/* Call to action with animation */}
        <motion.div
          className="mt-12 sm:mt-16 md:mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.p
            className="text-xs sm:text-sm text-gray-700 tracking-[0.2em] uppercase"
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ✦ Partnerships that elevate excellence ✦
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};
