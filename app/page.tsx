'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ModeToggle from '@/components/landing/ModeToggle'
import HeroSection from '@/components/landing/HeroSection'
import FluidBackground from '@/components/landing/FluidBackground'
import ProfessionalSections from '@/components/landing/ProfessionalSections'
import CreativeSections from '@/components/landing/CreativeSections'
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

      {/* ── Fluid background (creative mode only) ── */}
      <AnimatePresence>
        {!isPro && <FluidBackground />}
      </AnimatePresence>

      {/* ── Solid background (pro mode) — sits behind everything ── */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none"
        animate={{
          backgroundColor: isPro ? '#0a0a0a' : 'transparent',
        }}
        transition={{ duration: 0.6 }}
      />

      {/* ── Toggle ── */}
      <ModeToggle mode={mode} onToggle={toggle} />

      {/* ── Hero ── */}
      <HeroSection mode={mode} />

      {/* ── Below-the-fold sections ── */}
      <AnimatePresence mode="wait">
        {isPro ? (
          <motion.div
            key="professional"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
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
          animate={{ color: isPro ? 'rgba(255,0,0,0.7)' : 'rgba(255,255,255,0.5)' }}
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
              className="text-white/20 hover:text-[#FF0000] transition-colors duration-300"
            >
              <Icon size={22} />
            </a>
          ))}
        </div>
      </footer>
    </main>
  )
}
