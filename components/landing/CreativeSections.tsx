'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

// ─── Data ──────────────────────────────────────────

const SHOWCASE = [
  {
    title: 'Cinema',
    subtitle: 'Films directed, written & edited.',
    href: '/movies',
    gradient: 'linear-gradient(135deg, #ff3366, #ff6b35)',
    emoji: '🎬',
  },
  {
    title: '2023',
    subtitle: 'A year told through photographs.',
    href: '/years/2023',
    gradient: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
    emoji: '📸',
  },
  {
    title: '2024',
    subtitle: 'Another year, another story.',
    href: '/years/2024',
    gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
    emoji: '✨',
  },
]

// ─── Section Wrapper ───────────────────────────────

function Section({ children, id }: { children: React.ReactNode; id: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setIsVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="w-full max-w-6xl mx-auto px-6 sm:px-12 py-20 sm:py-28"
    >
      {children}
    </motion.section>
  )
}

// ─── Main Component ────────────────────────────────

export default function CreativeSections() {
  return (
    <div className="relative z-10">

      {/* ── WHO I AM ───────────── */}
      <Section id="who-i-am">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="text-3xl sm:text-5xl text-white mb-8 tracking-tight"
            style={{ fontFamily: 'HelveticaBold', letterSpacing: '-0.02em' }}
          >
            Who I Am
          </h2>

          <p
            className="text-xl sm:text-2xl text-white/60 leading-relaxed mb-8"
            style={{ fontFamily: 'CormorantGaramondNormal' }}
          >
            I write code that builds things. I direct films that feel things.
            I take photographs that freeze things. None of it is separate —
            it&apos;s all the same obsession with <em className="text-white/80">creating something from nothing</em>.
          </p>

          <div className="w-16 h-px bg-white/20 mx-auto" />
        </motion.div>
      </Section>

      {/* ── SHOWCASE ───────────── */}
      <Section id="showcase">
        <div className="text-center mb-16">
          <h2
            className="text-3xl sm:text-5xl text-white mb-4 tracking-tight"
            style={{ fontFamily: 'HelveticaBold', letterSpacing: '-0.02em' }}
          >
            Explore
          </h2>
          <p
            className="text-base sm:text-lg text-white/40 max-w-xl mx-auto"
            style={{ fontFamily: 'GlacialIndifferenceItalic' }}
          >
            Each section is a different lens. Pick one.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SHOWCASE.map((item, i) => (
            <Link key={item.title} href={item.href}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{
                  scale: 1.03,
                  y: -6,
                  transition: { duration: 0.3 },
                }}
                className="relative group rounded-2xl overflow-hidden cursor-pointer h-64 sm:h-72"
              >
                {/* Gradient bg */}
                <div
                  className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: item.gradient }}
                />

                {/* Glass overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                  <span className="text-4xl mb-4">{item.emoji}</span>
                  <h3
                    className="text-2xl sm:text-3xl text-white mb-2"
                    style={{ fontFamily: 'HelveticaBold', letterSpacing: '-0.02em' }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300"
                    style={{ fontFamily: 'GlacialIndifferenceItalic' }}
                  >
                    {item.subtitle}
                  </p>

                  {/* Arrow */}
                  <motion.div
                    className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </div>

                {/* Border glow */}
                <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/25 transition-colors duration-500" />
              </motion.div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ── CREATIVE PHILOSOPHY ───────────── */}
      <Section id="philosophy">
        <motion.div
          className="max-w-2xl mx-auto text-center py-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="text-6xl sm:text-7xl mb-8 opacity-30"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          >
            ✦
          </motion.div>

          <blockquote
            className="text-2xl sm:text-3xl lg:text-4xl text-white/70 italic leading-relaxed mb-8"
            style={{ fontFamily: 'CormorantGaramondNormal' }}
          >
            &ldquo;The best work happens when you stop separating who you are from what you make.&rdquo;
          </blockquote>

          <p
            className="text-sm uppercase tracking-[0.25em] text-white/25"
            style={{ fontFamily: 'HelveticaBold' }}
          >
            — Utkarsh Awasthi
          </p>
        </motion.div>
      </Section>
    </div>
  )
}
