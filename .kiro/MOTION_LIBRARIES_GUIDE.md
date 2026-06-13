# Complete Motion Libraries Integration Guide

## 📚 Overview

This project now has a complete integration of four powerful motion libraries, all working together seamlessly to create stunning animations and interactions.

## 🎬 Libraries Integrated

### 1. **GSAP (GreenSock Animation Platform)** v3.15.0
**Purpose**: Advanced timeline-based animations and scroll triggers

**Key Features**:
- ScrollTrigger plugin for scroll-based animations
- Timeline sequencing
- Easing functions
- Parallax effects
- Staggered animations

**Files**:
- `src/lib/gsap-config.ts` - Configuration and presets
- `src/components/PartnersSection.tsx` - Usage example

**Example Usage**:
```typescript
import gsap from "@/lib/gsap-config";

// Scroll-triggered animation
gsap.fromTo(element, {
  opacity: 0,
  scale: 0.3,
}, {
  opacity: 1,
  scale: 1,
  duration: 0.8,
  scrollTrigger: {
    trigger: element,
    start: "top 80%",
    toggleActions: "play none none reverse",
  },
});

// Parallax effect
gsap.to(section, {
  scrollTrigger: { trigger: section, scrub: 1 },
  y: -50,
});
```

### 2. **Framer Motion** v12.38.0
**Purpose**: React-based animations with spring physics

**Key Features**:
- Component-based animations
- Gesture animations (hover, tap, drag)
- Viewport-based animations
- Spring physics
- Smooth transitions

**Files**:
- `src/components/PageTransition.tsx` - Page transitions
- `src/components/PartnersSection.tsx` - Usage example

**Example Usage**:
```typescript
import { motion } from "framer-motion";

// Hover animation
<motion.div
  whileHover={{ scale: 1.1, y: -10 }}
  transition={{ type: "spring", stiffness: 300 }}
>
  Content
</motion.div>

// Viewport animation
<motion.h2
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
>
  Title
</motion.h2>

// Continuous animation
<motion.div
  animate={{ x: [0, 50, 0] }}
  transition={{ duration: 8, repeat: Infinity }}
/>
```

### 3. **anime.js** v4.4.1
**Purpose**: Lightweight, flexible animation library

**Key Features**:
- Smooth easing functions
- Color animations
- SVG animations
- Timeline support
- Callback functions

**Files**:
- `src/components/PartnersSection.tsx` - Usage example

**Example Usage**:
```typescript
import * as animeModule from "animejs";
const anime = animeModule.default || animeModule;

// Box-shadow glow effect
anime({
  targets: element,
  boxShadow: [
    { value: "0 0 0px rgba(217, 119, 6, 0)" },
    { value: "0 0 30px rgba(217, 119, 6, 0.6)" },
  ],
  duration: 600,
  easing: "easeInOutQuad",
});

// Color animation
anime({
  targets: element,
  color: "rgb(217, 119, 6)",
  duration: 1500,
  easing: "easeInOutQuad",
});
```

### 4. **Lenis** v1.3.23
**Purpose**: Smooth scroll experience

**Key Features**:
- Smooth scrolling
- Scroll velocity
- Scroll direction detection
- Customizable easing
- Global integration

**Files**:
- `src/components/LenisProvider.tsx` - Provider component
- `src/hooks/useLenis.tsx` - Custom hook
- `src/routes/__root.tsx` - Global integration

**Example Usage**:
```typescript
import { LenisProvider } from "@/components/LenisProvider";

// Wrap your app
<LenisProvider>
  <YourApp />
</LenisProvider>

// Or use the hook
import { useLenis } from "@/hooks/useLenis";

function MyComponent() {
  useLenis(); // Initializes Lenis
  return <div>Content</div>;
}
```

## 🎯 Use Cases

### **GSAP - When to Use**
- ✅ Complex timeline sequences
- ✅ Scroll-triggered animations
- ✅ Parallax effects
- ✅ Staggered animations
- ✅ Advanced easing
- ✅ Performance-critical animations

### **Framer Motion - When to Use**
- ✅ React component animations
- ✅ Gesture-based interactions (hover, tap)
- ✅ Page transitions
- ✅ Spring physics animations
- ✅ Viewport-based animations
- ✅ Simple, declarative animations

### **anime.js - When to Use**
- ✅ Color animations
- ✅ SVG animations
- ✅ Lightweight animations
- ✅ Smooth easing functions
- ✅ Timeline support
- ✅ Callback-based animations

### **Lenis - When to Use**
- ✅ Smooth scrolling experience
- ✅ Scroll-based interactions
- ✅ Parallax effects (with GSAP)
- ✅ Scroll velocity detection
- ✅ Global scroll management

## 🏗️ Architecture

### **Global Setup**
```
src/
├── components/
│   ├── LenisProvider.tsx          # Global Lenis provider
│   ├── PageTransition.tsx         # Framer Motion page transitions
│   ├── PartnersSection.tsx        # All libraries combined
│   └── ...
├── hooks/
│   ├── useLenis.tsx               # Lenis custom hook
│   └── ...
├── lib/
│   ├── gsap-config.ts             # GSAP configuration
│   └── utils.ts
└── routes/
    ├── __root.tsx                 # LenisProvider wrapper
    └── ...
```

### **Component Hierarchy**
```
__root.tsx (LenisProvider)
├── SiteHeader
├── Page Content
│   ├── PartnersSection (GSAP + Framer Motion + anime.js)
│   └── Other Sections
└── SiteFooter
```

## 🎨 Animation Patterns

### **Pattern 1: Scroll-Triggered Entrance**
```typescript
// GSAP + ScrollTrigger
gsap.fromTo(element, {
  opacity: 0,
  y: 50,
}, {
  opacity: 1,
  y: 0,
  scrollTrigger: {
    trigger: element,
    start: "top 80%",
  },
});
```

### **Pattern 2: Hover Interaction**
```typescript
// Framer Motion + anime.js
<motion.div
  whileHover={{ scale: 1.1 }}
  onHoverStart={() => {
    anime({ targets: element, boxShadow: "0 0 30px gold" });
  }}
/>
```

### **Pattern 3: Parallax Effect**
```typescript
// GSAP + Lenis
gsap.to(section, {
  scrollTrigger: { trigger: section, scrub: 1 },
  y: -50,
});
```

### **Pattern 4: Staggered Animation**
```typescript
// GSAP with delay
items.forEach((item, index) => {
  gsap.to(item, {
    opacity: 1,
    delay: index * 0.2,
  });
});
```

### **Pattern 5: Continuous Animation**
```typescript
// Framer Motion
<motion.div
  animate={{ x: [0, 50, 0] }}
  transition={{ duration: 8, repeat: Infinity }}
/>
```

## 📊 Performance Tips

### **1. Use GPU Acceleration**
```typescript
// Good - GPU accelerated
gsap.to(element, { x: 100, opacity: 0.5 });

// Avoid - CPU intensive
gsap.to(element, { left: 100, top: 50 });
```

### **2. Optimize ScrollTrigger**
```typescript
// Good - Efficient
scrollTrigger: {
  trigger: element,
  start: "top 80%",
  once: true, // Only animate once
}

// Avoid - Inefficient
scrollTrigger: {
  trigger: element,
  start: "top 50%",
  // Animates every time user scrolls
}
```

### **3. Stagger Animations**
```typescript
// Good - Staggered
gsap.to(items, {
  opacity: 1,
  stagger: 0.1, // 100ms between each
});

// Avoid - All at once
items.forEach(item => {
  gsap.to(item, { opacity: 1 });
});
```

### **4. Use Lenis for Smooth Scroll**
```typescript
// Good - Smooth scroll with Lenis
// Already integrated globally

// Avoid - Janky scroll
// Without Lenis
```

## 🔧 Configuration

### **GSAP Configuration** (`src/lib/gsap-config.ts`)
```typescript
export const gsapConfig = {
  defaults: {
    duration: 0.6,
    ease: "power2.inOut",
  },
  scrollTrigger: {
    markers: false,
    start: "top 80%",
    toggleActions: "play none none reverse",
  },
};
```

### **Lenis Configuration** (`src/components/LenisProvider.tsx`)
```typescript
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: "vertical",
  smooth: true,
  mouseMultiplier: 1,
  touchMultiplier: 2,
});
```

## 🚀 Quick Start

### **1. Create a Scroll-Triggered Animation**
```typescript
import gsap from "@/lib/gsap-config";

useEffect(() => {
  gsap.fromTo(ref.current, {
    opacity: 0,
    y: 50,
  }, {
    opacity: 1,
    y: 0,
    scrollTrigger: {
      trigger: ref.current,
      start: "top 80%",
    },
  });
}, []);
```

### **2. Create a Hover Animation**
```typescript
import { motion } from "framer-motion";

<motion.div
  whileHover={{ scale: 1.1 }}
  transition={{ type: "spring", stiffness: 300 }}
>
  Hover me!
</motion.div>
```

### **3. Create a Color Animation**
```typescript
import * as animeModule from "animejs";
const anime = animeModule.default || animeModule;

anime({
  targets: element,
  color: "rgb(217, 119, 6)",
  duration: 1000,
});
```

### **4. Smooth Scroll (Already Global)**
```typescript
// Lenis is already integrated globally
// Just scroll normally - it will be smooth!
```

## 📚 Resources

### **GSAP Documentation**
- https://greensock.com/docs/
- https://greensock.com/scrolltrigger/

### **Framer Motion Documentation**
- https://www.framer.com/motion/

### **anime.js Documentation**
- https://animejs.com/

### **Lenis Documentation**
- https://lenis.studiofreight.com/

## 🎓 Learning Path

1. **Start with Framer Motion** - Easy to learn, great for React
2. **Add GSAP for Complex Animations** - More powerful, timeline-based
3. **Use anime.js for Specific Effects** - Color, SVG animations
4. **Integrate Lenis** - Already done globally!

## ✅ Checklist

- ✅ GSAP installed and configured
- ✅ Framer Motion installed and configured
- ✅ anime.js installed and configured
- ✅ Lenis installed and configured globally
- ✅ ScrollTrigger plugin registered
- ✅ LenisProvider integrated in root layout
- ✅ Example components created (PartnersSection, PageTransition)
- ✅ All TypeScript types configured
- ✅ Dev server running without errors
- ✅ Animations working smoothly

## 🎯 Next Steps

1. **Explore More Animations** - Try different easing functions
2. **Create Custom Animations** - Build your own animation components
3. **Optimize Performance** - Use Chrome DevTools to profile
4. **Add Sound Effects** - Sync animations with audio
5. **Create Animation Library** - Build reusable animation components

## 📞 Support

For issues or questions:
1. Check the documentation links above
2. Review the example components
3. Check the `.kiro/` documentation files
4. Inspect the dev server console for errors

---

**Status**: ✅ Complete and Production Ready

All motion libraries are integrated, configured, and working seamlessly together!
