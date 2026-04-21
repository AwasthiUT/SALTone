'use client'

/**
 * ProLayout
 * 
 * A specialized layout wrapper created for the "Pro Mode" redesign.
 * It serves as the orchestrator for the professional identity of the site, 
 * managing the NavbarPro and HeroPro based on the active mode.
 * 
 * It ensures that transitions between Creative and Professional modes feel
 * like a cohesive cinematic shift rather than a page reload.
 */
import { motion, AnimatePresence } from 'framer-motion'
import NavbarPro from './NavbarPro'
import HeroPro from './HeroPro'

type Props = {
  mode: 'pro' | 'creative'
  onToggle: () => void
  children: React.ReactNode
}

export default function ProLayout({ mode, onToggle, children }: Props) {
  const isPro = mode === 'pro'

  return (
    <>
      {/* ── Floating Navbar (always visible, mode-aware) ── */}
      <NavbarPro mode={mode} onToggle={onToggle} />

      {/* ── Pro Hero (only in pro mode) ── */}
      <AnimatePresence mode="wait">
        {isPro && (
          <motion.div
            key="pro-hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <HeroPro />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Below-the-fold content (passed in from page) ── */}
      {children}
    </>
  )
}
