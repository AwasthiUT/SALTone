'use client'

import { useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FaLinkedin, FaGithub, FaInstagram, FaYoutube, FaCode, FaServer, FaTerminal, FaLaptopCode, FaArrowRight } from 'react-icons/fa'
import type { TechnicalSection } from '@/lib/supabase/technical'

const FONT_DISPLAY = '"HelveticaBold", "Helvetica Neue", Helvetica, Arial, sans-serif'
const FONT_BODY    = '"GlacialIndifferenceItalic", "Helvetica Neue", Helvetica, Arial, sans-serif'
const FONT_UI      = '"Helvetica Neue", Helvetica, Arial, sans-serif'
const FONT_MONO    = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'

const LINKS = [
  { id: 'work-linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/utkarsh-awasthi-b35917231/', icon: FaLinkedin },
  { id: 'work-youtube',  label: 'YouTube',  href: 'https://www.youtube.com/@Yousaidut',                    icon: FaYoutube  },
  { id: 'work-instagram',label: 'Instagram',href: 'https://www.instagram.com/ut_awasthi/',                 icon: FaInstagram},
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
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  )
}

// ─── Section label + title pattern ─────────────────
function SectionHead({ label, title, sub }: { label: string; title: React.ReactNode; sub?: string | null }) {
  return (
    <div className="mb-16 sm:mb-20">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <span style={{ width: '8px', height: '8px', background: '#000000', display: 'inline-block' }} />
        <p style={{ fontFamily: FONT_MONO, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.5)', margin: 0 }}>
          // {label}
        </p>
      </div>
      <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.04em', color: '#111111', marginBottom: sub ? '1.5rem' : 0 }}>
        {title}
      </h2>
      {sub && <p style={{ fontFamily: FONT_BODY, fontStyle: 'italic', fontSize: '1.2rem', color: 'rgba(0,0,0,0.55)', maxWidth: '54ch', lineHeight: 1.6 }}>{sub}</p>}
    </div>
  )
}

export default function WorkContent({ onBack, sections = [] }: { onBack?: () => void; sections?: TechnicalSection[] }) {
  const router = useRouter()
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  const handleBack = () => { if (onBack) onBack(); else router.back() }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100dvh', 
        width: '100%',
        backgroundColor: '#FAFAFA',
        color: '#111111',
        position: 'relative',
        overflow: 'hidden'
      }}>
      
      {/* ── Subtle Dot Grid Background ── */}
      <div style={{ 
        position: 'fixed', 
        top: 0, left: 0, width: '100vw', height: '100vh', 
        backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.06) 1px, transparent 1px)', 
        backgroundSize: '32px 32px', 
        pointerEvents: 'none', 
        zIndex: 0,
        opacity: 0.6
      }} />
      
      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* ── Nav ── */}
        <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2rem 3rem', borderBottom: '1px solid rgba(0,0,0,0.06)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(250,250,250,0.85)' }}>
          <button onClick={handleBack}
            className="group"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.5)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: FONT_UI, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: 0, transition: 'all 0.3s ease' }}>
            <span style={{ transform: 'translateX(0)', transition: 'transform 0.3s ease' }} className="group-hover:-translate-x-1">←</span> back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#16a34a', fontWeight: 600, background: 'rgba(22,163,74,0.08)', padding: '0.4rem 0.8rem', borderRadius: '999px', border: '1px solid rgba(22,163,74,0.15)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 0 2px rgba(22,163,74,0.2)', display: 'inline-block' }} className="animate-pulse" />
              available
            </span>
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', fontWeight: 600, fontFamily: FONT_MONO }}>
              SYSTEM_ACTIVE
            </span>
          </div>
        </motion.nav>

        {/* ── Dynamic Sections ── */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {sections.map((section) => {
            switch (section.section_key) {
              case 'landing':
                return (
                  <motion.header 
                    key={section.id ?? 'landing'}
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    style={{ padding: '8rem 3rem 6rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem', padding: '0.5rem 1rem', background: '#ffffff', borderRadius: '999px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                      <FaCode color="#000000" size={12} />
                      <p style={{ fontFamily: FONT_MONO, fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.6)', fontWeight: 600, margin: 0 }}>
                        {section.description}
                      </p>
                    </div>
                    <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 'clamp(3.5rem, 8vw, 7rem)', fontWeight: 700, lineHeight: 1.0, letterSpacing: '-0.04em', color: '#111111', margin: '0 0 2rem' }}>
                      {section.title?.split('\n').map((line, i) => (
                        <span key={i} style={i > 0 ? { color: 'rgba(0,0,0,0.3)' } : {}}>{line}{i < (section.title?.split('\n').length ?? 0) - 1 && <br />}</span>
                      ))}
                    </h1>
                    <p style={{ fontSize: '1.25rem', lineHeight: 1.6, color: 'rgba(0,0,0,0.55)', maxWidth: '50ch', fontFamily: FONT_BODY, fontStyle: 'italic' }}>
                      {section.subtitle}
                    </p>
                    <div style={{ display: 'flex', gap: '2rem', marginTop: '4.5rem', flexWrap: 'wrap' }}>
                      {['experience', 'projects', 'stack', 'contact'].map((anchor, idx) => (
                        <a key={anchor} href={`#${anchor}`} 
                          className="group"
                          style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.5)', textDecoration: 'none', fontFamily: FONT_UI, fontWeight: 600, transition: 'color 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#111111')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.5)')}>
                          <span style={{ fontFamily: FONT_MONO, opacity: 0.5, fontSize: '0.65rem' }}>0{idx + 1}</span>
                          {anchor} 
                          <span style={{ transition: 'transform 0.3s ease', opacity: 0.5 }} className="group-hover:translate-y-1">↓</span>
                        </a>
                      ))}
                    </div>
                  </motion.header>
                );

              case 'stats':
                const statsItems = (section.metadata?.items ?? []).filter(item => item.is_active !== false);
                return (
                  <section key={section.id ?? 'stats'} style={{ padding: '4.5rem 3rem', borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#ffffff' }}>
                    <Reveal>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '3rem' }}>
                        {statsItems.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '2px solid rgba(0,0,0,0.08)', paddingLeft: '1.5rem' }}>
                            <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', fontFamily: FONT_MONO, fontWeight: 600 }}>{item.subtitle}</p>
                            <p style={{ fontSize: '1.75rem', color: '#111111', fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: '-0.02em' }}>{item.title}</p>
                          </div>
                        ))}
                      </div>
                    </Reveal>
                  </section>
                );

              case 'capabilities':
                const capabilityBlocks = (section.metadata?.blocks ?? []).filter(block => block.is_active !== false);
                return (
                  <section key={section.id ?? 'capabilities'} id="stack" style={{ padding: '8rem 3rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <Reveal>
                      <SectionHead 
                        label={section.description ?? "capabilities"} 
                        title={section.title?.includes('\n') ? 
                          section.title.split('\n').map((line, i) => (
                            <span key={i} style={i > 0 ? { color: 'rgba(0,0,0,0.3)' } : {}}>{line}{i < section.title!.split('\n').length - 1 && <br />}</span>
                          )) : section.title 
                        } 
                        sub={section.subtitle} 
                      />
                    </Reveal>
                    <Reveal delay={0.2}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                        {capabilityBlocks.map((block, idx) => (
                          <motion.div key={idx} 
                            whileHover={{ y: -4, boxShadow: '0 12px 32px -12px rgba(0,0,0,0.08)' }}
                            style={{ background: '#ffffff', padding: '2.5rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'rgba(0,0,0,0.04)' }} />
                            
                            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#FAFAFA', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <FaServer color="#111111" size={14} />
                            </div>
                            <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', fontWeight: 600, marginBottom: '1.5rem', fontFamily: FONT_MONO }}>{block.title}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                              {(block.technologies ?? []).map(item => (
                                <span key={item} style={{ fontSize: '1.05rem', color: '#111111', fontWeight: 500, fontFamily: FONT_DISPLAY, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                  <span style={{ width: '12px', height: '1px', background: 'rgba(0,0,0,0.15)' }} />
                                  {item}
                                </span>
                              ))}
                            </div>
                          </motion.div>
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
                  <section key={section.id ?? 'experience'} id="experience" style={{ padding: '8rem 3rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <Reveal>
                      <SectionHead 
                        label={section.description ?? "experience"} 
                        title={section.title?.includes('\n') ? 
                          section.title.split('\n').map((line, i) => (
                            <span key={i} style={i > 0 ? { color: 'rgba(0,0,0,0.3)' } : {}}>{line}{i < section.title!.split('\n').length - 1 && <br />}</span>
                          )) : section.title 
                        } 
                        sub={section.subtitle} 
                      />
                    </Reveal>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
                      {/* Vertical timeline line */}
                      <div style={{ position: 'absolute', top: '2rem', bottom: '2rem', left: '1.5rem', width: '1px', background: 'rgba(0,0,0,0.06)', zIndex: 0 }} className="hidden sm:block" />

                      {expItems.map((exp, i) => (
                        <Reveal key={i} delay={i * 0.1}>
                          <motion.div 
                            whileHover={{ x: 8 }}
                            style={{ padding: '3rem 0', paddingLeft: '4rem', display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', transition: 'all 0.3s ease', position: 'relative' }}>
                            
                            {/* Timeline dot */}
                            <div style={{ position: 'absolute', left: '1.25rem', top: '3.4rem', width: '9px', height: '9px', borderRadius: '50%', background: '#111111', border: '2px solid #FAFAFA', zIndex: 1 }} className="hidden sm:block" />

                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem' }}>
                              <div>
                                <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: '1.5rem', fontWeight: 700, color: '#111111', letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>{exp.role}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.5)', fontFamily: FONT_UI, fontWeight: 500, letterSpacing: '0.02em' }}>{exp.company}</p>
                              </div>
                              <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(0,0,0,0.4)', fontFamily: FONT_MONO, textTransform: 'uppercase', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', padding: '0.4rem 0.8rem', borderRadius: '4px' }}>
                                {exp.start} — {exp.end}
                              </p>
                            </div>
                            <p style={{ fontFamily: FONT_BODY, fontStyle: 'italic', fontSize: '1.1rem', lineHeight: 1.8, color: 'rgba(0,0,0,0.6)', maxWidth: '65ch', marginTop: '0.5rem' }}>{exp.description}</p>
                            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                              {(exp.tech ?? []).map(tag => (
                                <span key={tag} style={{ fontSize: '0.65rem', letterSpacing: '0.05em', padding: '0.3rem 0.8rem', background: '#ffffff', borderRadius: '4px', color: 'rgba(0,0,0,0.6)', fontFamily: FONT_MONO, border: '1px solid rgba(0,0,0,0.08)' }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        </Reveal>
                      ))}
                    </div>
                  </section>
                );

              case 'projects':
                const projectItems = (section.metadata?.items ?? []);
                return (
                  <section key={section.id ?? 'projects'} id="projects" style={{ padding: '8rem 3rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <Reveal>
                      <SectionHead 
                        label={section.description ?? "work"} 
                        title={section.title?.includes('\n') ? 
                          section.title.split('\n').map((line, i) => (
                            <span key={i} style={i > 0 ? { color: 'rgba(0,0,0,0.3)' } : {}}>{line}{i < section.title!.split('\n').length - 1 && <br />}</span>
                          )) : section.title 
                        } 
                        sub={section.subtitle} 
                      />
                    </Reveal>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                      {projectItems.map((proj, i) => (
                        <Reveal key={i} delay={i * 0.1}>
                          <motion.div
                            onHoverStart={() => setHoveredProject(i)}
                            onHoverEnd={() => setHoveredProject(null)}
                            whileHover={{ y: -6, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', borderColor: 'rgba(0,0,0,0.1)' }}
                            style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '8px', padding: '3rem 2.5rem', minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'pointer', position: 'relative' }}>
                            
                            {/* Accent line on hover */}
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', background: hoveredProject === i ? '#111111' : 'transparent', transition: 'all 0.3s ease', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} />

                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#FAFAFA', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FaTerminal color={hoveredProject === i ? '#111111' : 'rgba(0,0,0,0.3)'} size={12} style={{ transition: 'color 0.3s' }} />
                                  </div>
                                  <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: '1.25rem', fontWeight: 700, color: '#111111', letterSpacing: '-0.02em' }}>{proj.title}</h3>
                                </div>
                                <span style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.3rem 0.6rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', color: 'rgba(0,0,0,0.5)', fontFamily: FONT_MONO, whiteSpace: 'nowrap', background: '#FAFAFA' }}>
                                  {proj.status}
                                </span>
                              </div>
                              <p style={{ fontFamily: FONT_BODY, fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.7, color: 'rgba(0,0,0,0.55)', marginBottom: '2rem' }}>{proj.description}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              {(proj.tech ?? []).map(t => (
                                <span key={t} style={{ fontSize: '0.65rem', letterSpacing: '0.05em', padding: '0.3rem 0.7rem', background: '#FAFAFA', borderRadius: '4px', color: 'rgba(0,0,0,0.5)', fontFamily: FONT_MONO, border: '1px solid rgba(0,0,0,0.06)' }}>
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
                  <section key={section.id ?? 'contact'} id="contact" style={{ padding: '8rem 3rem 10rem' }}>
                    <Reveal>
                      <SectionHead 
                        label={section.description ?? "contact"} 
                        title={section.title?.includes('\n') ? 
                          section.title.split('\n').map((line, i) => (
                            <span key={i} style={i > 0 ? { color: 'rgba(0,0,0,0.3)' } : {}}>{line}{i < section.title!.split('\n').length - 1 && <br />}</span>
                          )) : section.title 
                        } 
                      />
                    </Reveal>
                    <Reveal delay={0.2}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '1000px' }}>
                        {contactItems.map((item, idx) => (
                          <motion.a key={idx} href={item.link ?? '#'} target={item.link?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                            whileHover={{ scale: 1.01, boxShadow: '0 8px 24px rgba(0,0,0,0.04)', borderColor: 'rgba(0,0,0,0.1)' }}
                            style={{ display: 'block', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '8px', padding: '2.5rem', textDecoration: 'none', transition: 'all 0.3s ease' }}>
                            <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', fontFamily: FONT_MONO, marginBottom: '0.8rem', fontWeight: 600 }}>{item.title}</p>
                            <p style={{ fontFamily: FONT_DISPLAY, fontSize: '1.1rem', color: '#111111', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              {item.subtitle} 
                              <FaArrowRight size={12} color="rgba(0,0,0,0.2)" />
                            </p>
                          </motion.a>
                        ))}
                      </div>
                    </Reveal>
                  </section>
                );

              default:
                return null;
            }
          })}
        </div>

        {/* ── Footer ── */}
        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          style={{ padding: '2rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid rgba(0,0,0,0.06)', background: '#ffffff' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {LINKS.map(({ id, label, href, icon: Icon }) => (
              <a key={id} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                style={{ color: 'rgba(0,0,0,0.4)', transition: 'all 0.3s ease', display: 'flex' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#111111'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(0,0,0,0.4)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                <Icon size={20} />
              </a>
            ))}
          </div>
          <a href="/creative"
            className="group"
            style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: FONT_UI, fontWeight: 600, transition: 'color 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#111111')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.4)')}>
            <span style={{ transition: 'transform 0.3s ease' }} className="group-hover:-translate-x-1">←</span> creative side
          </a>
        </motion.footer>
      </div>
    </motion.div>
  )
}
