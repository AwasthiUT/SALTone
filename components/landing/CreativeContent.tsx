'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

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

export default function CreativeContent({ onBack }: { onBack?: () => void }) {
  const router = useRouter()
  const [hoveredYear, setHoveredYear] = useState<string | null>(null)

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
          the archive
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
          Everything<br />made.
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
            marginBottom: '3.5rem',
          }}
        >
          Films, stills, half-finished experiments. A personal archive that runs
          from 2018 to now — unfiltered, unresolved, alive.
        </motion.p>

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
          {YEARS.map((year) => (
            <motion.a
              key={year}
              href={`/years/${year}`}
              variants={itemVariants}
              onMouseEnter={() => setHoveredYear(year)}
              onMouseLeave={() => setHoveredYear(null)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1rem 1.1rem',
                border: `1px solid ${hoveredYear === year ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '6px',
                background: hoveredYear === year ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.02)',
                color: hoveredYear === year ? '#ffffff' : 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontFamily: FONT_DISPLAY,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                transition: 'all 0.22s ease',
                aspectRatio: '1.4 / 1',
                backdropFilter: 'blur(6px)',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.5, fontFamily: FONT_UI, fontWeight: 500 }}>
                {hoveredYear === year ? 'enter →' : ''}
              </span>
              <span>{year}</span>
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
