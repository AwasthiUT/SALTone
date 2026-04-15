'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const SKILLS = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Next.js', color: '#ffffff' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Python', color: '#FFD43B' },
  { name: 'Java', color: '#ED8B00' },
  { name: 'Node.js', color: '#68A063' },
  { name: 'AWS', color: '#FF9900' },
  { name: 'Docker', color: '#2496ED' },
  { name: 'PostgreSQL', color: '#4169E1' },
  { name: 'MongoDB', color: '#47A248' },
  { name: 'Git', color: '#F05032' },
  { name: 'Figma', color: '#A259FF' },
]

export default function SkillBalls() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-4xl mx-auto py-8">
      {SKILLS.map((skill, i) => (
        <motion.div
          key={skill.name}
          initial={{ y: -120, opacity: 0, scale: 0.5 }}
          animate={isVisible ? {
            y: 0,
            opacity: 1,
            scale: 1,
          } : {}}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: i * 0.08,
          }}
          whileHover={{
            scale: 1.15,
            y: -8,
            transition: { duration: 0.2 },
          }}
          className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full cursor-default select-none"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${skill.color}40, ${skill.color}15)`,
            border: `2px solid ${skill.color}50`,
            boxShadow: `0 4px 20px ${skill.color}20`,
          }}
        >
          <span
            className="text-xs sm:text-sm font-bold text-white/90 text-center leading-tight px-1"
            style={{ fontFamily: 'HelveticaBold' }}
          >
            {skill.name}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
