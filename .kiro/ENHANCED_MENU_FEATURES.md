# Enhanced Menu Page - Complete Feature Documentation

## Overview
The menu page has been completely transformed into a stunning, modern, interactive experience with premium animations and interactions using GSAP, Framer Motion, and Lenis.

## 🎬 Key Features Implemented

### 1. **Scroll Progress Bar**
- Thin colored progress bar at the top of the page
- Shows scroll position through the entire menu
- Gradient from amber-500 to amber-400
- Updates in real-time as user scrolls

### 2. **Hero Section with Parallax**
- Full-width hero with parallax background effect
- Title "Our Menu" with staggered fade-in animations
- Subtitle fades in after title
- Parallax depth: background moves at 0.3x scroll speed
- Dark elegant theme: bg-zinc-950, text-white, accent amber-400

### 3. **Sticky Category Navigation**
- Horizontal scrollable pill tabs for all menu categories
- Active tab highlighted with animated underline
- Underline slides smoothly between tabs using GSAP
- Categories: Breakfast, Starters, Salads, Mains, Wraps, Sandwiches, Burgers, Pizza, Pasta, Grills, Asian, Local Food, Beverages
- Smooth scroll to section on click using Lenis

### 4. **Interactive Menu Item Cards**
Each card features:

**Front Side:**
- Gradient background (amber-900 to zinc-900)
- Food image placeholder with hover scale effect
- Item name (serif font, elegant)
- Description (2 lines, truncated)
- Price display
- "Add" button
- Floating badges: "Chef's Pick" (animated float) or "New" (pulsing)

**Back Side (on click/tap):**
- Full description
- Allergen information
- Calorie count
- "Add to Order" CTA button
- Smooth 3D flip animation (rotateY 180deg)

**Hover Interactions:**
- Card lifts up: translateY(-8px)
- Image scales: scale(1.05)
- Shadow grows
- Button appears/animates
- Price tag bounces slightly
- All transitions: 0.3s smooth

**Scroll Animations:**
- Cards animate in from bottom as user scrolls
- Staggered by 0.15s each
- Start: opacity 0, translateY 60px
- End: opacity 1, translateY 0
- Uses GSAP ScrollTrigger

### 5. **Floating Badges**
- "Chef's Pick" badge: floats with subtle CSS keyframe animation
- "New" badge: pulses with glow effect
- Positioned top-right of card
- Amber-500 for Chef's Pick, red-500 for New

### 6. **Search Functionality**
- Floating search icon in bottom-right corner
- Click expands into full search bar with smooth width animation
- Real-time menu filtering as user types
- Non-matching cards fade out
- Matching cards remain visible
- Search across item names and descriptions

### 7. **Category Transitions**
- When switching between category tabs:
  - Old items fade + slide left
  - New items fade + slide in from right
  - Uses Framer Motion AnimatePresence with mode="wait"
  - Duration: 0.3s smooth transition

### 8. **Back to Top Button**
- Appears after scrolling 300px down
- Fixed position bottom-right (below search)
- Smooth scroll to top on click
- Animated entrance/exit
- Hover scale effect

### 9. **Mobile Experience**
- Bottom sticky tab bar for category navigation
- Cards are responsive: 1 col mobile, 2 cols tablet, 3 cols desktop
- Touch-friendly card tap to flip
- Floating buttons remain accessible
- Optimized spacing and padding

### 10. **Visual Theme**
- **Dark Elegant Theme:**
  - Background: bg-zinc-950
  - Text: text-white
  - Accent: amber-400 / amber-500
  - Borders: amber-900/30
  - Hover states: amber-400

- **Typography:**
  - Headings: Serif font (Cormorant Garamond)
  - Body: Inter font
  - Elegant and premium feel

## 🎨 Animation Details

### GSAP Animations
- **ScrollTrigger:** Cards animate in on scroll
- **Timeline:** Staggered animations for multiple elements
- **Easing:** power2.out for smooth, natural motion
- **Duration:** 0.6s for card entrance, 0.4s for underline

### Framer Motion Animations
- **Card Flip:** rotateY 180deg, spring physics (stiffness: 100)
- **Hover Effects:** scale, translateY, shadow
- **Transitions:** smooth 0.3s for all interactions
- **AnimatePresence:** Category switching with mode="wait"
- **Stagger:** 0.15s delay between card animations

### Lenis Smooth Scroll
- Applied to entire menu page
- Smooth, buttery scroll experience
- Lerp: 0.08 for natural motion

## 📊 Menu Data Structure

Each menu item includes:
- `name`: Item name
- `desc`: Description
- `price`: Price in USD
- `badge`: Optional "chef" or "new" badge

### Categories (13 total):
1. Breakfast (4 items)
2. Starters & Soups (4 items)
3. Salad Bar (4 items)
4. Main Courses (4 items)
5. Wraps (4 items)
6. Sandwiches (4 items)
7. Burgers (4 items)
8. Pizza (4 items)
9. Pasta (4 items)
10. Grills & BBQ (4 items)
11. Asian Dishes (4 items)
12. Local Food Menu (4 items)
13. Beverages (13 items)

## 🔧 Technical Implementation

### Components
- `MenuItemCard`: Individual card with flip animation
- `CategoryNav`: Navigation with animated underline
- `SearchBar`: Expandable search with filtering
- `BackToTopButton`: Scroll-triggered button
- `MenuPage`: Main page component

### State Management
- `activeCategory`: Current selected category
- `searchQuery`: Search input value
- `scrollProgress`: Scroll position percentage
- `isFlipped`: Card flip state
- `isOpen`: Search bar open state
- `isVisible`: Back to top button visibility

### Hooks Used
- `useState`: State management
- `useEffect`: Scroll listeners, GSAP animations
- `useRef`: DOM element references for GSAP
- `AnimatePresence`: Framer Motion presence detection

## 📱 Responsive Design

**Mobile (< 768px):**
- 1 column card grid
- Horizontal scrolling category nav
- Full-width cards
- Touch-friendly interactions
- Floating buttons remain accessible

**Tablet (768px - 1024px):**
- 2 column card grid
- Full category nav display
- Optimized spacing

**Desktop (> 1024px):**
- 3 column card grid
- Full category nav with smooth underline
- Maximum width: 1400px
- Optimal spacing and padding

## 🎯 User Interactions

1. **Page Load:**
   - Scroll progress bar appears
   - Hero section fades in with stagger
   - Category nav is sticky and ready

2. **Scrolling:**
   - Progress bar updates
   - Cards animate in as they come into view
   - Category nav remains sticky

3. **Category Selection:**
   - Underline animates to new tab
   - Content cross-fades
   - Smooth transition

4. **Card Interaction:**
   - Hover: Card lifts, image scales, button appears
   - Click: Card flips to show details
   - Click again: Card flips back

5. **Search:**
   - Click search icon to expand
   - Type to filter menu
   - Non-matching items fade out
   - Click search icon again to close

6. **Scroll Down:**
   - Back to top button appears after 300px
   - Click to smooth scroll to top

## 🚀 Performance Optimizations

- GSAP ScrollTrigger for efficient scroll animations
- Framer Motion for GPU-accelerated transforms
- Lazy animation initialization
- Efficient state updates
- Optimized re-renders with AnimatePresence

## 📝 Browser Support

- Modern browsers with CSS 3D transforms
- Smooth scroll support
- CSS Grid and Flexbox
- ES6+ JavaScript features

## 🎓 Future Enhancements

- Add actual food images
- Implement cart functionality
- Add dietary filters (vegan, gluten-free, etc.)
- Implement favorites/bookmarks
- Add nutritional information
- Implement ordering system
- Add reviews and ratings
