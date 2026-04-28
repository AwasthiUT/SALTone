'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { CreativeMetadataItem, CreativeSection } from '@/lib/supabase/creative'

const PHOTO_STILLS = [
    { src: 'https://images.unsplash.com/photo-1516805361833-2194e803c035?q=80&w=2835&auto=format&fit=crop', label: 'Street' },
    { src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2875&auto=format&fit=crop', label: 'Landscape' },
    { src: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=2952&auto=format&fit=crop', label: 'Nature' },
    { src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2924&auto=format&fit=crop', label: 'Urban' },
    { src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=2874&auto=format&fit=crop', label: 'Water' },
]

const DEFAULT_SECTIONS: CreativeSection[] = [
    {
        section_key: 'who-i-am',
        section_type: 'stats',
        title: 'I write code.\nI direct films.\nI freeze moments.',
        subtitle: '— identity',
        description: null,
        link: null,
        cta_text: null,
        cta_link: null,
        background_url: null,
        position: 1,
        metadata: {
            points: [
                { text: 'Medium', value: 'Film & Code', is_active: true },
                { text: 'Based in', value: 'India', is_active: true },
                { text: 'Since', value: '2018', is_active: true },
                { text: 'Philosophy', value: 'Make everything.', is_active: true },
            ],
        },
    },
    {
        section_key: 'cinema',
        section_type: 'media',
        title: 'Directed by Utkarsh.',
        subtitle: 'Films written, directed, and cut by hand. Every frame deliberate. Every story personal.',
        description: null,
        link: '— creative diary / cinema',
        cta_text: 'Enter the Cinema',
        cta_link: '/movies',
        background_url: null,
        position: 2,
        metadata: {
            images: [
                { url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2918&auto=format&fit=crop', is_active: true },
                { url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2940&auto=format&fit=crop', is_active: true },
                { url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2925&auto=format&fit=crop', is_active: true },
                { url: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=2831&auto=format&fit=crop', is_active: true },
            ],
        },
    },
    {
        section_key: 'photography',
        section_type: 'photos',
        title: null,
        subtitle: null,
        description: null,
        link: null,
        cta_text: null,
        cta_link: null,
        background_url: null,
        position: 3,
        metadata: null,
    },
    {
        section_key: 'the-archive',
        section_type: 'grid',
        title: 'Every year. Every story.',
        subtitle: '— the archive / years',
        description: '2018 to now. An unbroken thread of photographs, memories, and lived experience.',
        link: null,
        cta_text: null,
        cta_link: null,
        background_url: null,
        position: 4,
        metadata: {
            items: [
                { title: '2024', image: 'https://images.unsplash.com/photo-1493225457224-811c7da2af61?q=80&w=2890&auto=format&fit=crop', link: '/years/2024', is_active: true },
                { title: '2023', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', link: '/years/2023', is_active: true },
                { title: '2022', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2940&auto=format&fit=crop', link: '#', is_active: true },
                { title: '2021', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2948&auto=format&fit=crop', link: '#', is_active: true },
                { title: '2020', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop', link: '#', is_active: true },
                { title: '2019', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2940&auto=format&fit=crop', link: '#', is_active: true },
                { title: '2018', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=2835&auto=format&fit=crop', link: '#', is_active: true },
            ],
        },
    },
    {
        section_key: 'manifesto',
        section_type: 'quote',
        title: 'The best work happens when you stop separating who you are from what you make.',
        subtitle: null,
        description: null,
        link: null,
        cta_text: null,
        cta_link: null,
        background_url: null,
        position: 5,
        metadata: null,
    },
    {
        section_key: 'connect',
        section_type: 'composite',
        title: '— find me',
        subtitle: null,
        description: null,
        link: null,
        cta_text: null,
        cta_link: null,
        background_url: null,
        position: 6,
        metadata: {
            blocks: [
                { title: 'YouTube', subtitle: '@Yousaidut', link: 'https://www.youtube.com/@Yousaidut', description: 'Films & creative work', is_active: true },
                { title: 'Instagram', subtitle: '@ut_awasthi', link: 'https://www.instagram.com/ut_awasthi/', description: 'Daily frames & stills', is_active: true },
                { title: 'LinkedIn', subtitle: 'Utkarsh Awasthi', link: 'https://www.linkedin.com/in/utkarsh-awasthi-b35917231/', description: 'Professional side', is_active: true },
                { title: 'The Tech Side', subtitle: '→ /work', link: '/work', description: 'Code, systems & engineering', is_active: true },
            ],
        },
    },
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

function activeItems<T extends { is_active?: boolean | null }>(items?: T[]) {
    return (items ?? []).filter((item) => item.is_active !== false)
}

function titleParts(title: string | null, fallback: string) {
    const source = title ?? fallback
    if (source.includes('\n')) return source.split('\n').filter(Boolean)
    return source.split(/ (?=[^ ]+$)/).filter(Boolean)
}

function sentenceParts(title: string | null, fallback: string) {
    const source = title ?? fallback
    if (source.includes('\n')) return source.split('\n').filter(Boolean)
    const match = source.match(/^(.+?\.)\s+(.+)$/)
    return match ? [match[1], match[2]] : [source]
}

function itemHref(item: CreativeMetadataItem) {
    return item.link ?? item.href ?? '#'
}

function itemImage(item: CreativeMetadataItem) {
    return item.image ?? item.url ?? item.src ?? ''
}

function renderStatsSection(section: CreativeSection) {
    const points = activeItems(section.metadata?.points)
    const lines = sentenceParts(section.title, 'I write code.\nI direct films.\nI freeze moments.')

    return (
        <section id={section.section_key} className="w-full px-6 sm:px-16 py-28 sm:py-40 max-w-[1600px] mx-auto">
            <RevealSection>
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-white/25 mb-10" style={{ fontFamily: 'HelveticaBold' }}>
                    {section.subtitle ?? '— identity'}
                </p>
                <h2
                    className="text-5xl sm:text-7xl lg:text-[8rem] xl:text-[10rem] leading-[0.92] tracking-tight text-white mb-12"
                    style={{ fontFamily: 'HelveticaBold', letterSpacing: '-0.04em' }}
                >
                    {lines.map((line, index) => (
                        <span key={`${line}-${index}`} className={index === 1 ? 'text-white/30' : index > 1 ? 'text-white/15' : undefined}>
                            {index > 0 && <br />}
                            {line}
                        </span>
                    ))}
                </h2>
                <div className="flex flex-col sm:flex-row gap-8 sm:gap-24 mt-16 border-t border-white/8 pt-12">
                    {points.map((point) => (
                        <div key={point.text ?? point.title ?? point.value}>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-white/25 mb-2" style={{ fontFamily: 'HelveticaBold' }}>{point.text ?? point.title}</p>
                            <p className="text-lg sm:text-xl text-white/70" style={{ fontFamily: 'HelveticaBold' }}>{point.value}</p>
                        </div>
                    ))}
                </div>
            </RevealSection>
        </section>
    )
}

function MediaSection({ section }: { section: CreativeSection }) {
    const images = activeItems(section.metadata?.images).map((image) => itemImage(image)).filter(Boolean)
    const [filmIdx, setFilmIdx] = useState(0)
    const parts = titleParts(section.title, 'Directed by Utkarsh.')

    useEffect(() => {
        if (images.length === 0) return
        const t = setInterval(() => setFilmIdx(i => (i + 1) % images.length), 3500)
        return () => clearInterval(t)
    }, [images.length])

    return (
        <section id={section.section_key} className="relative w-full overflow-hidden" style={{ minHeight: '100vh' }}>
            <AnimatePresence mode="wait">
                {images[filmIdx] && (
                    <motion.div
                        key={filmIdx}
                        initial={{ opacity: 0, scale: 1.06 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: 'easeInOut' }}
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url(${images[filmIdx]})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                )}
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/70 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

            <div className="relative z-10 flex flex-col justify-end h-full min-h-screen px-6 sm:px-16 pb-20 sm:pb-32 pt-32 max-w-[1600px] mx-auto">
                <RevealSection>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-white/40 mb-6" style={{ fontFamily: 'HelveticaBold' }}>
                        {section.link ?? '— creative diary / cinema'}
                    </p>
                    <h2
                        className="text-6xl sm:text-8xl lg:text-[9rem] leading-[0.9] text-white mb-8"
                        style={{ fontFamily: 'HelveticaBold', letterSpacing: '-0.04em' }}
                    >
                        {parts[0]}<br />
                        {parts[1] && <span className="text-white/40">{parts.slice(1).join(' ')}</span>}
                    </h2>
                    <p className="text-lg sm:text-2xl text-white/50 max-w-xl mb-12 leading-relaxed" style={{ fontFamily: 'GlacialIndifferenceItalic' }}>
                        {section.subtitle}
                    </p>

                    <div className="flex gap-3 mb-12 overflow-x-auto pb-2 scrollbar-hide">
                        {images.map((src, i) => (
                            <motion.div
                                key={src}
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

                    <Link href={section.cta_link ?? '#'}>
                        <motion.div
                            className="inline-flex items-center gap-4 group"
                            whileHover={{ x: 8 }}
                            transition={{ duration: 0.3 }}
                        >
                            <span
                                className="text-sm sm:text-base uppercase tracking-[0.25em] text-white border-b border-white/30 pb-0.5 group-hover:border-white transition-colors duration-300"
                                style={{ fontFamily: 'HelveticaBold' }}
                            >
                                {section.cta_text}
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
    )
}

function renderPhotosSection(section: CreativeSection) {
    return (
        <section id={section.section_key} className="w-full px-6 sm:px-16 py-28 sm:py-40 max-w-[1600px] mx-auto">
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
    )
}

function GridSection({ section }: { section: CreativeSection }) {
    const [activeYear, setActiveYear] = useState<string | null>(null)
    const items = activeItems(section.metadata?.items)
    const lines = sentenceParts(section.title, 'Every year. Every story.')

    return (
        <section id={section.section_key} className="w-full py-28 sm:py-40 overflow-hidden">
            <div className="px-6 sm:px-16 max-w-[1600px] mx-auto mb-16">
                <RevealSection>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-white/25 mb-4" style={{ fontFamily: 'HelveticaBold' }}>
                        {section.subtitle ?? '— the archive / years'}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <h2
                            className="text-5xl sm:text-7xl lg:text-[7rem] text-white leading-[0.92]"
                            style={{ fontFamily: 'HelveticaBold', letterSpacing: '-0.04em' }}
                        >
                            {lines[0]}<br />
                            {lines[1] && <span className="text-white/25">{lines.slice(1).join(' ')}</span>}
                        </h2>
                        <p className="text-base sm:text-lg text-white/35 max-w-sm" style={{ fontFamily: 'GlacialIndifferenceItalic' }}>
                            {section.description}
                        </p>
                    </div>
                </RevealSection>
            </div>

            <div className="px-6 sm:px-16 max-w-[1600px] mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
                    {items.map((item, i) => {
                        const title = item.title ?? ''
                        const href = itemHref(item)

                        return (
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.1 }}
                                transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                onMouseEnter={() => setActiveYear(title)}
                                onMouseLeave={() => setActiveYear(null)}
                            >
                                <Link href={href}>
                                    <div className="relative group overflow-hidden cursor-pointer" style={{ aspectRatio: '2/3' }}>
                                        <img
                                            src={itemImage(item)}
                                            alt={title}
                                            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                        <motion.div
                                            className="absolute inset-0 border border-white/0 group-hover:border-white/40 transition-colors duration-500"
                                        />

                                        <div className="absolute inset-x-0 bottom-0 p-4">
                                            <p
                                                className="text-3xl sm:text-4xl text-white leading-none mb-1"
                                                style={{ fontFamily: 'HelveticaBold', letterSpacing: '-0.03em' }}
                                            >
                                                {title}
                                            </p>
                                            <motion.p
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={activeYear === title ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                                                transition={{ duration: 0.3 }}
                                                className="text-[10px] text-white/60 uppercase tracking-[0.15em]"
                                                style={{ fontFamily: 'HelveticaBold' }}
                                            >
                                                {href === '#' ? 'coming soon' : 'enter →'}
                                            </motion.p>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

function renderQuoteSection(section: CreativeSection) {
    return (
        <section id={section.section_key} className="relative w-full min-h-[80vh] flex items-center justify-center px-6 sm:px-16 py-40 overflow-hidden">
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
                    &ldquo;{section.title}&rdquo;
                </blockquote>

                <p className="text-xs uppercase tracking-[0.4em] text-white/25" style={{ fontFamily: 'HelveticaBold' }}>
                    — Utkarsh Awasthi
                </p>
            </RevealSection>
        </section>
    )
}

function renderCompositeSection(section: CreativeSection) {
    const blocks = activeItems(section.metadata?.blocks)

    return (
        <section id={section.section_key} className="w-full px-6 sm:px-16 py-28 sm:py-40 max-w-[1600px] mx-auto">
            <RevealSection>
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/25 mb-8" style={{ fontFamily: 'HelveticaBold' }}>
                    {section.title}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {blocks.map((block, i) => {
                        const href = itemHref(block)

                        return (
                            <motion.a
                                key={block.title ?? i}
                                href={href}
                                target={href.startsWith('http') ? '_blank' : undefined}
                                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                whileHover={{ y: -4 }}
                                className="group block p-6 sm:p-8 border border-white/8 hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-400 cursor-pointer no-underline"
                                style={{ textDecoration: 'none' }}
                            >
                                <p className="text-[10px] uppercase tracking-[0.3em] text-white/25 mb-4 group-hover:text-white/40 transition-colors" style={{ fontFamily: 'HelveticaBold' }}>
                                    {block.title}
                                </p>
                                <p className="text-xl sm:text-2xl text-white/80 mb-2 group-hover:text-white transition-colors" style={{ fontFamily: 'HelveticaBold' }}>
                                    {block.subtitle}
                                </p>
                                <p className="text-sm text-white/30 group-hover:text-white/50 transition-colors" style={{ fontFamily: 'GlacialIndifferenceItalic' }}>
                                    {block.description}
                                </p>
                            </motion.a>
                        )
                    })}
                </div>
            </RevealSection>
        </section>
    )
}

function renderSection(section: CreativeSection) {
    console.log("Rendering section:", section.section_key)

    switch (section.section_type) {
        case 'stats':
            return renderStatsSection(section)
        case 'media':
            return <MediaSection section={section} />
        case 'photos':
            return renderPhotosSection(section)
        case 'grid':
            return <GridSection section={section} />
        case 'quote':
            return renderQuoteSection(section)
        case 'composite':
            return renderCompositeSection(section)
        default:
            return null
    }
}

export default function CreativeSections({ sections }: { sections?: CreativeSection[] }) {
    const marqueeItems = ['Cinema', 'Photography', 'Direction', 'Editing', 'Frames', 'Stories', 'Archives', 'Moments', 'Craft']
    const archiveMarqueeItems = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', 'Still going', 'Never done']
    const renderedSections = sections ?? DEFAULT_SECTIONS

    return (
        <div className="relative z-10 bg-[#080808]">
            <Marquee items={marqueeItems} />

            {renderedSections.map((section) => (
                <div key={section.section_key}>
                    {section.section_type === 'quote' && <Marquee items={archiveMarqueeItems} />}
                    {renderSection(section)}
                </div>
            ))}

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
