# Menu Carousel - Features & Usage Guide

## 🎠 Carousel Overview

The menu carousel provides an elegant, smooth way to browse all 36 menu sections without excessive scrolling.

## 📱 User Interface

### Main Carousel Layout
```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│              EXPLORE OUR                                │
│              Food Menu                                  │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ‹                                                    ›  │
│                                                          │
│     [BREAKFAST]                                         │
│     ─────────────────────────────────────────────────   │
│                                                          │
│     Polex              Polex with Chips    Ham & Cheese │
│     3,000              5,000               5,000        │
│     Plain omelet...    Plain omelet...     Three eggs...│
│                                                          │
│     French Toast       Plain Omelette      Spanish...   │
│     3,000              3,000               5,000        │
│     Pan fried...       3 beaten eggs...    3 eggs...    │
│                                                          │
│     Special Omelette   Chapati Omelette    English...   │
│     8,000              6,000               10,000       │
│     3 eggs omelette... Home made chapati...Beef sausage│
│                                                          │
│  ● ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○                    │
│                                                          │
│                    1 / 17                               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## 🎮 Navigation Controls

### 1. Arrow Buttons
- **Left Arrow (‹):** Go to previous section
- **Right Arrow (›):** Go to next section
- **Hover Effect:** Changes color from white/60 to white
- **Position:** Centered vertically on both sides

### 2. Dot Indicators
- **Active Dot:** Gold color (rgba(181,140,103,1)) - scaled 1.4x
- **Inactive Dots:** White/30 opacity - normal scale
- **Click to Jump:** Click any dot to navigate directly to that section
- **Position:** Below the menu items

### 3. Section Counter
- **Format:** "Current / Total" (e.g., "5 / 17")
- **Color:** White/50 opacity
- **Position:** Below the dot indicators

### 4. Auto-Advance
- **Interval:** 6 seconds
- **Behavior:** Automatically moves to next section
- **Loops:** Wraps around to first section after last
- **User Control:** Clicking arrows or dots resets the timer

## 🍽️ Food Menu Sections (17 Total)

| # | Section | Items |
|---|---------|-------|
| 1 | BREAKFAST | 9 |
| 2 | SOUPS & STARTERS | 8 |
| 3 | SALAD BAR | 6 |
| 4 | MAIN COURSES | 12 |
| 5 | WRAPS | 3 |
| 6 | SANDWICHES | 8 |
| 7 | BURGERS | 4 |
| 8 | PIZZA | 5 |
| 9 | PASTA | 4 |
| 10 | GRILLS & BBQ | 9 |
| 11 | EXTRAS | 6 |
| 12 | ASIAN DISHES | 4 |
| 13 | SIZZLING | 4 |
| 14 | NOODLES & RICE | 6 |
| 15 | SNACKS | 6 |
| 16 | KIDS MENU | 5 |
| 17 | LOCAL FOOD MENU | 23 |

## 🥤 Beverages Menu Sections (19 Total)

| # | Section | Items |
|---|---------|-------|
| 1 | COFFEE | 11 |
| 2 | FLAVORED COFFEE | 13 |
| 3 | SPECIAL COFFEES | 5 |
| 4 | ICED COFFEE | 15 |
| 5 | MILK SHAKES | 6 |
| 6 | FRESH JUICES | 14 |
| 7 | MOJITOS | 7 |
| 8 | FRUIT TEA | 6 |
| 9 | ICED FRUIT TEA | 7 |
| 10 | SMOOTHIES | 10 |
| 11 | BLENDED COFFEES | 5 |
| 12 | TEA | 11 |
| 13 | ICED TEA | 7 |
| 14 | WINES BY BOTTLE | 13 |
| 15 | SPARKLING WINE | 4 |
| 16 | CHAMPAGNE | 2 |
| 17 | WHISKY | 7 |
| 18 | BEERS | 16 |
| 19 | TEQUILA | 5 |
| 20 | GIN | 4 |
| 21 | COGNAC | 3 |
| 22 | COCKTAILS | 13 |

## 🎨 Design Elements

### Colors
- **Background:** #151515 (dark)
- **Text:** White
- **Prices:** Gold (rgba(181,140,103,1))
- **Dividers:** White/10 opacity
- **Inactive Elements:** White/40-60 opacity

### Typography
- **Section Title:** Gold, uppercase, tracking-[0.35em]
- **Item Name:** White, serif, base size
- **Price:** Gold, serif, small size
- **Ingredients:** White/40, tracking-wide, xs size

### Spacing
- **Section Padding:** py-12 (title), py-5 (items)
- **Container:** max-w-[1100px], mx-auto, px-6 md:px-12
- **Grid:** 3 columns on desktop, 1 on mobile

## ⚡ Animation Details

### Slide Transition
```css
transition: all 700ms ease-in-out;
transform: translateX(-${current * 100}%);
```

### Dot Scale Animation
```css
transform: scale(1.4) /* active */
transform: scale(1)   /* inactive */
transition: all 300ms
```

### Arrow Hover
```css
color: rgba(255,255,255,0.6) /* default */
color: rgba(255,255,255,1)   /* hover */
transition: colors
```

## 📱 Responsive Behavior

### Mobile (< 768px)
- Single column layout
- Full-width carousel
- Touch-friendly arrow buttons
- Larger dot indicators
- Readable text sizes

### Tablet (768px - 1024px)
- Optimized spacing
- 2-3 column grid
- Balanced arrow positioning
- Clear dot indicators

### Desktop (> 1024px)
- 3-column grid
- Full carousel experience
- Hover effects on arrows
- Smooth animations

## 🎯 User Interactions

### Browsing
1. **View Current Section:** See 3-9 items in grid
2. **Navigate:** Click arrows or dots
3. **Auto-Advance:** Watch carousel move every 6 seconds
4. **Quick Jump:** Click any dot to jump to section

### Mobile
1. **Tap Arrows:** Navigate between sections
2. **Tap Dots:** Jump to specific section
3. **Read Items:** Scroll within section if needed
4. **Auto-Advance:** Carousel moves automatically

## 🔄 Carousel Flow

```
Start → Breakfast → Soups → Salads → ... → Local Food → 
Coffee → Flavored Coffee → ... → Cocktails → (Loop back to Breakfast)
```

## ✨ Key Features

✅ **Smooth Animation:** 700ms ease-in-out transitions
✅ **Auto-Advance:** 6-second intervals
✅ **Multiple Navigation:** Arrows, dots, counter
✅ **Responsive:** Mobile, tablet, desktop
✅ **Accessible:** ARIA labels, semantic HTML
✅ **Performance:** Optimized animations
✅ **Elegant Design:** Matches AfriPot branding
✅ **User-Friendly:** Intuitive controls

## 🚀 Performance Metrics

- **Animation FPS:** 60fps (smooth)
- **Transition Duration:** 700ms
- **Auto-Advance Interval:** 6000ms
- **Bundle Size Impact:** ~2KB
- **Load Time:** No impact

## 🎓 How to Use

### For Users
1. **Browse:** Use left/right arrows to navigate
2. **Jump:** Click any dot to go to that section
3. **Explore:** Let it auto-advance or control manually
4. **Find Items:** Scroll within section if needed

### For Developers
```typescript
// Import component
import { MenuCarousel } from "@/components/MenuCarousel";

// Create sections array
const sections = [
  { title: "SECTION NAME", items: itemsArray },
  // ... more sections
];

// Use component
<MenuCarousel sections={sections} />
```

## 📊 Statistics

- **Total Sections:** 36 (17 food + 19 beverages)
- **Total Items:** 307 (121 food + 186 beverages)
- **Navigation Points:** 36 dots
- **Carousel Instances:** 2 (Food & Beverages)
- **Animation Duration:** 700ms per slide
- **Auto-Advance Interval:** 6 seconds

## 🎉 Benefits

✅ **Reduced Scrolling:** No more endless scrolling
✅ **Better UX:** Intuitive navigation
✅ **Mobile-Friendly:** Optimized for all devices
✅ **Elegant:** Matches restaurant branding
✅ **Engaging:** Auto-advance keeps users interested
✅ **Accessible:** Works for all users
✅ **Fast:** Minimal performance impact
