'use client'

/**
 * Landing Page v4 — Split World (with instant in-place transition)
 *
 * Click interaction:
 *   1. selectedSide is set
 *   2. CSS handles expansion: clicked side → flex: 9999, other → flex: 0 + blur
 *   3. The landing content smoothly fades out during the expansion.
 *   4. After 750ms animation → showContent is set, immediately rendering the target UI in place.
 *   5. URL updates via pushState to maintain shareability and back button support.
 */

import { useState, useEffect, useRef } from 'react'
import { getActiveBackgrounds } from '@/lib/supabase/backgrounds'
import CreativeContent from '@/components/landing/CreativeContent'
import WorkContent from '@/components/landing/WorkContent'

const CREATIVE_ROUTE  = '/creative'
const TECHNICAL_ROUTE = '/work'
const FALLBACK_VIDEO  =
  'https://rwoqsdnokmwrwqinevlk.supabase.co/storage/v1/object/public/Movie%20Thumbnails/BG%20videos/reducingits.mp4'

const FONT_DISPLAY = '"HelveticaBold", "Helvetica Neue", Helvetica, Arial, sans-serif'
const FONT_BODY    = '"GlacialIndifferenceItalic", "Helvetica Neue", Helvetica, Arial, sans-serif'
const FONT_UI      = '"Helvetica Neue", Helvetica, Arial, sans-serif'

export default function HomeV4() {
  const [background, setBackground] = useState<any>(null)
  const [hovered,    setHovered]    = useState<'left' | 'right' | null>(null)
  const [selected,   setSelected]   = useState<'left' | 'right' | null>(null)
  const [showContent, setShowContent] = useState<'left' | 'right' | null>(null)
  const [mounted,    setMounted]    = useState(false)
  const animating = useRef(false)

  useEffect(() => {
    setMounted(true)
    async function fetchBackground() {
      try {
        const data = await getActiveBackgrounds()
        if (!data || data.length === 0) return
        
        const creative = data.filter((bg) => bg.mode?.toLowerCase() === 'creative')
        
        const isMobile = window.innerWidth < 768
        const suitable = creative.filter(bg => {
          if (isMobile && bg.device_type?.toLowerCase() === 'desktop') return false
          if (!isMobile && bg.device_type?.toLowerCase() === 'mobile') return false
          return true
        })

        const pool = suitable.length > 0 ? suitable : creative
        if (pool.length === 0) return
        
        const randomBg = pool[Math.floor(Math.random() * pool.length)]
        setBackground(randomBg)
      } catch (err) {
        console.error("Failed to fetch background:", err)
      }
    }
    fetchBackground()
  }, [])

  // Handle browser back button (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (selected) {
        setShowContent(null)
        setSelected(null)
        animating.current = false
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [selected])

  const handleSelect = (side: 'left' | 'right') => {
    if (animating.current || selected) return
    animating.current = true
    setSelected(side)
    setHovered(null)

    // Update URL instantly without reloading
    window.history.pushState(null, '', side === 'left' ? CREATIVE_ROUTE : TECHNICAL_ROUTE)

    setTimeout(() => {
      setShowContent(side)
    }, 750)
  }

  const handleBack = () => {
    window.history.pushState(null, '', '/')
    setShowContent(null)
    setSelected(null)
    animating.current = false
  }

  const handleKeyDown = (e: React.KeyboardEvent, side: 'left' | 'right') => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(side) }
  }

  const mediaUrl = background?.video_url ?? FALLBACK_VIDEO
  const isImage = mediaUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i) !== null
  const brightness = background?.brightness ?? 1
  const blur = background?.blur_level ?? 0

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

        /* ── Root ── */
        .v4-root {
          display: flex;
          height: 100dvh;
          width: 100%;
          overflow: hidden;
          opacity: 0;
          transition: opacity 0.6s ease;
          font-family: ${FONT_UI};
          background: #0d0d0d;
        }
        .v4-root.mounted { opacity: 1; }

        /* ── Halves ── */
        .v4-half {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          outline: none;
          display: flex;
          flex-direction: column;
          /* all animatable props in one transition */
          transition:
            flex 0.65s cubic-bezier(0.4, 0, 0.2, 1),
            opacity 0.55s ease-in-out,
            filter 0.55s ease-in-out;
        }
        .v4-half:focus-visible { outline: 2px solid rgba(255,255,255,0.4); outline-offset: -4px; }
        .v4-left  { flex: 1; background: #0d0d0d; }
        .v4-right { flex: 1; background: #f9f9f7; }

        /* Disable pointer on active half when showing content */
        .v4-root.show-content-left .v4-left,
        .v4-root.show-content-right .v4-right {
          cursor: default;
        }

        /* ── Hover expansion ── */
        .v4-root.hover-left  .v4-left  { flex: 1.55; }
        .v4-root.hover-left  .v4-right { flex: 0.45; }
        .v4-root.hover-right .v4-right { flex: 1.55; }
        .v4-root.hover-right .v4-left  { flex: 0.45; }

        /* ── Click expansion: selected side → full screen ── */
        .v4-root.selected-left  .v4-left,
        .v4-root.selected-right .v4-right {
          flex: 9999;
          cursor: default;
        }
        .v4-root.selected-left  .v4-right,
        .v4-root.selected-right .v4-left {
          flex: 0 !important;
          min-width: 0;
          opacity: 0;
          filter: blur(12px);
          pointer-events: none;
        }

        /* ── Landing Content ── */
        .v4-landing-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 2.75rem 2.75rem 2rem;
          transition: transform 0.75s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease;
        }

        /* Fade out and slight scale-down landing content during expansion */
        .v4-root.selected-left  .v4-left  .v4-landing-content,
        .v4-root.selected-right .v4-right .v4-landing-content {
          transform: scale(0.95);
          opacity: 0;
          pointer-events: none;
        }

        /* Video zoom on expansion */
        .v4-root.selected-left .v4-video {
          transform: scale(1.07);
          transition: transform 0.75s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* ── Divider ── */
        .v4-divider {
          position: relative;
          width: 1px;
          flex-shrink: 0;
          background: rgba(128,128,128,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          overflow: hidden;
          transition:
            width 0.6s cubic-bezier(0.4, 0, 0.2, 1),
            opacity 0.4s ease-in-out,
            background 0.3s ease;
        }
        .v4-root.hover-left  .v4-divider,
        .v4-root.hover-right .v4-divider { background: rgba(128,128,128,0.15); }
        .v4-root.selected-left  .v4-divider,
        .v4-root.selected-right .v4-divider { width: 0; opacity: 0; }

        /* ── Or pill ── */
        .v4-or-pill {
          position: absolute;
          width: 2.2rem;
          height: 2.2rem;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-family: ${FONT_UI};
          background: #ffffff;
          color: #0d0d0d;
          border: 1px solid rgba(0,0,0,0.12);
          box-shadow: 0 2px 12px rgba(0,0,0,0.12);
          user-select: none;
          pointer-events: none;
          transition: transform 0.4s ease, opacity 0.35s ease;
        }
        .v4-root.hover-left  .v4-or-pill { transform: translateX(-2px); }
        .v4-root.hover-right .v4-or-pill { transform: translateX(2px);  }
        .v4-root.selected-left  .v4-or-pill,
        .v4-root.selected-right .v4-or-pill { transform: scale(0); opacity: 0; }

        /* ── Video ── */
        .v4-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
          transition: transform 0.75s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .v4-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: 1;
        }

        /* CSS grain fallback */
        @keyframes v4-grain {
          0%,100% { transform: translate(0,0); }
          20%      { transform: translate(-1%,-2%); }
          40%      { transform: translate(2%,1%); }
          60%      { transform: translate(-1%,3%); }
          80%      { transform: translate(3%,-1%); }
        }
        .v4-grain {
          position: absolute; inset: -10%;
          width: 120%; height: 120%;
          z-index: 0; opacity: 0.05;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: cover;
          animation: v4-grain 0.35s steps(1) infinite;
          pointer-events: none;
        }

        /* Eyebrow */
        .v4-eyebrow {
          font-size: 0.64rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 1.4rem;
          font-family: ${FONT_UI};
        }
        .v4-left  .v4-eyebrow { color: rgba(255,255,255,0.38); }
        .v4-right .v4-eyebrow { color: rgba(0,0,0,0.33); }

        /* Headline */
        .v4-headline {
          font-size: clamp(2.4rem, 4.5vw, 4.2rem);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin: 0 0 1.5rem;
          font-family: ${FONT_DISPLAY};
        }
        .v4-left  .v4-headline { color: #ffffff; }
        .v4-right .v4-headline { color: #0d0d0d; }

        /* Subtext */
        .v4-subtext {
          font-size: 0.94rem;
          line-height: 1.72;
          max-width: 30ch;
          margin-bottom: 2rem;
          font-family: ${FONT_BODY};
        }
        .v4-left  .v4-subtext { color: rgba(255,255,255,0.6); font-style: italic; }
        .v4-right .v4-subtext { color: rgba(0,0,0,0.48); }

        /* Tags */
        .v4-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2.2rem;
        }
        .v4-tag {
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          padding: 0.35rem 0.85rem;
          border-radius: 999px;
          font-weight: 500;
          font-family: ${FONT_UI};
          white-space: nowrap;
        }
        .v4-left  .v4-tag {
          border: 1px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.68);
          background: rgba(255,255,255,0.04);
        }
        .v4-right .v4-tag {
          border: 1px solid rgba(0,0,0,0.16);
          color: rgba(0,0,0,0.58);
          background: rgba(0,0,0,0.03);
        }

        /* CTA */
        .v4-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.75rem 1.6rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          font-family: ${FONT_UI};
          border: none;
        }
        .v4-cta:hover  { transform: translateY(-2px); }
        .v4-cta:active { transform: translateY(0); }
        .v4-left  .v4-cta {
          background: #ffffff;
          color: #0d0d0d;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }
        .v4-left  .v4-cta:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
        .v4-right .v4-cta {
          background: transparent;
          color: #0d0d0d;
          border: 1.5px solid rgba(0,0,0,0.72);
        }
        .v4-right .v4-cta:hover { background: rgba(0,0,0,0.04); }

        /* Footer */
        .v4-footer-line {
          font-size: 0.67rem;
          letter-spacing: 0.04em;
          font-family: ${FONT_UI};
        }
        .v4-left  .v4-footer-line { color: rgba(255,255,255,0.26); }
        .v4-right .v4-footer-line { color: rgba(0,0,0,0.28); }

        /* Right shimmer */
        .v4-right-shimmer {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 60% 40%, rgba(0,0,0,0.03), transparent 70%);
          pointer-events: none;
          z-index: 1;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .v4-root.hover-right .v4-right-shimmer { opacity: 1; }

        /* Mobile */
        @media (max-width: 767px) {
          .v4-root        { flex-direction: column; height: auto; min-height: 100dvh; }
          .v4-left,
          .v4-right       { flex: none !important; min-height: 50dvh; }
          .v4-divider     { width: 100%; height: 1px; }
          .v4-or-pill     { transform: none !important; }
          .v4-headline    { font-size: clamp(2rem, 8vw, 3rem); }
          .v4-landing-content { padding: 2rem 1.75rem 1.5rem; }
          .v4-root.selected-left  .v4-right,
          .v4-root.selected-right .v4-left { min-height: 0; }
        }
      `}</style>

      <main className={[
        'v4-root',
        mounted ? 'mounted' : '',
        !selected && hovered ? `hover-${hovered}` : '',
        selected ? `selected-${selected}` : '',
      ].join(' ')} aria-label="Portfolio landing — choose your world">

        {/* ══════ LEFT — Creative World ══════ */}
        <div
          id="v4-creative-half"
          className="v4-half v4-left"
          role={!showContent ? 'button' : undefined}
          tabIndex={!showContent ? 0 : -1}
          aria-label={!showContent ? "Enter creative world" : undefined}
          onClick={() => !showContent && handleSelect('left')}
          onMouseEnter={() => !selected && setHovered('left')}
          onMouseLeave={() => setHovered(null)}
          onKeyDown={(e) => !showContent && handleKeyDown(e, 'left')}
          style={{ cursor: showContent ? 'default' : 'pointer' }}
        >
          <div className="v4-grain" aria-hidden="true" />
          
          {isImage ? (
            <img
              src={mediaUrl}
              className="v4-video"
              style={{ filter: `brightness(${brightness}) blur(${blur}px)` }}
              alt=""
            />
          ) : (
            <video
              className="v4-video"
              key={mediaUrl}
              autoPlay muted loop playsInline preload="auto"
              style={{ filter: `brightness(${brightness}) blur(${blur}px)` }}
              aria-hidden="true"
            >
              <source src={mediaUrl} type="video/mp4" />
            </video>
          )}
          
          <div className="v4-overlay" aria-hidden="true" />

          {/* Landing Content (Fades out when selected) */}
          <div
            className="v4-landing-content"
            style={{
              position: showContent === 'left' ? 'absolute' : 'relative',
              visibility: showContent === 'left' ? 'hidden' : 'visible'
            }}
          >
            <div>
              <p className="v4-eyebrow">creative world</p>
              <h1 className="v4-headline">
                Chaotic.<br />Expressive.<br />Alive.
              </h1>
              <p className="v4-subtext">
                Films, archives, experiments — a living document of things felt
                before they were understood. 2018 until now.
              </p>
              <div className="v4-tags" aria-label="Topics">
                {['films', 'archives', 'experiments', '2018–now'].map((t) => (
                  <span key={t} className="v4-tag">{t}</span>
                ))}
              </div>
              <button
                id="v4-enter-chaos-btn"
                className="v4-cta"
                onClick={(e) => { e.stopPropagation(); handleSelect('left') }}
                aria-label="Enter the creative world"
              >
                enter the chaos →
              </button>
            </div>
            <p className="v4-footer-line">
              built by a weirdo → technical side lives next door
            </p>
          </div>

          {/* Render target page instantly in-place after expansion */}
          {showContent === 'left' && <CreativeContent onBack={handleBack} />}
        </div>

        {/* ══════ DIVIDER ══════ */}
        <div className="v4-divider" aria-hidden="true">
          <span className="v4-or-pill">or</span>
        </div>

        {/* ══════ RIGHT — Technical World ══════ */}
        <div
          id="v4-technical-half"
          className="v4-half v4-right"
          role={!showContent ? 'button' : undefined}
          tabIndex={!showContent ? 0 : -1}
          aria-label={!showContent ? "See the technical work" : undefined}
          onClick={() => !showContent && handleSelect('right')}
          onMouseEnter={() => !selected && setHovered('right')}
          onMouseLeave={() => setHovered(null)}
          onKeyDown={(e) => !showContent && handleKeyDown(e, 'right')}
          style={{ cursor: showContent ? 'default' : 'pointer' }}
        >
          <div className="v4-right-shimmer" aria-hidden="true" />
          
          {/* Landing Content (Fades out when selected) */}
          <div
            className="v4-landing-content"
            style={{
              position: showContent === 'right' ? 'absolute' : 'relative',
              visibility: showContent === 'right' ? 'hidden' : 'visible'
            }}
          >
            <div>
              <p className="v4-eyebrow">technical world</p>
              <h1 className="v4-headline">
                Precise.<br />Thoughtful.<br />Deployable.
              </h1>
              <p className="v4-subtext">
                Full-stack systems, shipped products, and the kind of work that
                actually runs in production. Skills applied with intent.
              </p>
              <div className="v4-tags" aria-label="Disciplines">
                {['full-stack', 'systems', 'product', 'available'].map((c) => (
                  <span key={c} className="v4-tag">{c}</span>
                ))}
              </div>
              <button
                id="v4-see-work-btn"
                className="v4-cta"
                onClick={(e) => { e.stopPropagation(); handleSelect('right') }}
                aria-label="See the technical work"
              >
                see the work →
              </button>
            </div>
            <p className="v4-footer-line">
              this site was built by a weirdo — see the other side →
            </p>
          </div>

          {/* Render target page instantly in-place after expansion */}
          {showContent === 'right' && <WorkContent onBack={handleBack} />}
        </div>

      </main>
    </>
  )
}
