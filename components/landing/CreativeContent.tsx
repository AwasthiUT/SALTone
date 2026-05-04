'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import type { CreativeSection } from '@/lib/supabase/creative'

const FONT_DISPLAY = '"HelveticaBold", "Helvetica Neue", Helvetica, Arial, sans-serif'
const FONT_BODY    = '"GlacialIndifferenceItalic", "Helvetica Neue", Helvetica, Arial, sans-serif'
const FONT_UI      = '"Helvetica Neue", Helvetica, Arial, sans-serif'

const YEARS = ['2024', '2023', '2022', '2021', '2020', '2019', '2018']

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] as const } },
}

function activeItems<T extends { is_active?: boolean | null }>(items?: T[]) {
  // Return all items now as we want to handle is_active state in the UI
  return items ?? []
}

function renderLandingTitle(title: string) {
  const lines = title.includes('\n') ? title.split('\n') : title.split(/ (?=[^ ]+$)/)

  return lines.map((line, index) => (
    <span key={`${line}-${index}`}>
      {index > 0 && <br />}
      {line}
    </span>
  ))
}

export default function CreativeContent({ onBack, section, allSections = [] }: { onBack?: () => void; section?: CreativeSection; allSections?: CreativeSection[] }) {
  const router = useRouter()
  const [hoveredYear, setHoveredYear] = useState<string | null>(null)
  // Archive section might use 'items' or 'boxes'. We check both.
  const rawBoxes = section?.metadata?.items || section?.metadata?.boxes || []
  const boxes = [...rawBoxes].sort((a, b) => {
    const yearA = parseInt(a.title || '0')
    const yearB = parseInt(b.title || '0')
    return yearB - yearA
  })
  
  const yearBoxes = section
    ? boxes.map((box) => ({ 
        title: box.title ?? '', 
        image: box.image ?? '', 
        link: box.link ?? box.href ?? '#', 
        is_active: box.is_active !== false 
      })).filter((box) => box.title)
    : YEARS.map((year) => ({ 
        title: year, 
        image: '', 
        link: `/years/${year}`, 
        is_active: true 
      }))

  if (section) {
    console.log("Rendering section:", section.section_key)
  }

  const handleBack = () => {
    if (onBack) onBack()
    else router.back()
  }

  return (
    <div style={{ position: 'relative', zIndex: 2, minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* ── Gradient overlay ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none',
          background: `
            linear-gradient(to bottom,
              rgba(0,0,0,0.82) 0%,
              rgba(0,0,0,0.42) 30%,
              rgba(0,0,0,0.35) 60%,
              rgba(0,0,0,0.88) 100%
            )`,
        }}
      />

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.75rem 2.5rem',
        }}
      >
        <button
          onClick={handleBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            fontFamily: FONT_UI, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            transition: 'color 0.2s ease',
            padding: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
        >
          ← back
        </button>
        <span style={{
          fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.28)', fontWeight: 500,
        }}>
          creative world
        </span>
      </motion.nav>

      {/* Hero */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem 2.5rem 1rem' }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)', fontWeight: 500,
            fontFamily: FONT_UI, marginBottom: '1.2rem',
          }}
        >
          {section?.description ?? 'the archive'}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 'clamp(3rem, 7vw, 6.5rem)',
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            margin: '0 0 1.5rem',
          }}
        >
          {renderLandingTitle(section?.title ?? 'Everything made.')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            fontFamily: FONT_BODY,
            fontStyle: 'italic',
            fontSize: '1.05rem',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.55)',
            maxWidth: '42ch',
            marginBottom: '3rem',
          }}
        >
          {section?.subtitle ?? (
            <>
              Films, stills, half-finished experiments. A personal archive that runs
              from 2018 to now — unfiltered, unresolved, alive.
            </>
          )}
        </motion.p>

        {/* Section Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          style={{ display: 'flex', gap: '2rem', marginBottom: '3.5rem', flexWrap: 'wrap' }}
        >
          {allSections.map((s, idx) => {
            const label = s.section_key?.replace(/-/g, ' ') || 'section';
            return (
              <a key={s.section_key} href={`#${s.section_key}`}
                className="group"
                style={{ 
                  fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', 
                  color: 'rgba(255,255,255,0.4)', textDecoration: 'none', 
                  fontFamily: FONT_UI, fontWeight: 600, transition: 'all 0.3s ease', 
                  display: 'flex', alignItems: 'center', gap: '0.4rem' 
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                }}>
                <span style={{ opacity: 0.3, fontSize: '0.6rem', fontFamily: 'monospace' }}>0{idx + 1}</span>
                {label}
                <span style={{ transition: 'transform 0.3s ease', opacity: 0.3 }} className="group-hover:translate-y-0.5">↓</span>
              </a>
            )
          })}
        </motion.div>

        {/* Year grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
            gap: '0.75rem',
            maxWidth: '700px',
          }}
        >
          {yearBoxes.map(({ title, image, link, is_active }) => (
            <motion.a
              key={title}
              href={is_active ? link : '#'}
              onClick={(e) => { if (!is_active) e.preventDefault() }}
              variants={itemVariants}
              onMouseEnter={() => setHoveredYear(title)}
              onMouseLeave={() => setHoveredYear(null)}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1rem 1.1rem',
                border: `1px solid ${hoveredYear === title ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '6px',
                background: hoveredYear === title ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.02)',
                color: hoveredYear === title ? '#ffffff' : 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontFamily: FONT_DISPLAY,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                transition: 'all 0.22s ease',
                aspectRatio: '1.4 / 1',
                backdropFilter: 'blur(6px)',
                cursor: is_active ? 'pointer' : 'default',
                overflow: 'hidden',
              }}
            >
              {image && (
                <img
                  src={image}
                  alt={title}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: -1,
                    opacity: hoveredYear === title ? 0.5 : 0.25,
                    transition: 'opacity 0.3s ease',
                    filter: is_active ? 'none' : 'grayscale(1)',
                  }}
                />
              )}
              <span style={{ fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.5, fontFamily: FONT_UI, fontWeight: 500 }}>
                {!is_active ? 'Coming Soon' : (hoveredYear === title ? 'enter →' : '')}
              </span>
              <span>{title}</span>
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        style={{
          padding: '1.5rem 2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.08em', fontFamily: FONT_UI }}>
          Utkarsh Awasthi
        </span>
        <a
          href="/work"
          style={{
            fontSize: '0.65rem', color: 'rgba(255,255,255,0.28)',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            textDecoration: 'none', fontFamily: FONT_UI, fontWeight: 500,
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}
        >
          technical side →
        </a>
      </motion.footer>
    </div>
  )
}
