'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import SkillBalls from './SkillBalls'

// ─── Data ──────────────────────────────────────────

const EXPERIENCE = [
  {
    role: 'Software Engineer',
    company: 'Your Company',
    period: '2024 — Present',
    description: 'Building scalable full-stack applications with modern technologies. Leading frontend architecture decisions and mentoring junior developers.',
  },
  {
    role: 'Frontend Developer',
    company: 'Previous Org',
    period: '2023 — 2024',
    description: 'Developed responsive web applications using React and Next.js. Improved page load performance by 40% through code splitting and optimization.',
  },
  {
    role: 'Software Engineering Intern',
    company: 'Startup Inc.',
    period: '2022 — 2023',
    description: 'Full-stack development with Node.js and React. Built RESTful APIs and integrated third-party services.',
  },
]

const ROADMAP = [
  { year: '2021', milestone: 'Started coding journey', detail: 'Fell in love with building things from scratch' },
  { year: '2022', milestone: 'First internship', detail: 'Learned the craft of production-grade software' },
  { year: '2023', milestone: 'Full-stack proficiency', detail: 'Built end-to-end applications independently' },
  { year: '2024', milestone: 'Engineering at scale', detail: 'Working with distributed systems and large codebases' },
  { year: '2025', milestone: 'What\'s next?', detail: 'Exploring AI/ML, system design, and creative tech' },
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-3xl sm:text-5xl text-white mb-4 tracking-tight"
      style={{ fontFamily: 'HelveticaBold', letterSpacing: '-0.02em' }}
    >
      {children}
    </h2>
  )
}

function SectionSubtitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-base sm:text-lg text-white/30 mb-12 max-w-xl"
      style={{ fontFamily: 'GlacialIndifferenceItalic' }}
    >
      {children}
    </p>
  )
}

// ─── Main Component ────────────────────────────────

export default function ProfessionalSections() {
  return (
    <div className="relative z-10 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]">

      {/* Divider line */}
      <div className="w-full flex justify-center">
        <div className="w-16 h-px bg-white/10" />
      </div>

      {/* ── EXPERIENCE ───────────── */}
      <Section id="experience">
        <SectionTitle>Experience</SectionTitle>
        <SectionSubtitle>Where I&apos;ve built, broken, and rebuilt things.</SectionSubtitle>

        <div className="space-y-8">
          {EXPERIENCE.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="group relative pl-8 border-l border-white/10 hover:border-[#FF0000]/40 transition-colors duration-500"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-2 w-2 h-2 -translate-x-[5px] rounded-full bg-white/20 group-hover:bg-[#FF0000] transition-colors duration-500" />

              <p
                className="text-xs uppercase tracking-[0.2em] text-white/30 mb-1"
                style={{ fontFamily: 'HelveticaBold' }}
              >
                {exp.period}
              </p>
              <h3
                className="text-xl sm:text-2xl text-white/90 mb-1"
                style={{ fontFamily: 'HelveticaBold' }}
              >
                {exp.role}
              </h3>
              <p
                className="text-sm text-[#FF0000]/70 mb-3"
                style={{ fontFamily: 'HelveticaBold' }}
              >
                {exp.company}
              </p>
              <p
                className="text-sm sm:text-base text-white/40 leading-relaxed max-w-2xl"
                style={{ fontFamily: 'GlacialIndifferenceItalic' }}
              >
                {exp.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── SKILLS ───────────── */}
      <Section id="skills">
        <div className="text-center">
          <SectionTitle>Skills</SectionTitle>
          <SectionSubtitle>Technologies I work with daily.</SectionSubtitle>
        </div>
        <SkillBalls />
      </Section>

      {/* ── ROADMAP ───────────── */}
      <Section id="roadmap">
        <SectionTitle>Roadmap</SectionTitle>
        <SectionSubtitle>The timeline of growth.</SectionSubtitle>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />

          <div className="space-y-12">
            {ROADMAP.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative pl-12 group"
              >
                {/* Node */}
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full border border-white/15 group-hover:border-[#FF0000]/50 flex items-center justify-center transition-colors duration-500 bg-[#0a0a0a]">
                  <span
                    className="text-[9px] text-white/40 group-hover:text-[#FF0000] transition-colors duration-500"
                    style={{ fontFamily: 'HelveticaBold' }}
                  >
                    {item.year.slice(2)}
                  </span>
                </div>

                <p
                  className="text-xs uppercase tracking-[0.2em] text-white/25 mb-1"
                  style={{ fontFamily: 'HelveticaBold' }}
                >
                  {item.year}
                </p>
                <h3
                  className="text-lg sm:text-xl text-white/85 mb-2"
                  style={{ fontFamily: 'HelveticaBold' }}
                >
                  {item.milestone}
                </h3>
                <p
                  className="text-sm text-white/35 max-w-lg"
                  style={{ fontFamily: 'GlacialIndifferenceItalic' }}
                >
                  {item.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  )
}
