# Partners Section - Advanced Motion Animations

## Overview
The Partners section has been completely redesigned with advanced animations using all four motion libraries (GSAP, Framer Motion, Lenis, and anime.js) to create an engaging, attention-grabbing experience.

## Animation Libraries Used

### 1. **GSAP (GreenSock Animation Platform)**
- **Scroll Trigger Integration**: Animations trigger when the section comes into view
- **Parallax Effect**: Subtle parallax movement as user scrolls
- **Staggered Entrance**: Partner logos scale up and fade in with staggered timing
- **Letter Spacing Animation**: Title animates with expanding letter spacing
- **Blur Effect**: Subtitle fades in with blur effect removal

**Key Features:**
- `ScrollTrigger` for scroll-based animations
- `back.out` easing for bouncy entrance
- Staggered delays (0.2s between each logo)
- Parallax scrubbing (1:1 scroll ratio)

### 2. **Framer Motion**
- **Hover Effects**: Logos lift up on hover with spring physics
- **Staggered Container**: Children animate in sequence
- **Animated Background Orbs**: Floating background elements with infinite loop
- **Viewport-based Animations**: Elements animate when they enter the viewport
- **Smooth Transitions**: All interactions use spring physics for natural motion

**Key Features:**
- `whileInView` for viewport-triggered animations
- `whileHover` for interactive hover states
- `animate` for continuous background animations
- Spring physics (`stiffness: 300, damping: 20`)

### 3. **anime.js**
- **Glow Effect**: Dynamic box-shadow glow on hover
- **Color Pulse**: Label text color animation
- **Smooth Easing**: `easeInOutQuad` for smooth transitions

**Key Features:**
- Box-shadow animation for glow effect
- Color transitions with smooth easing
- Duration-based animations (600ms for glow)

### 4. **Lenis (Smooth Scroll)**
- **Global Integration**: Smooth scrolling throughout the page
- **Parallax Compatibility**: Works seamlessly with GSAP parallax
- **Scroll Velocity**: Smooth deceleration for natural feel

## Component Structure

### PartnersSection Component
Main container with:
- Animated background orbs
- Header section with staggered animations
- Partner logos grid
- Animated divider line
- Call-to-action with pulsing animation

### PartnerLogo Component
Individual logo with:
- GSAP entrance animation (scale + opacity)
- Framer Motion hover lift effect
- anime.js glow effect on hover
- Brightness increase on hover

## Animation Timeline

### On Page Load (Scroll into View)
1. **0ms**: Background orbs start floating
2. **0-500ms**: Label fades in and moves up
3. **100-800ms**: Title animates with letter spacing
4. **200-1000ms**: Subtitle fades in with blur removal
5. **0-1600ms**: Partner logos scale up and fade in (staggered)
6. **500-1500ms**: Divider line scales in
7. **600-1400ms**: Call-to-action fades in

### On Hover (Partner Logo)
1. **0ms**: Logo starts lifting (Framer Motion)
2. **0-600ms**: Glow effect animates in (anime.js)
3. **0-400ms**: Logo scales up (GSAP)
4. **0-300ms**: Brightness increases

### On Scroll
- **Parallax Effect**: Section moves up slightly as user scrolls down
- **Smooth Scroll**: Lenis provides smooth scrolling experience

## Animation Properties

### GSAP Animations
```typescript
// Entrance animation
gsap.fromTo(element, {
  opacity: 0,
  scale: 0.3,
  y: 50,
}, {
  opacity: 1,
  scale: 1,
  y: 0,
  duration: 0.8,
  delay: index * 0.2,
  ease: "back.out",
  scrollTrigger: { ... }
});

// Parallax effect
gsap.to(section, {
  scrollTrigger: { ... },
  y: -50,
  opacity: 1,
});
```

### Framer Motion Animations
```typescript
// Hover effect
<motion.div
  whileHover={{ y: -10 }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
>

// Viewport animation
<motion.h2
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.1 }}
  viewport={{ once: true }}
>

// Continuous animation
<motion.div
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
```

### anime.js Animations
```typescript
// Glow effect
anime({
  targets: element,
  boxShadow: [
    { value: "0 0 0px rgba(217, 119, 6, 0)" },
    { value: "0 0 30px rgba(217, 119, 6, 0.6)" },
  ],
  duration: 600,
  easing: "easeInOutQuad",
});

// Color pulse
anime({
  targets: element,
  color: [
    { value: "rgb(217, 119, 6)" },
    { value: "rgb(217, 119, 6)" },
  ],
  opacity: [0, 1, 1],
  duration: 1500,
  easing: "easeInOutQuad",
});
```

## Performance Considerations

1. **ScrollTrigger Optimization**: Uses `scrub: 1` for smooth parallax
2. **Viewport Detection**: `once: true` prevents re-animation on scroll
3. **GPU Acceleration**: Uses `transform` and `opacity` for smooth animations
4. **Staggered Timing**: Prevents simultaneous animations for better performance
5. **Infinite Loops**: Background orbs use `repeat: Infinity` for continuous motion

## Browser Compatibility

- **GSAP**: All modern browsers
- **Framer Motion**: React 16.8+
- **anime.js**: All modern browsers
- **Lenis**: All modern browsers with requestAnimationFrame support

## Customization

### Adjust Animation Speed
```typescript
// In PartnersSection.tsx
duration: 0.8, // Change to 0.5 for faster, 1.2 for slower
```

### Change Glow Color
```typescript
// In PartnerLogo component
boxShadow: "0 0 30px rgba(217, 119, 6, 0.6)" // Change RGB values
```

### Modify Parallax Intensity
```typescript
// In PartnersSection.tsx
y: -50, // Change to -30 for subtle, -100 for intense
```

### Adjust Hover Lift Height
```typescript
// In PartnerLogo component
whileHover={{ y: -10 }} // Change to -5 or -20
```

## Testing

To test the animations:
1. Visit `http://localhost:8080/`
2. Scroll to the Partners section
3. Observe the entrance animations
4. Hover over partner logos to see interactive effects
5. Scroll up and down to see parallax effect

## Files Modified

- `src/components/PartnersSection.tsx` - New component with all animations
- `src/routes/index.tsx` - Updated to use PartnersSection component

## Future Enhancements

1. Add click interactions to partner logos
2. Implement modal/lightbox for partner details
3. Add more complex GSAP timeline sequences
4. Implement 3D transforms with Three.js
5. Add sound effects with animation triggers
