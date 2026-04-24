'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaLinkedin, FaGithub, FaInstagram, FaYoutube } from 'react-icons/fa'

const FONT_DISPLAY = '"HelveticaBold", "Helvetica Neue", Helvetica, Arial, sans-serif'
const FONT_UI = '"Helvetica Neue", Helvetica, Arial, sans-serif'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } },
}

const SKILLS: { label: string; items: string[] }[] = [
  { label: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'CSS / Animation'] },
  { label: 'Backend', items: ['Node.js', 'Java', 'Spring Boot', 'REST APIs'] },
  { label: 'Data & Infra', items: ['PostgreSQL', 'Supabase', 'Docker', 'Vercel'] },
  { label: 'Design & Tools', items: ['Figma', 'Framer Motion', 'Git', 'UI Systems'] },
]

const LINKS = [
  { id: 'work-linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/utkarsh-awasthi-b35917231/', icon: FaLinkedin },
  { id: 'work-youtube', label: 'YouTube', href: 'https://www.youtube.com/@Yousaidut', icon: FaYoutube },
  { id: 'work-instagram', label: 'Instagram', href: 'https://www.instagram.com/ut_awasthi/', icon: FaInstagram },
]

export default function WorkContent({ onBack }: { onBack?: () => void }) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) onBack()
    else router.back()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        width: '100%',
      }}
    >
      {/* ── Nav ── */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.75rem 2.5rem',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
        }}
      >
        <button
          onClick={handleBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(0,0,0,0.35)', fontSize: '0.7rem',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            fontFamily: FONT_UI, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            transition: 'color 0.2s ease', padding: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(0,0,0,0.8)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(0,0,0,0.35)')}
        >
          ← back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.6)', fontWeight: 500,
            background: 'rgba(0,0,0,0.05)',
            padding: '0.3rem 0.75rem', borderRadius: '999px',
            border: '1px solid rgba(0,0,0,0.1)',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 0 2px rgba(34,197,94,0.25)',
              display: 'inline-block',
            }} />
            available
          </span>
          <span style={{
            fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.28)', fontWeight: 500,
          }}>
            technical world
          </span>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <motion.header
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
        style={{ padding: '3.5rem 2.5rem 2.5rem' }}
      >
        <p style={{
          fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.3)', fontWeight: 500, marginBottom: '1.2rem',
        }}>
          Utkarsh Awasthi
        </p>
        <h1 style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
          fontWeight: 700,
          lineHeight: 1.0,
          letterSpacing: '-0.03em',
          color: '#0d0d0d',
          margin: '0 0 1.4rem',
        }}>
          I build things<br />that ship.
        </h1>
        <p style={{
          fontSize: '1rem',
          lineHeight: 1.75,
          color: 'rgba(0,0,0,0.48)',
          maxWidth: '46ch',
        }}>
          Full-stack engineer. I design systems, write production code, and care about
          the details that make software feel right. Currently open to new work.
        </p>
      </motion.header>

      {/* ── Divider ── */}
      <div style={{ height: '1px', background: 'rgba(0,0,0,0.07)', margin: '0 2.5rem' }} />

      {/* ── Skills grid ── */}
      <section style={{ padding: '3rem 2.5rem', flex: 1 }} aria-label="Skills">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.3)', fontWeight: 500, marginBottom: '2rem',
          }}
        >
          Stack
        </motion.p>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1px',
            background: 'rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          {SKILLS.map(({ label, items }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              style={{
                background: '#f9f9f7',
                padding: '1.75rem',
              }}
            >
              <p style={{
                fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'rgba(0,0,0,0.35)', fontWeight: 600, marginBottom: '1rem',
                fontFamily: FONT_UI,
              }}>
                {label}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {items.map((item) => (
                  <span
                    key={item}
                    style={{
                      fontSize: '0.92rem',
                      color: 'rgba(0,0,0,0.75)',
                      fontWeight: 500,
                      fontFamily: FONT_DISPLAY,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div style={{ height: '1px', background: 'rgba(0,0,0,0.07)', margin: '0 2.5rem' }} />

      {/* ── Footer ── */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{
          padding: '1.75rem 2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {LINKS.map(({ id, label, href, icon: Icon }) => (
            <a
              key={id}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              style={{
                color: 'rgba(0,0,0,0.3)',
                transition: 'color 0.2s ease',
                display: 'flex',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(0,0,0,0.8)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(0,0,0,0.3)')}
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        <a
          href="/creative"
          style={{
            fontSize: '0.65rem', color: 'rgba(0,0,0,0.28)',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            textDecoration: 'none', fontFamily: FONT_UI, fontWeight: 500,
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(0,0,0,0.65)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(0,0,0,0.28)')}
        >
          ← creative side
        </a>
      </motion.footer>
    </motion.div>
  )
}
