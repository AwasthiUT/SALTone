'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

// ─── Data ──────────────────────────────────────────

const CREATIVE_DIARIES = [
  {
    title: 'Cinema',
    tagline: 'Films directed, written & edited',
    href: '/movies',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2918&auto=format&fit=crop'
  },
  {
    title: 'Photographs',
    tagline: 'Moments frozen in time',
    href: '#', // Not built yet
    image: 'https://images.unsplash.com/photo-1516805361833-2194e803c035?q=80&w=2835&auto=format&fit=crop'
  }
]

const THE_ARCHIVE = [
  {
    title: '2023',
    tagline: 'A year told through photographs',
    href: '/years/2023',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'
  },
  {
    title: '2024',
    tagline: 'Another year, another story',
    href: '/years/2024',
    image: 'https://images.unsplash.com/photo-1493225457224-811c7da2af61?q=80&w=2890&auto=format&fit=crop'
  }
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

      {/* ── CREATIVE DIARIES ───────────── */}
      <Section id="creative-diaries">
        <div className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2
              className="text-3xl sm:text-5xl text-white mb-2 tracking-tight"
              style={{ fontFamily: 'HelveticaBold', letterSpacing: '-0.02em' }}
            >
              Creative Diaries
            </h2>
            <p
              className="text-base sm:text-lg text-white/40"
              style={{ fontFamily: 'GlacialIndifferenceItalic' }}
            >
              The primary mediums of my expression.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {CREATIVE_DIARIES.map((item, i) => (
            <Link key={item.title} href={item.href}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: 'easeOut' }}
                className="relative group rounded-none overflow-hidden cursor-pointer h-[28rem] sm:h-[32rem] border border-white/5 bg-neutral-900"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700 ease-out grayscale group-hover:grayscale-0"
                  style={{ backgroundImage: `url(${item.image})` }}
                />

                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-end p-8 sm:p-10">
                  <h3
                    className="text-3xl sm:text-4xl text-white mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                    style={{ fontFamily: 'HelveticaBold', letterSpacing: '-0.02em' }}
                  >
                    {item.title}
                  </h3>
                  <div className="overflow-hidden">
                    <p
                      className="text-sm sm:text-base text-white/60 opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all duration-500 max-w-sm"
                      style={{ fontFamily: 'GlacialIndifferenceItalic' }}
                    >
                      {item.tagline}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ── THE ARCHIVE ───────────── */}
      <Section id="the-archive">
        <div className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2
              className="text-3xl sm:text-5xl text-white mb-2 tracking-tight"
              style={{ fontFamily: 'HelveticaBold', letterSpacing: '-0.02em' }}
            >
              The Archives
            </h2>
            <p
              className="text-base sm:text-lg text-white/40"
              style={{ fontFamily: 'GlacialIndifferenceItalic' }}
            >
              A timeline told through photographic stories.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
          {THE_ARCHIVE.map((item, i) => (
            <Link key={item.title} href={item.href}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: 'easeOut' }}
                className="relative group overflow-hidden cursor-pointer h-64 sm:h-80 border border-white/5 bg-neutral-900"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700 ease-out"
                  style={{ backgroundImage: `url(${item.image})` }}
                />

                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent opacity-90" />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-8">
                  <div className="flex justify-between items-start">
                    <span className="text-white/30 font-mono text-xs uppercase tracking-widest group-hover:text-white/60 transition-colors">
                      Journal Year
                    </span>
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </div>
                  
                  <div>
                    <h3
                      className="text-4xl sm:text-5xl text-white mb-2"
                      style={{ fontFamily: 'HelveticaBold', letterSpacing: '-0.02em' }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm text-white/50 group-hover:text-white/80 transition-colors duration-300"
                      style={{ fontFamily: 'GlacialIndifferenceItalic' }}
                    >
                      {item.tagline}
                    </p>
                  </div>
                </div>
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
