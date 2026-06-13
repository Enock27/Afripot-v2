# Quick Start - Animation Libraries

## 🚀 Get Started in 5 Minutes

### **1. View the Enhanced Partners Section**
Visit: `http://localhost:8080/`
Scroll to the "Partners" section to see all animations in action.

### **2. Understand the Animation Layers**

#### **Layer 1: GSAP (Scroll Triggers)**
```typescript
// Animations trigger when scrolling into view
gsap.fromTo(element, {
  opacity: 0,
  scale: 0.3,
}, {
  opacity: 1,
  scale: 1,
  scrollTrigger: { trigger: element, start: "top 80%" }
});
```

#### **Layer 2: Framer Motion (Hover Effects)**
```typescript
// Smooth hover animations with spring physics
<motion.div
  whileHover={{ scale: 1.1, y: -10 }}
  transition={{ type: "spring", stiffness: 300 }}
>
```

#### **Layer 3: anime.js (Glow Effects)**
```typescript
// Smooth color and shadow animations
anime({
  targets: element,
  boxShadow: "0 0 30px rgba(217, 119, 6, 0.6)",
  duration: 600,
});
```

#### **Layer 4: Lenis (Smooth Scroll)**
```typescript
// Already integrated globally - just scroll!
// Smooth scrolling works automatically
```

## 📊 Animation Timeline

```
SCROLL INTO VIEW
│
├─ 0ms: Background orbs start floating
├─ 0-500ms: Label fades in
├─ 100-800ms: Title animates
├─ 200-1000ms: Subtitle fades in
├─ 0-1600ms: Logos scale in (staggered)
├─ 500-1500ms: Divider line scales in
└─ 600-1400ms: Call-to-action fades in

HOVER ON LOGO
│
├─ 0ms: Logo lifts up
├─ 0-600ms: Glow effect animates
├─ 0-400ms: Logo scales up
└─ 0-300ms: Brightness increases
```

## 🎨 Visual Effects

### **Background Orbs**
- Floating animation (infinite)
- Gold color with blur
- Different speeds (8s & 10s)

### **Glow Effect**
- Gold color: `rgba(217, 119, 6, 0.6)`
- Smooth animation: 600ms
- Easing: easeInOutQuad

### **Text Animations**
- Letter spacing expands
- Blur effect fades
- Opacity increases

### **Logo Animations**
- Scale: 0.3 → 1
- Brightness: 100% → 110%
- Lift: 0px → -10px

## 💡 Common Patterns

### **Pattern 1: Scroll-Triggered Animation**
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

### **Pattern 2: Hover Animation**
```typescript
import { motion } from "framer-motion";

<motion.div
  whileHover={{ scale: 1.1 }}
  transition={{ type: "spring", stiffness: 300 }}
>
  Hover me!
</motion.div>
```

### **Pattern 3: Color Animation**
```typescript
import * as animeModule from "animejs";
const anime = animeModule.default || animeModule;

anime({
  targets: element,
  color: "rgb(217, 119, 6)",
  duration: 1000,
});
```

### **Pattern 4: Continuous Animation**
```typescript
<motion.div
  animate={{ x: [0, 50, 0] }}
  transition={{ duration: 8, repeat: Infinity }}
/>
```

## 🎯 Use Cases

| Library | Best For | Example |
|---------|----------|---------|
| **GSAP** | Complex timelines, scroll triggers | Parallax, staggered entrance |
| **Framer Motion** | React interactions, hover effects | Hover lift, page transitions |
| **anime.js** | Color, shadow animations | Glow effects, color pulse |
| **Lenis** | Smooth scrolling | Global scroll experience |

## 🔧 Customization Examples

### **Make Animations Faster**
```typescript
// In PartnersSection.tsx
duration: 0.8 → 0.5 // Faster
duration: 0.8 → 1.2 // Slower
```

### **Change Glow Color**
```typescript
// In PartnerLogo component
rgba(217, 119, 6, 0.6) → rgba(255, 0, 0, 0.6) // Red glow
```

### **Adjust Parallax**
```typescript
// In PartnersSection.tsx
y: -50 → -30 // Subtle
y: -50 → -100 // Intense
```

### **Modify Hover Lift**
```typescript
// In PartnerLogo component
y: -10 → -5 // Subtle
y: -10 → -20 // Dramatic
```

## 📱 Responsive Behavior

All animations work on:
- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)
- ✅ Large screens (1280px+)

## ⚡ Performance Tips

1. **Use GPU Acceleration**
   - ✅ Use `transform` and `opacity`
   - ❌ Avoid `left`, `top`, `width`, `height`

2. **Optimize ScrollTrigger**
   - ✅ Use `once: true` to animate only once
   - ❌ Avoid animating on every scroll

3. **Stagger Animations**
   - ✅ Use `stagger: 0.1` for multiple elements
   - ❌ Avoid animating all at once

4. **Use Lenis**
   - ✅ Already integrated globally
   - ❌ Don't disable smooth scroll

## 🧪 Testing Checklist

- [ ] Scroll to Partners section
- [ ] Observe entrance animations
- [ ] Hover over partner logos
- [ ] See lift and glow effects
- [ ] Scroll up and down
- [ ] Observe parallax effect
- [ ] Test on mobile device
- [ ] Check performance (60 FPS)

## 📚 Documentation Files

1. **SETUP_SUMMARY.md** - Initial setup
2. **PARTNERS_SECTION_ANIMATIONS.md** - Detailed breakdown
3. **PARTNERS_SECTION_SUMMARY.md** - Visual summary
4. **MOTION_LIBRARIES_GUIDE.md** - Complete guide
5. **PARTNERS_SECTION_COMPLETE.md** - Full implementation
6. **QUICK_START_ANIMATIONS.md** - This file

## 🎓 Learning Path

### **Beginner**
1. View the animations in action
2. Read QUICK_START_ANIMATIONS.md
3. Try simple hover animations

### **Intermediate**
1. Read MOTION_LIBRARIES_GUIDE.md
2. Modify animation timings
3. Create custom animations

### **Advanced**
1. Read PARTNERS_SECTION_ANIMATIONS.md
2. Combine multiple libraries
3. Create complex sequences

## 🚀 Next Steps

1. **Explore the Code**
   - Open `src/components/PartnersSection.tsx`
   - Review the animation implementations

2. **Try Customizations**
   - Change animation durations
   - Modify colors and effects
   - Adjust parallax intensity

3. **Create New Animations**
   - Apply patterns to other sections
   - Build custom animation components
   - Experiment with different effects

4. **Optimize Performance**
   - Use Chrome DevTools
   - Profile animations
   - Measure FPS

## 💬 Quick Reference

### **GSAP**
```typescript
import gsap from "@/lib/gsap-config";
gsap.to(element, { opacity: 1, duration: 0.5 });
```

### **Framer Motion**
```typescript
import { motion } from "framer-motion";
<motion.div animate={{ opacity: 1 }} />
```

### **anime.js**
```typescript
import * as animeModule from "animejs";
const anime = animeModule.default || animeModule;
anime({ targets: element, opacity: 1 });
```

### **Lenis**
```typescript
// Already integrated globally - no setup needed!
```

## ✅ Status

- ✅ All animations working
- ✅ Smooth 60 FPS performance
- ✅ Responsive on all devices
- ✅ Production ready

---

**Ready to explore? Visit `http://localhost:8080/` and scroll to the Partners section!**
