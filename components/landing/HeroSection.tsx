'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa'
import { Typewriter } from 'react-simple-typewriter'

type Props = {
  mode: 'pro' | 'creative'
}

export default function HeroSection({ mode }: Props) {
  const isPro = mode === 'pro'
  const [greeting, setGreeting] = useState('Hello')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setGreeting('Good Morning')
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good Afternoon')
    } else if (hour >= 17 && hour < 21) {
      setGreeting('Good Evening')
    } else {
      setGreeting("Can't sleep either?")
    }
  }, [])

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 sm:px-12 z-10 overflow-hidden">

      {/* Professional gradient bg (behind text, hidden in creative) */}
      {isPro && (
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            background: 'radial-gradient(ellipse at 50% 40%, #1a1a1a 0%, #0a0a0a 70%, #000000 100%)',
          }}
        />
      )}

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-4xl"
        layout
      >
        {/* Greeting */}
        <motion.p
          className="text-sm sm:text-base uppercase tracking-[0.35em] mb-6"
          animate={{
            color: isPro ? 'rgba(192,192,192,0.6)' : 'rgba(255,255,255,0.7)',
          }}
          transition={{ duration: 0.5 }}
          style={{ fontFamily: 'HelveticaBold' }}
        >
          <Typewriter
            words={[greeting]}
            loop={1}
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1000}
          />
        </motion.p>

        {/* Name */}
        <motion.h1
          className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6"
          animate={{
            color: isPro ? '#ffffff' : '#ffffff',
          }}
          transition={{ duration: 0.5 }}
          style={{ fontFamily: 'HelveticaBold', letterSpacing: '-0.03em' }}
        >
          Utkarsh Awasthi
        </motion.h1>

        {/* Subtitle line - changes based on mode */}
        <motion.div
          className="flex flex-col items-center gap-3 mb-10"
          layout
        >
          <motion.p
            key={mode}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg sm:text-xl lg:text-2xl italic leading-relaxed"
            style={{
              fontFamily: 'CormorantGaramondNormal',
              color: isPro ? 'rgba(192,192,192,0.7)' : 'rgba(255,220,200,0.85)',
            }}
          >
            {isPro
              ? 'Software Engineer · Filmmaker · Photographer'
              : "you've just stepped into a thought that never finished forming."
            }
          </motion.p>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-base sm:text-lg max-w-2xl mx-auto mb-16 leading-relaxed"
          animate={{
            color: isPro ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.5)',
          }}
          transition={{ duration: 0.5 }}
          style={{ fontFamily: 'GlacialIndifferenceItalic' }}
        >
          {isPro
            ? 'Building digital experiences with precision and purpose.'
            : 'Where code meets cinema, and pixels tell stories.'
          }
        </motion.p>

        {/* Scroll hint */}
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        >
          <span
            className="text-[10px] uppercase tracking-[0.3em]"
            style={{ fontFamily: 'HelveticaBold', color: isPro ? 'rgba(192,192,192,0.3)' : 'rgba(255,255,255,0.4)' }}
          >
            Scroll
          </span>
          <svg
            width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke={isPro ? 'rgba(192,192,192,0.3)' : 'rgba(255,255,255,0.4)'}
            strokeWidth="1.5"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Social Icons - fixed bottom center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex space-x-6">
        {[
          { href: 'https://www.instagram.com/ut_awasthi/', icon: FaInstagram, hoverColor: 'hover:text-pink-400' },
          { href: 'https://www.youtube.com/@Yousaidut', icon: FaYoutube, hoverColor: 'hover:text-red-400' },
          { href: 'https://www.linkedin.com/in/utkarsh-awasthi-b35917231/', icon: FaLinkedin, hoverColor: 'hover:text-blue-400' },
        ].map(({ href, icon: Icon, hoverColor }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-white/30 ${hoverColor} transition-colors duration-300 hover:scale-110 transform`}
          >
            <Icon size={24} />
          </a>
        ))}
      </div>
    </section>
  )
}
