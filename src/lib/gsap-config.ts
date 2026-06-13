import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Base GSAP configuration
export const gsapConfig = {
  defaults: {
    duration: 0.6,
    ease: "power2.inOut",
  },
  scrollTrigger: {
    markers: false, // Set to true for debugging
    start: "top 80%",
    end: "top 20%",
    toggleActions: "play none none reverse",
  },
};

// Initialize GSAP with Lenis for smooth scroll
export const initializeGSAPWithLenis = (lenis: any) => {
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
};

// Common animation presets
export const animationPresets = {
  fadeIn: {
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
  },
  slideInUp: {
    y: 30,
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
  },
  slideInDown: {
    y: -30,
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
  },
  slideInLeft: {
    x: -30,
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
  },
  slideInRight: {
    x: 30,
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
  },
  scaleIn: {
    scale: 0.8,
    opacity: 0,
    duration: 0.6,
    ease: "back.out",
  },
};

export default gsap;
