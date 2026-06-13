# AfriPort Restaurant Website - Complete Project Structure

## 📋 Project Overview
**Project Name:** AfriPort Restaurant Clone  
**Tech Stack:** React 19 + TanStack Start + TypeScript + Tailwind CSS + Vite  
**Build Tool:** Vite with Cloudflare Workers support  
**Hosting:** Cloudflare Pages (configured)  
**Type:** Full-stack restaurant website with reservations, menu, events, and contact features

---

## 📁 Directory Structure

```
restaurant-gem-clone-main/
├── .git/                          # Git version control
├── .github/
│   └── workflows/
│       └── static.yml             # GitHub Actions CI/CD workflow
├── .kiro/                         # Kiro IDE configuration
├── .tanstack/
│   └── tmp/                       # TanStack temporary files
├── .wrangler/
│   └── deploy/
│       └── config.json            # Cloudflare Wrangler deployment config
├── dist/                          # Build output (generated)
│   ├── client/                    # Client-side bundle
│   ├── server/                    # Server-side bundle
│   └── assets/                    # Compiled assets
├── node_modules/                  # Dependencies (generated)
├── src/                           # Source code
│   ├── assets/                    # Static assets
│   ├── components/                # React components
│   ├── data/                      # Data files
│   ├── hooks/                     # Custom React hooks
│   ├── lib/                       # Utility libraries
│   ├── routes/                    # Page routes
│   ├── router.tsx                 # Router configuration
│   ├── routeTree.gen.ts           # Generated route tree
│   └── styles.css                 # Global styles
├── .eslintrc.js                   # ESLint configuration
├── .gitignore                     # Git ignore rules
├── .prettierignore                # Prettier ignore rules
├── .prettierrc                    # Prettier configuration
├── components.json                # Shadcn/ui components config
├── eslint.config.js               # ESLint config (new format)
├── package.json                   # Project dependencies
├── package-lock.json              # Dependency lock file
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite build configuration
├── wrangler.jsonc                 # Cloudflare Wrangler config
└── [DOCUMENTATION FILES]          # Various markdown docs
    ├── PROJECT_STRUCTURE.md       # This file
    ├── CAROUSEL_FEATURES.md
    ├── CAROUSEL_IMPLEMENTATION.md
    ├── DEBUG_FIX_SUMMARY.md
    ├── EVENTS_PAGE_DOCUMENTATION.md
    ├── EVENTS_QUICK_REFERENCE.md
    ├── FIXED_BUTTON_IMPLEMENTATION.md
    ├── MENU_IMPLEMENTATION_SUMMARY.md
    ├── MENU_QUICK_REFERENCE.md
    ├── RESERVATION_*.md           # Multiple reservation docs
    ├── RESPONSIVE_DESIGN_FIXES.md
    └── README.md
```

---

## 📂 Detailed Directory Breakdown

### `/src` - Source Code Root

#### `/src/assets` - Static Media Files
```
assets/
├── eventBannerUI/
│   ├── 7431214.psd               # Photoshop design file
│   └── eventBanner1.jpg          # Event banner image
├── menu/
│   ├── STAFFORD 2.pdf            # Main menu PDF
│   └── drinks Staffod .pdf       # Beverages menu PDF
├── [Images - 40+ files]
│   ├── Hero images: BackgroundHero1.jpg, hero-entrance.jpg
│   ├── Food images: Chicken_Luwombo.JPG, TILAPIA.jpg, choma.jpg, etc.
│   ├── Venue images: dining-room.jpg, interior-stairs.jpg, suite-*.jpg
│   ├── Logos: AfriPot_logo2.png, STAFFORD COFFEE BREWERS LOGO.png
│   ├── Gallery: afri1-5.jpg, fd1-4.jpg, localfood1.jpg
│   └── Error: 404page.png
└── [Videos - 7 files]
    ├── vid1-6.mp4                # Promotional videos
    └── what to do.mp4            # Activity video
```

**Purpose:** All images, videos, and media assets used throughout the website

---

#### `/src/components` - React Components

##### `/src/components/ui` - Shadcn/UI Component Library (45+ files)
Pre-built, accessible UI components from Shadcn/ui:
- **Form Components:** input.tsx, textarea.tsx, checkbox.tsx, radio-group.tsx, select.tsx, toggle.tsx
- **Dialog Components:** dialog.tsx, alert-dialog.tsx, drawer.tsx, popover.tsx, hover-card.tsx
- **Navigation:** navigation-menu.tsx, menubar.tsx, breadcrumb.tsx, pagination.tsx
- **Data Display:** table.tsx, carousel.tsx, accordion.tsx, tabs.tsx, progress.tsx
- **Layout:** card.tsx, separator.tsx, scroll-area.tsx, resizable.tsx, sidebar.tsx
- **Feedback:** sonner.tsx (toast notifications), skeleton.tsx
- **Utilities:** badge.tsx, avatar.tsx, aspect-ratio.tsx, tooltip.tsx, command.tsx
- **Advanced:** chart.tsx, input-otp.tsx, context-menu.tsx, dropdown-menu.tsx, sheet.tsx, toggle-group.tsx

**Purpose:** Reusable, accessible UI building blocks

##### `/src/components` - Custom Components (10 files)
```
components/
├── LenisProvider.tsx              # Smooth scroll provider
├── Marquee.tsx                    # Scrolling text component
├── MenuCarousel.tsx               # Menu items carousel
├── PageLoader.tsx                 # Loading animation
├── PageTransition.tsx             # Page transition effects
├── PartnersSection.tsx            # Partners/sponsors section
├── ReservationModal.tsx           # Reservation form modal
├── ScrollReveal.tsx               # Scroll animation component
├── SiteFooter.tsx                 # Footer component
└── SiteHeader.tsx                 # Header/navigation component
```

**Purpose:** Custom components specific to the restaurant website

---

#### `/src/data` - Static Data Files
```
data/
├── beveragesData.ts               # Beverages/drinks menu data
├── eventsData.ts                  # Events information
└── menuData.ts                    # Food menu items data
```

**Purpose:** Centralized data for menu items, events, and beverages

---

#### `/src/hooks` - Custom React Hooks
```
hooks/
├── useLenis.tsx                   # Smooth scroll hook
├── use-mobile.tsx                 # Mobile detection hook
└── useScrollAnimation.tsx         # Scroll animation hook
```

**Purpose:** Reusable React logic for animations and responsive behavior

---

#### `/src/lib` - Utility Libraries
```
lib/
├── gsap-config.ts                 # GSAP animation configuration
└── utils.ts                       # General utility functions
```

**Purpose:** Helper functions and library configurations

---

#### `/src/routes` - Page Routes (TanStack Router)
```
routes/
├── __root.tsx                     # Root layout component
├── index.tsx                      # Home page (/)
├── about.tsx                      # About page (/about)
├── contact.tsx                    # Contact page (/contact)
├── demo.tsx                       # Demo page (/demo)
├── events.tsx                     # Events page (/events)
├── menu.tsx                       # Menu page (/menu)
└── reservation.tsx                # Reservation page (/reservation)
```

**Purpose:** Page components for each route in the application

---

#### `/src` - Root Source Files
```
src/
├── router.tsx                     # Router configuration
├── routeTree.gen.ts               # Auto-generated route tree
└── styles.css                     # Global CSS styles
```

**Purpose:** Main application setup and styling

---

### Root Configuration Files

#### Build & Development
- **`vite.config.ts`** - Vite build configuration with TanStack Start, Tailwind, Cloudflare support
- **`tsconfig.json`** - TypeScript compiler options
- **`components.json`** - Shadcn/ui component configuration

#### Package Management
- **`package.json`** - Project dependencies and scripts
- **`package-lock.json`** - Locked dependency versions

#### Code Quality
- **`eslint.config.js`** - ESLint rules for code linting
- **`.eslintrc.js`** - ESLint configuration
- **`.prettierrc`** - Code formatter configuration
- **`.prettierignore`** - Files to exclude from formatting

#### Deployment
- **`wrangler.jsonc`** - Cloudflare Workers configuration
- **`.github/workflows/static.yml`** - GitHub Actions CI/CD

#### Version Control
- **`.gitignore`** - Files to exclude from Git
- **`.git/`** - Git repository data

---

## 🔄 Build Output Structure

### `/dist` - Generated Build Output
```
dist/
├── client/                        # Client-side bundle
│   ├── assets/                    # Compiled JS/CSS
│   └── index.html                 # Entry HTML
├── server/                        # Server-side bundle
│   ├── index.js                   # Server entry point
│   └── assets/                    # Server assets
└── assets/                        # Shared assets
```

**Generated by:** `npm run build`  
**Purpose:** Production-ready files for deployment

---

## 📦 Key Dependencies

### Core Framework
- **react** (19.2.0) - UI library
- **@tanstack/react-start** (1.167.14) - Full-stack React framework
- **@tanstack/react-router** (1.168.0) - Routing
- **@tanstack/react-query** (5.83.0) - Data fetching

### UI & Styling
- **tailwindcss** (4.2.1) - Utility-first CSS
- **@radix-ui/** - Accessible component primitives
- **lucide-react** (0.575.0) - Icon library
- **embla-carousel-react** (8.6.0) - Carousel component

### Animations
- **framer-motion** (12.38.0) - Animation library
- **gsap** (3.15.0) - Animation platform
- **animejs** (4.4.1) - Animation engine
- **lenis** (1.3.23) - Smooth scroll library

### Forms & Validation
- **react-hook-form** (7.71.2) - Form management
- **@hookform/resolvers** (5.2.2) - Form validation
- **zod** (3.24.2) - Schema validation

### Utilities
- **date-fns** (4.1.0) - Date utilities
- **recharts** (2.15.4) - Charts library
- **three** (0.184.0) - 3D graphics
- **sonner** (2.0.7) - Toast notifications
- **vaul** (1.1.2) - Drawer component

### Build & Deployment
- **vite** (7.3.1) - Build tool
- **@cloudflare/vite-plugin** (1.25.5) - Cloudflare integration
- **@lovable.dev/vite-tanstack-config** (1.4.0) - TanStack config

---

## 🎯 Page Routes & Features

| Route | File | Purpose |
|-------|------|---------|
| `/` | `index.tsx` | Home page with hero, featured items |
| `/about` | `about.tsx` | Restaurant information & story |
| `/menu` | `menu.tsx` | Food menu with categories |
| `/events` | `events.tsx` | Upcoming events listing |
| `/reservation` | `reservation.tsx` | Reservation booking system |
| `/contact` | `contact.tsx` | Contact form & information |
| `/demo` | `demo.tsx` | Demo/showcase page |

---

## 🔧 NPM Scripts

```json
{
  "dev": "vite dev",                    # Start dev server
  "build": "vite build",                # Production build
  "build:dev": "vite build --mode development",  # Dev build
  "preview": "vite preview",            # Preview build
  "lint": "eslint .",                   # Run linter
  "format": "prettier --write ."        # Format code
}
```

---

## 📊 Component Hierarchy

```
__root.tsx (Layout)
├── SiteHeader.tsx
├── PageTransition.tsx
├── [Page Routes]
│   ├── index.tsx (Home)
│   │   ├── Marquee.tsx
│   │   ├── MenuCarousel.tsx
│   │   ├── PartnersSection.tsx
│   │   └── ScrollReveal.tsx
│   ├── menu.tsx
│   │   └── MenuCarousel.tsx
│   ├── events.tsx
│   │   └── [Event components]
│   ├── reservation.tsx
│   │   └── ReservationModal.tsx
│   ├── about.tsx
│   ├── contact.tsx
│   └── demo.tsx
├── SiteFooter.tsx
├── LenisProvider.tsx (Smooth scroll)
```

---

## 🎨 Styling Architecture

- **Global Styles:** `/src/styles.css`
- **Tailwind CSS:** Utility-first CSS framework
- **Component Styles:** Inline Tailwind classes in components
- **UI Components:** Pre-styled Shadcn/ui components
- **Animations:** GSAP, Framer Motion, Anime.js

---

## 🚀 Deployment Configuration

### Cloudflare Workers
- **Config File:** `wrangler.jsonc`
- **Build Output:** `/dist/server` (server-side)
- **Client Output:** `/dist/client` (client-side)

### GitHub Actions
- **Workflow:** `.github/workflows/static.yml`
- **Trigger:** Push to main branch
- **Action:** Automatic deployment to Cloudflare Pages

---

## 📝 Documentation Files

The project includes comprehensive documentation:
- `CAROUSEL_FEATURES.md` - Carousel implementation details
- `EVENTS_PAGE_DOCUMENTATION.md` - Events page guide
- `MENU_IMPLEMENTATION_SUMMARY.md` - Menu system overview
- `RESERVATION_*.md` - Multiple reservation feature docs
- `RESPONSIVE_DESIGN_FIXES.md` - Responsive design notes
- And more...

---

## 🔐 Environment & Configuration

### TypeScript
- Strict mode enabled
- Path aliases configured (`@` for src)
- React 19 support

### Prettier
- Configured for consistent code formatting
- Excludes certain files (`.prettierignore`)

### ESLint
- React hooks rules
- React refresh rules
- TypeScript support

---

## 📱 Key Features

1. **Responsive Design** - Mobile-first approach with Tailwind
2. **Smooth Animations** - GSAP, Framer Motion, Lenis scroll
3. **Menu System** - Dynamic menu with categories
4. **Reservation System** - Booking form with validation
5. **Events Management** - Event listing and details
6. **Contact Form** - Contact information & messaging
7. **Image Gallery** - Carousel and gallery components
8. **SEO Optimized** - TanStack Start for SSR/SSG
9. **Accessible** - Radix UI for accessibility
10. **Performance** - Vite for fast builds, code splitting

---

## 🎯 Development Workflow

1. **Development:** `npm run dev` - Start local dev server
2. **Coding:** Edit files in `/src`
3. **Linting:** `npm run lint` - Check code quality
4. **Formatting:** `npm run format` - Auto-format code
5. **Building:** `npm run build` - Create production build
6. **Preview:** `npm run preview` - Test production build locally
7. **Deployment:** Push to GitHub → Auto-deploy to Cloudflare Pages

---

## 📚 Technology Stack Summary

| Category | Technology |
|----------|-----------|
| **Framework** | React 19 + TanStack Start |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Shadcn/ui |
| **Routing** | TanStack Router |
| **Animations** | GSAP, Framer Motion, Anime.js |
| **Forms** | React Hook Form + Zod |
| **Build** | Vite |
| **Deployment** | Cloudflare Pages/Workers |
| **Icons** | Lucide React |
| **Notifications** | Sonner |
| **3D** | Three.js |

---

## 🔗 File Relationships

```
Data Flow:
data/*.ts → components → routes → __root.tsx → Browser

Component Flow:
ui/* → Custom Components → Page Routes → Layout

Asset Flow:
assets/* → Components → Rendered HTML → Browser

Style Flow:
styles.css + Tailwind → Components → Compiled CSS → Browser
```

---

## 📈 Project Statistics

- **Total Components:** 50+ (45 UI + 11 custom)
- **Routes:** 7 main pages
- **Assets:** 40+ images, 7 videos
- **Dependencies:** 40+ npm packages
- **Lines of Code:** 1000+ (excluding node_modules)
- **Build Size:** ~500KB (gzipped)

---

## ✅ Checklist for New Developers

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Explore `/src/routes` to understand pages
- [ ] Check `/src/components` for UI patterns
- [ ] Review `/src/data` for content structure
- [ ] Read documentation files for specific features
- [ ] Run `npm run lint` to check code quality
- [ ] Run `npm run build` to test production build

---

**Last Updated:** May 2026  
**Project Type:** Full-Stack Restaurant Website  
**Status:** Active Development
