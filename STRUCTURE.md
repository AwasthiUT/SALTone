# SALTone Project Structure & Overview

This document provides a comprehensive map of the SALTone codebase and explains how the different parts work together.

## 🏗 Project Directory Structure

```text
SALTone/
├── app/                       # Next.js App Router (Routes)
│   ├── page.tsx               # Orchestrator for the Landing Page (Dual-Mode)
│   ├── page_v1.tsx            # Backup of the original landing page
│   ├── layout.tsx             # Root layout (fonts, global providers)
│   ├── globals.css            # Global styles, Tailwind directives, keyframes
│   ├── movies/                # route: /movies
│   │   └── page.tsx           # Fetches movies and renders MoviesUI
│   ├── gallery/[id]/          # route: /gallery/:id
│   │   └── page.tsx           # Fetches gallery data for a specific movie
│   └── years/[year]/          # route: /years/:year
│       └── page.tsx           # Main gallery for yearly events (YearUI3)
├── components/                # React Components
│   ├── landing/               # Sub-components for the Landing Page
│   │   ├── ModeToggle.tsx     # Toggle switch (Pro vs. Creative Mode)
│   │   ├── HeroSection.tsx    # Responsive hero with mode-specific text
│   │   ├── FluidBackground.tsx# Canvas-based liquid paint effect (Creative)
│   │   ├── SkillBalls.tsx     # Dropping skill icons animation
│   │   ├── ProSections.tsx    # Professional sections (Experience, Roadmap)
│   │   └── CreativeSections.tsx# Creative sections (Showcase, Philosophy)
│   ├── YearUI3.tsx            # Sophisticated Masonry Jigsaw for events
│   ├── MoviesUI.tsx           # Grid layout for movies/films
│   └── GalleryView.tsx        # Standard image gallery viewer
├── lib/supabase/              # Data fetching logic
│   ├── movies.ts              # getMovies()
│   ├── years.ts               # getYearData()
│   └── gallery.ts             # getGalleryData()
├── utils/supabase/            # Supabase auth & client configuration
│   ├── client.ts              # Browser-side client
│   └── server.ts              # Server-side client for RSC
├── public/                    # Static assets (SVGs, Images)
├── next.config.ts             # Next.js configuration (Supabase domains)
├── package.json               # Dependencies (Next.js 16, React 19, Framer Motion)
└── tsconfig.json              # TypeScript configuration
```

## 🚀 How It Works

### 1. The Dual-Mode Landing Page (`app/page.tsx`)
The home page features a custom `ModeToggle` that switches the entire UI context between **Professional** and **Creative** modes.
- **Professional Mode**: Minimalist black/silver design focused on software engineering (Experience, Skills, Roadmap).
- **Creative Mode**: Vibrant, fluid-motion design focused on filmmaking and photography. It uses a `<canvas>` element with a custom fluid simulation that reacts to mouse movement.
- **State Management**: React `useState` handles the mode, and Framer Motion's `AnimatePresence` ensures smooth transitions between the two identities without page reloads.

### 2. Data Flow (Supabase)
The project uses **Supabase** as the backend.
- **Server Components**: Pages like `app/years/[year]/page.tsx` are async Server Components that fetch data directly from Supabase via `lib/supabase/...`.
- **Client Components**: The fetched data is passed down to Client Components (like `YearUI3`) which handle interactive layouts, animations, and modality.

### 3. YearUI3: The Masonry Jigsaw
The `YearUI3.tsx` component implements a unique, gapless masonry grid. 
- **Algorithm**: It calculates `col-span` and `row-span` based on the image's actual aspect ratio to ensure no cropping and a perfect "jigsaw" fit.
- **Modal Gallery**: Clicking an event on the main grid opens a split-screen modal. The left side presents the rest of the event's gallery in a scaled version of the same masonry algorithm, while the right side displays the description.

### 4. Styles & Animations
- **Tailwind CSS v4**: Optimized styling with modern utilities.
- **Framer Motion**: Used extensively for staggered entry animations (`fade-in-up`), layout transitions, and the "pop-up" hover effects.
- **Custom Fonts**:
    - `HelveticaBold`: Used for high-impact headings.
    - `CormorantGaramondNormal`: Used for elegant, italicized taglines.
    - `GlacialIndifferenceItalic`: Used for supporting body text.

---
*Created on 2026-04-16*
