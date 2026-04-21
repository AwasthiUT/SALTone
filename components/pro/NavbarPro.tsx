'use client'

/**
 * NavbarPro
 * 
 * A specialized, floating navigation bar designed for the portfolio's mode-centric architecture.
 * It dynamically switches between 'Professional' and 'Creative' navigation links based on state.
 * 
 * Design Inspiration:
 * - Apple/Linear Style: Uses a blurred backdrop (glass-morphism) and subtle border glows.
 * - Dynamic Context: Smooth transition of links using Framer Motion's AnimatePresence.
 * 
 * @param {('pro'|'creative')} mode - The current active mode of the application.
 * @param {Function} onToggle - Callback function to trigger mode switching.
 */
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  mode: 'pro' | 'creative'
  onToggle: () => void
}

const PRO_LINKS = [
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'Contact', href: '#contact' },
]

const CREATIVE_LINKS = [
  { label: 'Creative Diaries', href: '#creative-diaries' },
  { label: 'Archives', href: '#the-archive' },
  { label: 'Films', href: '/movies' },
  { label: 'Frames', href: '#philosophy' },
]

export default function NavbarPro({ mode, onToggle }: Props) {
  const isPro = mode === 'pro'
  const links = isPro ? PRO_LINKS : CREATIVE_LINKS

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-5 sm:pt-6"
    >
      <div
        className="relative flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-full border backdrop-blur-xl"
        style={{
          background: isPro
            ? 'rgba(10, 10, 10, 0.75)'
            : 'rgba(10, 10, 10, 0.6)',
          borderColor: isPro
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(255, 255, 255, 0.1)',
          boxShadow: isPro
            ? '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)'
            : '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        {/* Logo / Name */}
        <a
          href="#"
          className="mr-2 sm:mr-4 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors duration-300 whitespace-nowrap"
          style={{ fontFamily: 'HelveticaBold' }}
        >
          UA
        </a>

        {/* Divider */}
        <div className="w-px h-4 bg-white/10 mr-1 sm:mr-2" />

        {/* Navigation Links */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-0.5 sm:gap-1"
          >
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative px-2.5 sm:px-3.5 py-1.5 text-[10px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.15em] text-white/50 hover:text-white transition-all duration-300 rounded-full hover:bg-white/[0.06] whitespace-nowrap"
                style={{ fontFamily: 'HelveticaBold' }}
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Divider */}
        <div className="w-px h-4 bg-white/10 ml-1 sm:ml-2" />

        {/* Mode Toggle Switch */}
        <button
          onClick={onToggle}
          className="ml-2 sm:ml-3 flex items-center gap-2 cursor-pointer group"
          aria-label={`Switch to ${isPro ? 'Creative' : 'Professional'} mode`}
        >
          <span
            className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] select-none hidden sm:inline-block"
            style={{
              fontFamily: 'HelveticaBold',
              color: isPro ? 'rgba(255,255,255,0.35)' : 'rgba(255,200,150,0.7)',
            }}
          >
            {isPro ? 'PRO' : 'CREATE'}
          </span>

          {/* Pill Toggle */}
          <div className="relative w-10 h-5 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                background: isPro
                  ? 'linear-gradient(135deg, #1a1a1a, #2a2a2a)'
                  : 'linear-gradient(135deg, #ff3366, #ff6b35)',
              }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: isPro
                  ? 'inset 0 0 0 1px rgba(255,255,255,0.12)'
                  : 'inset 0 0 0 1px rgba(255,255,255,0.25)',
              }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="absolute top-[3px] w-3.5 h-3.5 rounded-full bg-white"
              animate={{
                left: isPro ? 4 : 22,
                boxShadow: isPro
                  ? '0 1px 4px rgba(0,0,0,0.4)'
                  : '0 1px 8px rgba(255,100,50,0.5)',
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </div>
        </button>
      </div>
    </motion.nav>
  )
}
