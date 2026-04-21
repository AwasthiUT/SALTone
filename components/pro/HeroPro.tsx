'use client'

/**
 * HeroPro
 * 
 * The primary landing hero for the "Professional Mode". This component blends two distinct 
 * visual philosophies into a single cohesive experience.
 * 
 * 1. Background (Gates Notes inspired): 
 *    Features a soft, tech-themed watercolor illustration background with subtle blurs 
 *    to feel approachable and academic.
 * 
 * 2. Foreground (Sean O'Brien inspired): 
 *    Strong, bold San-Serif typography over a deep dark gradient overlay to command 
 *    authority and focus on engineering precision.
 * 
 * Uses Framer Motion for staggered entrance animations of text elements.
 */
import { motion, type Variants } from 'framer-motion'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.6,
    },
  },
}

const childVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function HeroPro() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden flex flex-col justify-center">

      {/* ── Layer 1: Illustrated background (Gates Notes inspired) ── */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{
            backgroundImage: 'url(/pro-bg-illustration.png)',
            filter: 'blur(1.5px) saturate(0.8)',
          }}
        />
        {/* Warm overlay to soften the illustration */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(245,240,232,0.3) 0%, rgba(245,240,232,0.15) 30%, transparent 60%)',
          }}
        />
      </div>

      {/* ── Layer 2: Dark gradient overlay (Sean O'Brien inspired) ── */}
      <div className="absolute inset-0 z-[1]">
        {/* Top fade: subtle, letting illustration peek through */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                180deg,
                rgba(0,0,0,0.15) 0%,
                rgba(0,0,0,0.35) 20%,
                rgba(0,0,0,0.75) 50%,
                rgba(0,0,0,0.92) 70%,
                rgba(0,0,0,0.98) 85%,
                #000000 100%
              )
            `,
          }}
        />
      </div>

      {/* ── Layer 3: Subtle noise texture ── */}
      <div
        className="absolute inset-0 z-[2] opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* ── Layer 4: Content ── */}
      <motion.div
        className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 pt-32 pb-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Small label — editorial style */}
        <motion.p
          variants={childVariants}
          className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-white/30 mb-6 sm:mb-8 text-left"
          style={{ fontFamily: 'HelveticaBold' }}
        >
          Utkarsh Awasthi
        </motion.p>

        {/* Main headline — bold, editorial, Sean O'Brien style */}
        <motion.h1
          variants={childVariants}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-bold leading-[0.95] tracking-tight text-white max-w-5xl mb-8 sm:mb-12 text-left"
          style={{
            fontFamily: 'HelveticaBold',
            letterSpacing: '-0.04em',
          }}
        >
          <span className="block mb-2 sm:mb-4">Software Engineer.</span>
          <span className="block text-white/50">Building systems,</span>
          <span className="block text-white/50">automation &</span>
          <span className="block text-white/50">experiences.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={childVariants}
          className="text-lg sm:text-xl lg:text-2xl text-white/35 max-w-2xl leading-relaxed mb-12 sm:mb-16 text-left"
          style={{ fontFamily: 'GlacialIndifferenceItalic' }}
        >
          Currently working on automation systems, backend services,
          and creative tooling.
        </motion.p>

        {/* CTA Link */}
        <motion.div variants={childVariants} className="text-left w-full">
          <a
            href="#experience"
            className="group inline-flex items-center gap-3 text-sm sm:text-base text-white/50 hover:text-white transition-colors duration-500"
            style={{ fontFamily: 'HelveticaBold' }}
          >
            <span className="border-b border-white/20 group-hover:border-white/60 pb-0.5 transition-colors duration-500">
              Come see what I&apos;m working on
            </span>
            <motion.span
              className="inline-block"
              animate={{ x: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            >
              →
            </motion.span>
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 2 }}
        >
          <span
            className="text-[9px] uppercase tracking-[0.3em] text-white/30"
            style={{ fontFamily: 'HelveticaBold' }}
          >
            Scroll
          </span>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
