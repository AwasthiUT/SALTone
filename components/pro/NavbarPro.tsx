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
import { useState } from 'react'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  function handleToggle() {
    onToggle()
    setIsMobileMenuOpen(false)
  }

  function handleLinkClick() {
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-5 sm:pt-6"
    >
      <div
        className="relative flex w-full max-w-max items-center justify-between gap-2 rounded-full border px-3 py-2.5 backdrop-blur-xl sm:w-auto sm:justify-start sm:gap-2 sm:px-5"
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
            onClick={handleLinkClick}
            className="text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap text-white/80 transition-colors duration-300 hover:text-white sm:mr-4 sm:text-sm"
            style={{ fontFamily: 'HelveticaBold' }}
          >
            UA
          </a>

          {/* Divider */}
          <div className="hidden h-4 w-px bg-white/10 sm:mr-2 sm:block" />

          {/* Navigation Links */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
              className="hidden items-center gap-1 sm:flex"
            >
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative rounded-full px-3.5 py-1.5 text-xs uppercase tracking-[0.15em] whitespace-nowrap text-white/50 transition-all duration-300 hover:bg-white/[0.06] hover:text-white"
                  style={{ fontFamily: 'HelveticaBold' }}
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="ml-auto flex items-center gap-2 sm:ml-0">
            {/* Divider */}
            <div className="hidden h-4 w-px bg-white/10 sm:ml-2 sm:block" />

            {/* Mode Toggle Switch */}
            <button
              onClick={handleToggle}
              className="group flex cursor-pointer items-center gap-2 sm:ml-3"
              aria-label={`Switch to ${isPro ? 'Creative' : 'Professional'} mode`}
            >
              <span
                className="hidden select-none text-[10px] uppercase tracking-[0.2em] sm:inline-block"
                style={{
                  fontFamily: 'HelveticaBold',
                  color: isPro ? 'rgba(255,255,255,0.35)' : 'rgba(255,200,150,0.7)',
                }}
              >
                {isPro ? 'PRO' : 'CREATE'}
              </span>

              {/* Pill Toggle */}
              <div className="relative h-5 w-10 overflow-hidden rounded-full">
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
                  className="absolute top-[3px] h-3.5 w-3.5 rounded-full bg-white"
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

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/75 transition-colors duration-300 hover:bg-white/[0.08] hover:text-white sm:hidden"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <div className="flex flex-col gap-1.5">
                <span
                  className={`block h-px w-4 bg-current transition-transform duration-300 ${isMobileMenuOpen ? 'translate-y-[7px] rotate-45' : ''}`}
                />
                <span
                  className={`block h-px w-4 bg-current transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}
                />
                <span
                  className={`block h-px w-4 bg-current transition-transform duration-300 ${isMobileMenuOpen ? '-translate-y-[7px] -rotate-45' : ''}`}
                />
              </div>
            </button>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="absolute top-full left-0 right-0 mt-3 rounded-[1.5rem] border border-white/10 bg-black/85 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:hidden"
              >
                <div className="flex flex-col gap-1">
                  {links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={handleLinkClick}
                      className="rounded-2xl px-4 py-3 text-[11px] uppercase tracking-[0.16em] text-white/75 transition-colors duration-300 hover:bg-white/[0.06] hover:text-white"
                      style={{ fontFamily: 'HelveticaBold' }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    </motion.nav>
  )
}
