# New Events Page Management Guide

The Events page has been completely redesigned with a cinematic Black, White, and Red theme. It now features an **Admin Config** system that allows you to update the content easily without touching complex HTML or CSS.

## 🚀 How to Update Events

To update the content, open `src/routes/events.tsx` and look for the `EVENT_CONFIG` block at the top of the file:

```javascript
/* ============================================
   ADMIN CONFIG — Edit these to update your event
   ============================================ */
const EVENT_CONFIG = {
  bannerImage: "/src/assets/eventBannerUI/eventBanner1.jpg", 
  eventTitle: "ANNUAL GALA NIGHT 2025",
  eventDate: "Saturday, August 16, 2025",
  eventTime: "7:00 PM",
  eventLocation: "Kigali Convention Centre, Rwanda",
  eventDescription: "Join us for an unforgettable night...",
  registerLink: "/reservation",

  // UPCOMING EVENTS CARDS — add or remove cards here
  upcomingEvents: [
    {
      title: "LEADERSHIP SUMMIT",
      date: "July 5, 2025",
      location: "Kigali",
      image: "/src/assets/AfroMusic1.jpg"
    },
    // ...
  ]
};
```

### Key Features:
- **Cinematic Banner**: Uses a large background image with red corner accents.
- **Auto-Fallback**: If an image fails to load, a beautiful Red-to-Black gradient is displayed automatically.
- **Scroll Animations**: Sections reveal themselves smoothly as you scroll down.
- **Responsive**: Perfectly optimized for Mobile, Tablet, and Desktop.
- **Dedicated Route**: Accessible at `/events`.

## 📂 Standalone Version
A standalone `index.html` file has also been created in the project root. This file is 100% self-contained (no frameworks, no Tailwind) and can be used independently if needed.

## 🎨 Design Rules
- **Colors**: Pure Black (#000000), Pure White (#FFFFFF), and AfriPot Red (#CC0000).
- **Typography**: 
  - **Julius Sans One**: Used for headings and branding.
  - **Quicksand**: Used for body text, metadata, and buttons.
