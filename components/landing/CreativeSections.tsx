'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Data ──────────────────────────────────────────

const ALL_YEARS = [
    { year: '2024', tagline: 'Another year, another story', image: 'https://images.unsplash.com/photo-1493225457224-811c7da2af61?q=80&w=2890&auto=format&fit=crop', href: '/years/2024' },
    { year: '2023', tagline: 'A year told through photographs', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', href: '/years/2023' },
    { year: '2022', tagline: 'Learning to see the world differently', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2940&auto=format&fit=crop', href: '#' },
    { year: '2021', tagline: 'The year everything slowed down', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2948&auto=format&fit=crop', href: '#' },
    { year: '2020', tagline: 'Stillness and what it taught me', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop', href: '#' },
    { year: '2019', tagline: 'Before everything changed', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2940&auto=format&fit=crop', href: '#' },
    { year: '2018', tagline: 'Where it all began', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=2835&auto=format&fit=crop', href: '#' },
]

const FILM_STILLS = [
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2918&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2940&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2925&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=2831&auto=format&fit=crop',
]

const PHOTO_STILLS = [
    { src: 'https://images.unsplash.com/photo-1516805361833-2194e803c035?q=80&w=2835&auto=format&fit=crop', label: 'Street' },
    { src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2875&auto=format&fit=crop', label: 'Landscape' },
    { src: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=2952&auto=format&fit=crop', label: 'Nature' },
    { src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2924&auto=format&fit=crop', label: 'Urban' },
    { src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=2874&auto=format&fit=crop', label: 'Water' },
]

// ─── Scroll-triggered Section Wrapper ──────────────

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
            { threshold: 0.08 }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// ─── Horizontal scroll marquee ──────────────────────

function Marquee({ items }: { items: string[] }) {
    return (
        <div className="overflow-hidden w-full py-3 border-y border-white/8">
            <motion.div
                className="flex gap-12 whitespace-nowrap"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
            >
                {[...items, ...items].map((item, i) => (
                    <span key={i} className="text-white/15 text-xs uppercase tracking-[0.35em]" style={{ fontFamily: 'HelveticaBold' }}>
                        {item}
                    </span>
                ))}
            </motion.div>
        </div>
    )
}

// ─── Main Component ────────────────────────────────

export default function CreativeSections() {
    const [activeYear, setActiveYear] = useState<string | null>(null)
    const [filmIdx, setFilmIdx] = useState(0)

    // cycle film stills
    useEffect(() => {
        const t = setInterval(() => setFilmIdx(i => (i + 1) % FILM_STILLS.length), 3500)
        return () => clearInterval(t)
    }, [])

    const marqueeItems = ['Cinema', 'Photography', 'Direction', 'Editing', 'Frames', 'Stories', 'Archives', 'Moments', 'Craft']

    return (
        <div className="relative z-10 bg-[#080808]">

            {/* ── MARQUEE DIVIDER ── */}
            <Marquee items={marqueeItems} />

            {/* ══════════════════════════════════════════
          WHO I AM — Full bleed statement
      ══════════════════════════════════════════ */}
            <section id="who-i-am" className="w-full px-6 sm:px-16 py-28 sm:py-40 max-w-[1600px] mx-auto">
                <RevealSection>
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-white/25 mb-10" style={{ fontFamily: 'HelveticaBold' }}>
                        — identity
                    </p>
                    <h2
                        className="text-5xl sm:text-7xl lg:text-[8rem] xl:text-[10rem] leading-[0.92] tracking-tight text-white mb-12"
                        style={{ fontFamily: 'HelveticaBold', letterSpacing: '-0.04em' }}
                    >
                        I write code.<br />
                        <span className="text-white/30">I direct films.</span><br />
                        <span className="text-white/15">I freeze moments.</span>
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-8 sm:gap-24 mt-16 border-t border-white/8 pt-12">
                        {[
                            { label: 'Medium', value: 'Film & Code' },
                            { label: 'Based in', value: 'India' },
                            { label: 'Since', value: '2018' },
                            { label: 'Philosophy', value: 'Make everything.' },
                        ].map(({ label, value }) => (
                            <div key={label}>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-white/25 mb-2" style={{ fontFamily: 'HelveticaBold' }}>{label}</p>
                                <p className="text-lg sm:text-xl text-white/70" style={{ fontFamily: 'HelveticaBold' }}>{value}</p>
                            </div>
                        ))}
                    </div>
                </RevealSection>
            </section>

            {/* ══════════════════════════════════════════
          CINEMA — Full bleed with cycling stills
      ══════════════════════════════════════════ */}
            <section id="cinema" className="relative w-full overflow-hidden" style={{ minHeight: '100vh' }}>
                {/* Background cycling still */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={filmIdx}
                        initial={{ opacity: 0, scale: 1.06 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: 'easeInOut' }}
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url(${FILM_STILLS[filmIdx]})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                </AnimatePresence>

                {/* Deep gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/70 to-black/40" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-end h-full min-h-screen px-6 sm:px-16 pb-20 sm:pb-32 pt-32 max-w-[1600px] mx-auto">
                    <RevealSection>
                        <p className="text-[10px] uppercase tracking-[0.35em] text-white/40 mb-6" style={{ fontFamily: 'HelveticaBold' }}>
                            — creative diary / cinema
                        </p>
                        <h2
                            className="text-6xl sm:text-8xl lg:text-[9rem] leading-[0.9] text-white mb-8"
                            style={{ fontFamily: 'HelveticaBold', letterSpacing: '-0.04em' }}
                        >
                            Directed<br />
                            <span className="text-white/40">by Utkarsh.</span>
                        </h2>
                        <p className="text-lg sm:text-2xl text-white/50 max-w-xl mb-12 leading-relaxed" style={{ fontFamily: 'GlacialIndifferenceItalic' }}>
                            Films written, directed, and cut by hand. Every frame deliberate. Every story personal.
                        </p>

                        {/* Film strip */}
                        <div className="flex gap-3 mb-12 overflow-x-auto pb-2 scrollbar-hide">
                            {FILM_STILLS.map((src, i) => (
                                <motion.div
                                    key={i}
                                    className="flex-shrink-0 h-20 w-32 sm:h-28 sm:w-48 overflow-hidden cursor-pointer"
                                    style={{ opacity: i === filmIdx ? 1 : 0.35 }}
                                    whileHover={{ opacity: 0.8, scale: 1.03 }}
                                    onClick={() => setFilmIdx(i)}
                                    transition={{ duration: 0.2 }}
                                >
                                    <img src={src} alt="" className="w-full h-full object-cover" />
                                </motion.div>
                            ))}
                        </div>

                        <Link href="/movies">
                            <motion.div
                                className="inline-flex items-center gap-4 group"
                                whileHover={{ x: 8 }}
                                transition={{ duration: 0.3 }}
                            >
                                <span
                                    className="text-sm sm:text-base uppercase tracking-[0.25em] text-white border-b border-white/30 pb-0.5 group-hover:border-white transition-colors duration-300"
                                    style={{ fontFamily: 'HelveticaBold' }}
                                >
                                    Enter the Cinema
                                </span>
                                <motion.span
                                    animate={{ x: [0, 6, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.8 }}
                                    className="text-white text-lg"
                                >
                                    →
                                </motion.span>
                            </motion.div>
                        </Link>
                    </RevealSection>
                </div>
            </section>

            {/* ══════════════════════════════════════════
          PHOTOGRAPHY — Masonry-style staggered grid
      ══════════════════════════════════════════ */}
            <section id="photography" className="w-full px-6 sm:px-16 py-28 sm:py-40 max-w-[1600px] mx-auto">
                <RevealSection>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.35em] text-white/25 mb-4" style={{ fontFamily: 'HelveticaBold' }}>
                                — creative diary / stills
                            </p>
                            <h2
                                className="text-5xl sm:text-7xl lg:text-[7rem] text-white leading-[0.92]"
                                style={{ fontFamily: 'HelveticaBold', letterSpacing: '-0.04em' }}
                            >
                                Photographs.
                            </h2>
                        </div>
                        <p className="text-base sm:text-lg text-white/35 max-w-sm" style={{ fontFamily: 'GlacialIndifferenceItalic' }}>
                            Moments frozen before they disappear. A personal catalogue of what I chose to notice.
                        </p>
                    </div>
                </RevealSection>

                {/* Photo grid — staggered */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                    {PHOTO_STILLS.map((photo, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ scale: 1.03, zIndex: 10 }}
                            className={`relative group overflow-hidden cursor-pointer ${i === 0 ? 'col-span-2 row-span-2 sm:col-span-2' : ''}`}
                            style={{ aspectRatio: i === 0 ? '1/1' : '3/4' }}
                        >
                            <img
                                src={photo.src}
                                alt={photo.label}
                                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                                <span className="text-white/80 text-xs uppercase tracking-[0.2em]" style={{ fontFamily: 'HelveticaBold' }}>
                                    {photo.label}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <RevealSection className="mt-12">
                    <div className="flex items-center gap-4 opacity-40">
                        <div className="flex-1 h-px bg-white/20" />
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50" style={{ fontFamily: 'HelveticaBold' }}>
                            Gallery coming soon
                        </p>
                        <div className="flex-1 h-px bg-white/20" />
                    </div>
                </RevealSection>
            </section>

            {/* ══════════════════════════════════════════
          THE ARCHIVES — All years, big & bold
      ══════════════════════════════════════════ */}
            <section id="the-archive" className="w-full py-28 sm:py-40 overflow-hidden">
                <div className="px-6 sm:px-16 max-w-[1600px] mx-auto mb-16">
                    <RevealSection>
                        <p className="text-[10px] uppercase tracking-[0.35em] text-white/25 mb-4" style={{ fontFamily: 'HelveticaBold' }}>
                            — the archive / years
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                            <h2
                                className="text-5xl sm:text-7xl lg:text-[7rem] text-white leading-[0.92]"
                                style={{ fontFamily: 'HelveticaBold', letterSpacing: '-0.04em' }}
                            >
                                Every year.<br />
                                <span className="text-white/25">Every story.</span>
                            </h2>
                            <p className="text-base sm:text-lg text-white/35 max-w-sm" style={{ fontFamily: 'GlacialIndifferenceItalic' }}>
                                2018 to now. An unbroken thread of photographs, memories, and lived experience.
                            </p>
                        </div>
                    </RevealSection>
                </div>

                {/* Years — large horizontal scroll on mobile, grid on desktop */}
                <div className="px-6 sm:px-16 max-w-[1600px] mx-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
                        {ALL_YEARS.map((item, i) => (
                            <motion.div
                                key={item.year}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.1 }}
                                transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                onMouseEnter={() => setActiveYear(item.year)}
                                onMouseLeave={() => setActiveYear(null)}
                            >
                                <Link href={item.href}>
                                    <div className="relative group overflow-hidden cursor-pointer" style={{ aspectRatio: '2/3' }}>
                                        {/* Image */}
                                        <img
                                            src={item.image}
                                            alt={item.year}
                                            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                        />

                                        {/* Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                        {/* Active border ring */}
                                        <motion.div
                                            className="absolute inset-0 border border-white/0 group-hover:border-white/40 transition-colors duration-500"
                                        />

                                        {/* Year label */}
                                        <div className="absolute inset-x-0 bottom-0 p-4">
                                            <p
                                                className="text-3xl sm:text-4xl text-white leading-none mb-1"
                                                style={{ fontFamily: 'HelveticaBold', letterSpacing: '-0.03em' }}
                                            >
                                                {item.year}
                                            </p>
                                            <motion.p
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={activeYear === item.year ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                                                transition={{ duration: 0.3 }}
                                                className="text-[10px] text-white/60 uppercase tracking-[0.15em]"
                                                style={{ fontFamily: 'HelveticaBold' }}
                                            >
                                                {item.href === '#' ? 'coming soon' : 'enter →'}
                                            </motion.p>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Marquee divider */}
            <Marquee items={['2018', '2019', '2020', '2021', '2022', '2023', '2024', 'Still going', 'Never done']} />

            {/* ══════════════════════════════════════════
          MANIFESTO — Full screen quote
      ══════════════════════════════════════════ */}
            <section id="manifesto" className="relative w-full min-h-[80vh] flex items-center justify-center px-6 sm:px-16 py-40 overflow-hidden">
                {/* Subtle background texture */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        backgroundSize: '128px 128px',
                    }}
                />

                <RevealSection className="max-w-5xl mx-auto text-center">
                    <motion.div
                        className="text-5xl sm:text-6xl mb-10 opacity-20"
                        animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
                    >
                        ✦
                    </motion.div>

                    <blockquote
                        className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl text-white/80 italic leading-[1.15] mb-12"
                        style={{ fontFamily: 'CormorantGaramondNormal' }}
                    >
                        &ldquo;The best work happens when you stop separating who you are from what you make.&rdquo;
                    </blockquote>

                    <p className="text-xs uppercase tracking-[0.4em] text-white/25" style={{ fontFamily: 'HelveticaBold' }}>
                        — Utkarsh Awasthi
                    </p>
                </RevealSection>
            </section>

            {/* ══════════════════════════════════════════
          SOCIALS / CONNECT
      ══════════════════════════════════════════ */}
            <section id="connect" className="w-full px-6 sm:px-16 py-28 sm:py-40 max-w-[1600px] mx-auto">
                <RevealSection>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-white/25 mb-8" style={{ fontFamily: 'HelveticaBold' }}>
                        — find me
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                            { label: 'YouTube', handle: '@Yousaidut', href: 'https://www.youtube.com/@Yousaidut', desc: 'Films & creative work' },
                            { label: 'Instagram', handle: '@ut_awasthi', href: 'https://www.instagram.com/ut_awasthi/', desc: 'Daily frames & stills' },
                            { label: 'LinkedIn', handle: 'Utkarsh Awasthi', href: 'https://www.linkedin.com/in/utkarsh-awasthi-b35917231/', desc: 'Professional side' },
                            { label: 'The Tech Side', handle: '→ /work', href: '/work', desc: 'Code, systems & engineering' },
                        ].map((link, i) => (
                            <motion.a
                                key={link.label}
                                href={link.href}
                                target={link.href.startsWith('http') ? '_blank' : undefined}
                                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                whileHover={{ y: -4 }}
                                className="group block p-6 sm:p-8 border border-white/8 hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-400 cursor-pointer no-underline"
                                style={{ textDecoration: 'none' }}
                            >
                                <p className="text-[10px] uppercase tracking-[0.3em] text-white/25 mb-4 group-hover:text-white/40 transition-colors" style={{ fontFamily: 'HelveticaBold' }}>
                                    {link.label}
                                </p>
                                <p className="text-xl sm:text-2xl text-white/80 mb-2 group-hover:text-white transition-colors" style={{ fontFamily: 'HelveticaBold' }}>
                                    {link.handle}
                                </p>
                                <p className="text-sm text-white/30 group-hover:text-white/50 transition-colors" style={{ fontFamily: 'GlacialIndifferenceItalic' }}>
                                    {link.desc}
                                </p>
                            </motion.a>
                        ))}
                    </div>
                </RevealSection>
            </section>

            {/* ══════════════════════════════════════════
          END / FOOTER
      ══════════════════════════════════════════ */}
            <div className="w-full border-t border-white/8 px-6 sm:px-16 py-12 max-w-[1600px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <p className="text-xs text-white/15 uppercase tracking-[0.2em]" style={{ fontFamily: 'HelveticaBold' }}>
                    Utkarsh Awasthi — Creative World
                </p>
                <p className="text-xs text-white/10 uppercase tracking-[0.15em]" style={{ fontFamily: 'HelveticaBold' }}>
                    2018 — {new Date().getFullYear()}
                </p>
            </div>

        </div>
    )
}
