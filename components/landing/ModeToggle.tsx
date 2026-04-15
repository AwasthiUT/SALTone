'use client'

import { motion } from 'framer-motion'

type Props = {
  mode: 'pro' | 'creative'
  onToggle: () => void
}

export default function ModeToggle({ mode, onToggle }: Props) {
  const isPro = mode === 'pro'

  return (
    <button
      onClick={onToggle}
      className="fixed top-6 right-6 sm:top-8 sm:right-8 z-50 flex items-center gap-3 group cursor-pointer"
      aria-label={`Switch to ${isPro ? 'Creative' : 'Professional'} mode`}
    >
      {/* Label */}
      <motion.span
        className="text-xs uppercase tracking-[0.25em] font-bold select-none"
        style={{ fontFamily: 'HelveticaBold' }}
        animate={{
          color: isPro ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.8)',
        }}
        transition={{ duration: 0.4 }}
      >
        {isPro ? 'PRO' : 'CREATE'}
      </motion.span>

      {/* Pill Track */}
      <div className="relative w-14 h-7 rounded-full overflow-hidden">
        {/* Background */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            background: isPro
              ? 'linear-gradient(135deg, #1a1a1a, #2a2a2a)'
              : 'linear-gradient(135deg, #ff3366, #ff6b35, #ffd700)',
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Border glow for creative mode */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: isPro
              ? 'inset 0 0 0 1.5px rgba(255,255,255,0.15)'
              : 'inset 0 0 0 1.5px rgba(255,255,255,0.3), 0 0 20px rgba(255,100,50,0.3)',
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Thumb */}
        <motion.div
          className="absolute top-1 w-5 h-5 rounded-full"
          animate={{
            left: isPro ? 4 : 28,
            background: isPro
              ? 'linear-gradient(135deg, #c0c0c0, #e0e0e0)'
              : 'linear-gradient(135deg, #ffffff, #ffe0d0)',
            boxShadow: isPro
              ? '0 2px 8px rgba(0,0,0,0.4)'
              : '0 2px 12px rgba(255,100,50,0.5)',
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
    </button>
  )
}
