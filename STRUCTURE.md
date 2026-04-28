# SALTone Project Structure & Overview

This document provides a comprehensive map of the SALTone codebase and explains how the different parts work together.

## 🏗 Project Directory Structure

```text
SALTone/
├── app/                       # Next.js App Router (Routes)
│   ├── page.tsx               # Orchestrator for the Landing Page (Dual-Mode)
│   ├── page_v4.tsx            # NEW: Split-world landing with dynamic data
│   ├── creative/              # route: /creative (Individual Creative Mode)
│   ├── work/                  # route: /work (Individual Pro Mode)
│   └── ...                    # movies, gallery, years
├── components/                # React Components
│   ├── landing/               # Sub-components for the Landing Page
│   │   ├── CreativeSections.tsx # Multi-section cinematic content (Includes Newsletter)
│   │   ├── NewsletterForm.tsx # High-performance uncontrolled form
│   │   └── ...
├── lib/supabase/              # Data fetching logic
│   ├── creative.ts            # getCreativeSections()
│   ├── technical.ts           # getTechnicalSections()
│   ├── v4.ts                  # NEW: getMainV4Data()
│   └── newsletter.ts          # NEW: insertSubscriber()
├── utils/supabase/            # Supabase auth & client configuration
└── ...
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
- **Professional Mode**: Clean, authoritative design. Features an expanded "Below-the-fold" section with Experience timelines, Skills, and Roadmaps.
- **Creative Mode**: High-impact, cinematic design. Preserved landing hero with a massive new vertical scroll experience (Cinema, Photographs, Archives, Manifesto).
- **State Management**: React `useState` handles the mode, persists to `sessionStorage`, and Framer Motion handles the cross-fades between visual identities.

### 2. Multi-Section Scrolling (`CreativeSections.tsx` & `WorkContent.tsx`)
Both primary modes have been expanded from single-screen landing pages into multi-section journeys.
- **Creative Expansion**: Uses a cinematic "scrubber" for films, staggered masonry for photography, and a complete 2018-2024 archive grid.
- **Professional Expansion**: Features a project showcase with live status badges and a structured contact hub.
- **Reveal Logic**: Implements a custom `Reveal` component using `IntersectionObserver` and Framer Motion to trigger animations as users scroll, maintaining a premium "Apple-style" feel.

### 3. Data Flow (Supabase)
The project uses **Supabase** as the backend.
- **Server Components**: Pages like `app/years/[year]/page.tsx` are async Server Components that fetch data directly from Supabase via `lib/supabase/...`.
- **Client Components**: The fetched data is passed down to Client Components (like `YearUI3`) which handle interactive layouts, animations, and modality.

### 4. YearUI3: The Masonry Jigsaw
The `YearUI3.tsx` component implements a unique, gapless masonry grid. 
- **Algorithm**: It calculates `col-span` and `row-span` based on the image's actual aspect ratio to ensure no cropping and a perfect "jigsaw" fit.
- **Modal Gallery**: Clicking an event on the main grid opens a split-screen modal. The left side presents the rest of the event's gallery in a scaled version of the same masonry algorithm, while the right side displays the description.

### 5. Styles & Animations
- **Tailwind CSS v4**: Optimized styling with modern utilities.
- **Framer Motion**: Used extensively for staggered entry animations (`fade-in-up`), marquee scrolls, and cinematic crossfades.
- **Custom Fonts**:
    - `HelveticaBold`: Used for high-impact headings.
    - `CormorantGaramondNormal`: Used for elegant, italicized taglines.
    - `GlacialIndifferenceItalic`: Used for supporting body text.

---
*Updated on 2026-04-28*
