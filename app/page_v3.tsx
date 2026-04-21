'use client'

/**
 * Main Landing Page Component (Home)
 * 
 * This file serves as the root orchestrator for the portfolio. It manages the global
 * "mode" state (Pro vs Creative) and persists user preference via sessionStorage.
 * 
 * Architecture:
 * - VideoBackground: Stays mounted globally but toggles visibility (performance optimized).
 * - ProLayout: Wraps the core content to provide a mode-aware navigation and hero experience.
 * - AnimatePresence: Handles the entry/exit choreography of sections as the user switches modes.
 */
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import VideoBackground from '@/components/landing/VideoBackground'
import HeroSection from '@/components/landing/HeroSection'
import ProfessionalSections from '@/components/landing/ProfessionalSections'
import CreativeSections from '@/components/landing/CreativeSections'
import ProLayout from '@/components/pro/ProLayout'
import { FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa'

export default function Home() {
  const [mode, setMode] = useState<'pro' | 'creative'>('pro')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedMode = sessionStorage.getItem('portfolio_mode') as 'pro' | 'creative'
    if (savedMode === 'pro' || savedMode === 'creative') {
      setMode(savedMode)
    }
  }, [])

  const isPro = mode === 'pro'

  const toggle = () => {
    setMode(prev => {
      const next = prev === 'pro' ? 'creative' : 'pro'
      sessionStorage.setItem('portfolio_mode', next)
      return next
    })
  }

  return (
    <main 
      className="relative w-full min-h-screen overflow-x-hidden transition-opacity duration-500"
      style={{ opacity: mounted ? 1 : 0 }}
    >

      {/* ── Video background (always mounted for performance, toggles opacity) ── */}
      <VideoBackground isVisible={!isPro} />

      {/* ── Pro Layout wraps everything when in pro mode ── */}
      <ProLayout mode={mode} onToggle={toggle}>

        {/* ── Creative Hero (only when creative mode is active) ── */}
        <AnimatePresence mode="wait">
          {!isPro && (
            <motion.div
              key="creative-hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <HeroSection mode={mode} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Below-the-fold sections ── */}
        <AnimatePresence mode="wait">
          {isPro ? (
            <motion.div
              key="professional"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 bg-black"
            >
              <ProfessionalSections />
            </motion.div>
          ) : (
            <motion.div
              key="creative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CreativeSections />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Footer ── */}
        <footer className="relative z-10 text-center py-12">
          <motion.p
            className="text-sm uppercase tracking-[0.2em] mb-6"
            animate={{ color: isPro ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.5)' }}
            transition={{ duration: 0.5 }}
            style={{ fontFamily: 'HelveticaBold' }}
          >
            Utkarsh Awasthi
          </motion.p>
          <div className="flex justify-center space-x-6">
            {[
              { href: 'https://www.instagram.com/ut_awasthi/', icon: FaInstagram },
              { href: 'https://www.youtube.com/@Yousaidut', icon: FaYoutube },
              { href: 'https://www.linkedin.com/in/utkarsh-awasthi-b35917231/', icon: FaLinkedin },
            ].map(({ href, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/20 hover:text-white/60 transition-colors duration-300"
              >
                <Icon size={22} />
              </a>
            ))}
          </div>
        </footer>

      </ProLayout>
    </main>
  )
}
