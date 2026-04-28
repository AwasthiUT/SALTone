'use client'

import { useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FaLinkedin, FaGithub, FaInstagram, FaYoutube } from 'react-icons/fa'
import type { TechnicalSection } from '@/lib/supabase/technical'

const FONT_DISPLAY = '"HelveticaBold", "Helvetica Neue", Helvetica, Arial, sans-serif'
const FONT_BODY    = '"GlacialIndifferenceItalic", "Helvetica Neue", Helvetica, Arial, sans-serif'
const FONT_UI      = '"Helvetica Neue", Helvetica, Arial, sans-serif'

const LINKS = [
  { id: 'work-linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/utkarsh-awasthi-b35917231/', icon: FaLinkedin },
  { id: 'work-youtube',  label: 'YouTube',  href: 'https://www.youtube.com/@Yousaidut',                    icon: FaYoutube  },
  { id: 'work-instagram',label: 'Instagram',href: 'https://www.instagram.com/ut_awasthi/',                 icon: FaInstagram},
]

const SKILLS: { label: string; items: string[] }[] = [
  { label: 'Frontend',      items: ['React', 'Next.js', 'TypeScript', 'CSS / Animation'] },
  { label: 'Backend',       items: ['Node.js', 'Java', 'Spring Boot', 'REST APIs'] },
  { label: 'Data & Infra',  items: ['PostgreSQL', 'Supabase', 'Docker', 'Vercel'] },
  { label: 'Design & Tools',items: ['Figma', 'Framer Motion', 'Git', 'UI Systems'] },
]

const EXPERIENCE = [
  {
    role: 'Software Engineer',
    company: 'Current Company',
    period: '2024 — Present',
    tags: ['Next.js', 'Node.js', 'PostgreSQL'],
    description: 'Building scalable full-stack applications. Leading frontend architecture decisions and shipping production features used by real people daily.',
  },
  {
    role: 'Frontend Developer',
    company: 'Previous Org',
    period: '2023 — 2024',
    tags: ['React', 'TypeScript', 'Docker'],
    description: 'Developed responsive web applications. Improved page-load performance by 40% through code splitting, lazy loading, and build optimization.',
  },
  {
    role: 'Software Engineering Intern',
    company: 'Startup Inc.',
    period: '2022 — 2023',
    tags: ['Java', 'Spring Boot', 'REST'],
    description: 'Full-stack development with Node.js and React. Built RESTful APIs and integrated third-party services end-to-end.',
  },
]

const PROJECTS = [
  {
    title: 'This Portfolio',
    desc: 'A mode-switching creative/professional portfolio built in Next.js with Supabase, Framer Motion, and custom typography. The one you\'re looking at.',
    stack: ['Next.js', 'Supabase', 'Framer Motion', 'TypeScript'],
    status: 'Live',
    href: '#',
  },
  {
    title: 'Automation Engine',
    desc: 'Background job orchestration system for scheduling, retry logic, and async workflows. Built for scale with queue-based architecture.',
    stack: ['Node.js', 'PostgreSQL', 'Docker', 'Redis'],
    status: 'In Progress',
    href: '#',
  },
  {
    title: 'Creative Tooling Suite',
    desc: 'Internal tools to manage films, galleries, and media assets — powering the creative side of this portfolio with a custom CMS backend.',
    stack: ['Next.js', 'Supabase', 'TypeScript'],
    status: 'Live',
    href: '#',
  },
  {
    title: 'Aadhaar Integration SDK',
    desc: 'UIDAI Aadhaar auth flow with QR generation, JWT tokens, XML callback handling, and SD-JWT credential decoding. Production-grade.',
    stack: ['Node.js', 'Puppeteer', 'JWT', 'XML'],
    status: 'Shipped',
    href: '#',
  },
]

const CURRENTLY = [
  { label: 'Role', value: 'Full-Stack Engineer' },
  { label: 'Focus', value: 'Systems & Automation' },
  { label: 'Side projects', value: 'This site + creative tooling' },
  { label: 'Open to', value: 'Interesting problems' },
]

// ─── Scroll-reveal wrapper ──────────────────────────
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  )
}

// ─── Section label + title pattern ─────────────────
function SectionHead({ label, title, sub }: { label: string; title: React.ReactNode; sub?: string | null }) {
  return (
    <div className="mb-16 sm:mb-20">
      <p style={{ fontFamily: FONT_DISPLAY, fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.28)', marginBottom: '1rem' }}>
        — {label}
      </p>
      <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 'clamp(2.4rem, 5vw, 5rem)', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.04em', color: '#0d0d0d', marginBottom: sub ? '1.2rem' : 0 }}>
        {title}
      </h2>
      {sub && <p style={{ fontFamily: FONT_BODY, fontStyle: 'italic', fontSize: '1.1rem', color: 'rgba(0,0,0,0.4)', maxWidth: '54ch' }}>{sub}</p>}
    </div>
  )
}

export default function WorkContent({ onBack, sections = [] }: { onBack?: () => void; sections?: TechnicalSection[] }) {
  const router = useRouter()
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  const handleBack = () => { if (onBack) onBack(); else router.back() }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', width: '100%' }}>

      {/* ── Nav ── */}
      <motion.nav initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.75rem 2.5rem', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <button onClick={handleBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.35)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: FONT_UI, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.2s ease', padding: 0 }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.8)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.35)')}>
          ← back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.6)', fontWeight: 500, background: 'rgba(0,0,0,0.05)', padding: '0.3rem 0.75rem', borderRadius: '999px', border: '1px solid rgba(0,0,0,0.1)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 2px rgba(34,197,94,0.25)', display: 'inline-block' }} />
            available
          </span>
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.28)', fontWeight: 500 }}>
            technical world
          </span>
        </div>
      </motion.nav>

      {/* ── Dynamic Sections ── */}
      {sections.map((section) => {
        console.log("Rendering section:", section.section_key);

        switch (section.section_key) {
          case 'landing':
            return (
              <motion.header 
                key={section.id ?? 'landing'}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
                style={{ padding: '5rem 2.5rem 3rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <p style={{ fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', fontWeight: 500, marginBottom: '1.2rem' }}>
                  {section.description}
                </p>
                <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 'clamp(2.8rem, 6vw, 5.5rem)', fontWeight: 700, lineHeight: 1.0, letterSpacing: '-0.03em', color: '#0d0d0d', margin: '0 0 1.4rem' }}>
                  {section.title?.split('\n').map((line, i) => (
                    <span key={i}>{line}{i < (section.title?.split('\n').length ?? 0) - 1 && <br />}</span>
                  ))}
                </h1>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'rgba(0,0,0,0.48)', maxWidth: '46ch', fontFamily: FONT_BODY, fontStyle: 'italic' }}>
                  {section.subtitle}
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
                  {['experience', 'projects', 'stack', 'contact'].map(anchor => (
                    <a key={anchor} href={`#${anchor}`} style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', textDecoration: 'none', fontFamily: FONT_UI, fontWeight: 500, transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#0d0d0d')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.4)')}>
                      {anchor} ↓
                    </a>
                  ))}
                </div>
              </motion.header>
            );

          case 'stats':
            const statsItems = (section.metadata?.items ?? []).filter(item => item.is_active !== false);
            return (
              <section key={section.id ?? 'stats'} style={{ padding: '3.5rem 2.5rem', background: '#f9f9f7', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <Reveal>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '2.5rem' }}>
                    {statsItems.map((item, idx) => (
                      <div key={idx}>
                        <p style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', fontFamily: FONT_UI, fontWeight: 500, marginBottom: '0.5rem' }}>{item.subtitle}</p>
                        <p style={{ fontSize: '0.95rem', color: '#0d0d0d', fontFamily: FONT_DISPLAY, fontWeight: 700 }}>{item.title}</p>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </section>
            );

          case 'capabilities':
            const capabilityBlocks = (section.metadata?.blocks ?? []).filter(block => block.is_active !== false);
            return (
              <section key={section.id ?? 'capabilities'} id="stack" style={{ padding: '5rem 2.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <Reveal>
                  <SectionHead 
                    label={section.description ?? "capabilities"} 
                    title={section.title?.includes('\n') ? 
                      section.title.split('\n').map((line, i) => (
                        <span key={i} style={i > 0 ? { color: 'rgba(0,0,0,0.2)' } : {}}>{line}{i < section.title!.split('\n').length - 1 && <br />}</span>
                      )) : section.title 
                    } 
                    sub={section.subtitle} 
                  />
                </Reveal>
                <Reveal delay={0.1}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1px', background: 'rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    {capabilityBlocks.map((block, idx) => (
                      <div key={idx} style={{ background: '#f9f9f7', padding: '2rem' }}>
                        <p style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.32)', fontWeight: 600, marginBottom: '1.2rem', fontFamily: FONT_UI }}>{block.title}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          {(block.technologies ?? []).map(item => (
                            <span key={item} style={{ fontSize: '0.95rem', color: 'rgba(0,0,0,0.75)', fontWeight: 500, fontFamily: FONT_DISPLAY, letterSpacing: '-0.01em' }}>{item}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </section>
            );

          case 'experience':
            const expItems = [...(section.metadata?.items ?? [])].sort((a, b) => {
              const yearA = parseInt(String(a.start)) || 0;
              const yearB = parseInt(String(b.start)) || 0;
              return yearB - yearA;
            });
            return (
              <section key={section.id ?? 'experience'} id="experience" style={{ padding: '5rem 2.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <Reveal>
                  <SectionHead 
                    label={section.description ?? "experience"} 
                    title={section.title?.includes('\n') ? 
                      section.title.split('\n').map((line, i) => (
                        <span key={i} style={i > 0 ? { color: 'rgba(0,0,0,0.2)' } : {}}>{line}{i < section.title!.split('\n').length - 1 && <br />}</span>
                      )) : section.title 
                    } 
                    sub={section.subtitle} 
                  />
                </Reveal>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {expItems.map((exp, i) => (
                    <Reveal key={i} delay={i * 0.1}>
                      <div style={{ padding: '2.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', transition: 'background 0.2s ease' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.015)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem' }}>
                          <div>
                            <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: '1.4rem', fontWeight: 700, color: '#0d0d0d', letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>{exp.role}</h3>
                            <p style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.45)', fontFamily: FONT_UI }}>{exp.company}</p>
                          </div>
                          <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(0,0,0,0.3)', fontFamily: FONT_UI, textTransform: 'uppercase' }}>{exp.start} — {exp.end}</p>
                        </div>
                        <p style={{ fontFamily: FONT_BODY, fontStyle: 'italic', fontSize: '1rem', lineHeight: 1.7, color: 'rgba(0,0,0,0.5)', maxWidth: '60ch' }}>{exp.description}</p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {(exp.tech ?? []).map(tag => (
                            <span key={tag} style={{ fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.25rem 0.65rem', border: '1px solid rgba(0,0,0,0.1)', color: 'rgba(0,0,0,0.4)', fontFamily: FONT_UI }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </section>
            );

          case 'projects':
            const projectItems = (section.metadata?.items ?? []);
            return (
              <section key={section.id ?? 'projects'} id="projects" style={{ padding: '5rem 2.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#f9f9f7' }}>
                <Reveal>
                  <SectionHead 
                    label={section.description ?? "work"} 
                    title={section.title?.includes('\n') ? 
                      section.title.split('\n').map((line, i) => (
                        <span key={i} style={i > 0 ? { color: 'rgba(0,0,0,0.2)' } : {}}>{line}{i < section.title!.split('\n').length - 1 && <br />}</span>
                      )) : section.title 
                    } 
                    sub={section.subtitle} 
                  />
                </Reveal>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1px', background: 'rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden', borderRadius: '4px' }}>
                  {projectItems.map((proj, i) => (
                    <Reveal key={i} delay={i * 0.08}>
                      <motion.div
                        onHoverStart={() => setHoveredProject(i)}
                        onHoverEnd={() => setHoveredProject(null)}
                        whileHover={{ background: '#fff' }}
                        style={{ background: '#f9f9f7', padding: '2.5rem 2rem', minHeight: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'background 0.3s ease', cursor: 'default' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: '1.1rem', fontWeight: 700, color: '#0d0d0d', letterSpacing: '-0.02em' }}>{proj.title}</h3>
                            <span style={{ fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.2rem 0.55rem', border: '1px solid rgba(0,0,0,0.15)', color: 'rgba(0,0,0,0.4)', fontFamily: FONT_UI, whiteSpace: 'nowrap' }}>
                              {proj.status}
                            </span>
                          </div>
                          <p style={{ fontFamily: FONT_BODY, fontStyle: 'italic', fontSize: '0.9rem', lineHeight: 1.65, color: 'rgba(0,0,0,0.5)', marginBottom: '1.5rem' }}>{proj.description}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {(proj.tech ?? []).map(t => (
                            <span key={t} style={{ fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.2rem 0.55rem', background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.45)', fontFamily: FONT_UI }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </Reveal>
                  ))}
                </div>
              </section>
            );

          case 'contact':
            const contactItems = (section.metadata?.items ?? []);
            return (
              <section key={section.id ?? 'contact'} id="contact" style={{ padding: '6rem 2.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <Reveal>
                  <SectionHead 
                    label={section.description ?? "contact"} 
                    title={section.title?.includes('\n') ? 
                      section.title.split('\n').map((line, i) => (
                        <span key={i} style={i > 0 ? { color: 'rgba(0,0,0,0.2)' } : {}}>{line}{i < section.title!.split('\n').length - 1 && <br />}</span>
                      )) : section.title 
                    } 
                  />
                </Reveal>
                <Reveal delay={0.1}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1px', background: 'rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden', borderRadius: '4px', maxWidth: '900px' }}>
                    {contactItems.map((item, idx) => (
                      <a key={idx} href={item.link ?? '#'} target={item.link?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                        style={{ display: 'block', background: '#f9f9f7', padding: '2rem', textDecoration: 'none', transition: 'background 0.25s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#fff')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#f9f9f7')}>
                        <p style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', fontFamily: FONT_UI, marginBottom: '0.5rem' }}>{item.title}</p>
                        <p style={{ fontFamily: FONT_DISPLAY, fontSize: '0.95rem', color: '#0d0d0d', fontWeight: 600 }}>{item.subtitle} →</p>
                      </a>
                    ))}
                  </div>
                </Reveal>
              </section>
            );

          default:
            return null;
        }
      })}

      {/* ── Footer ── */}
      <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        style={{ padding: '1.75rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {LINKS.map(({ id, label, href, icon: Icon }) => (
            <a key={id} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
              style={{ color: 'rgba(0,0,0,0.3)', transition: 'color 0.2s ease', display: 'flex' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.8)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.3)')}>
              <Icon size={18} />
            </a>
          ))}
        </div>
        <a href="/creative"
          style={{ fontSize: '0.65rem', color: 'rgba(0,0,0,0.28)', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: FONT_UI, fontWeight: 500, transition: 'color 0.2s ease' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.65)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.28)')}>
          ← creative side
        </a>
      </motion.footer>
    </motion.div>
  )
}
