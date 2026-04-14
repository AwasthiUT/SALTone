'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa'

// Shared types
type YearData = {
  id: number
  year: number
  tagline: string
  cover_image: string
  year_stamp_present: boolean
}

type Event = {
  id: number
  year_id: number
  title: string
  description: string
  cover_image: string
  order: number
  is_major: boolean
  parent_id: number | null
  has_gallery: boolean
  gallery: string[]
  is_active: boolean
}

type Props = {
  yearData: YearData
  events: Event[]
}

type LayoutEvent = Event & { col: number; row: number }

const COL_TIERS = [
  { col: 6, weight: 5 }, // LARGE   ~50% wide
  { col: 4, weight: 15 }, // MEDIUM  ~33% wide
  { col: 3, weight: 35 }, // SMALL   ~25% wide
  { col: 2, weight: 45 }, // TINY    ~17% wide
]
const totalTierWeight = COL_TIERS.reduce((a, b) => a + b.weight, 0)

const pickColSpan = () => {
  let r = Math.random() * totalTierWeight
  for (const t of COL_TIERS) {
    r -= t.weight
    if (r <= 0) return t.col
  }
  return 3
}

// Math: each col unit = 100vw/12 ≈ 8.333vw, each row unit = 5vw
// To match an image's aspect ratio: rowSpan = colSpan × (8.333/5) / aspectRatio
// = colSpan × 1.667 / aspectRatio
const COL_TO_ROW_FACTOR = (100 / 12) / 5 // ≈ 1.667

// InnerGallery sits inside a ~2/3 viewport container.
// col unit = (66.7vw / 12), row unit = 3.3vw
// factor = (66.7/12) / 3.3 ≈ 1.685 — keeps aspect ratio correct inside modal
const INNER_COL_TO_ROW_FACTOR = (66.7 / 12) / 3.3

function InnerGallery({ event }: { event: LayoutEvent }) {
  const [galleryItems, setGalleryItems] = useState<{ src: string; col: number; row: number }[]>([])

  useEffect(() => {
    if (!event.has_gallery || !event.gallery || event.gallery.length === 0) return

    const load = async () => {
      const res = await Promise.all(event.gallery.map(src => new Promise<any>((resolve) => {
        const cSpan = pickColSpan()
        const img = new window.Image()
        img.onload = () => {
          const aspect = img.naturalWidth / img.naturalHeight
          // Use INNER factor (2/3 container) so tall images get enough rows — no cropping
          let rSpan = Math.round(cSpan * INNER_COL_TO_ROW_FACTOR / aspect)
          rSpan = Math.max(1, Math.min(rSpan, 16))
          resolve({ src, col: cSpan, row: rSpan })
        }
        img.onerror = () => resolve({ src, col: cSpan, row: 3 })
        img.src = src
      })))
      setGalleryItems(res)
    }
    load()
  }, [event.gallery, event.has_gallery])

  return (
    <div className="w-full grid grid-cols-12 grid-flow-dense gap-2" style={{ gridAutoRows: '3.3vw' }}>
      <motion.div
        layoutId={`event-container-${event.id}`}
        className="relative w-full h-full overflow-hidden shadow-xl"
        style={{ gridColumn: `span ${event.col}`, gridRow: `span ${event.row}`, zIndex: 50 }}
      >
        {event.cover_image && <img src={event.cover_image} className="w-full h-full object-cover block" />}
      </motion.div>

      {galleryItems.map((it, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05, duration: 0.4 }}
          className="relative w-full h-full overflow-hidden shadow-md hover:z-50"
          style={{ gridColumn: `span ${it.col}`, gridRow: `span ${it.row}` }}
          whileHover={{ scale: 1.05 }}
        >
          <img src={it.src} className="w-full h-full object-cover block" />
        </motion.div>
      ))}
    </div>
  )
}

export default function YearUI3({ yearData, events }: Props) {
  const router = useRouter()
  const [selectedEvent, setSelectedEvent] = useState<LayoutEvent | null>(null)

  // Filter all active events, forget about major/minor, no grouping.
  const activeEvents = events.filter(e => e.is_active)

  const [puzzleItems, setPuzzleItems] = useState<LayoutEvent[]>([])

  useEffect(() => {
    const shuffled = [...activeEvents].sort(() => Math.random() - 0.5)

    const loadAllImages = async () => {
      const results = await Promise.all(
        shuffled.map((ev) => {
          return new Promise<LayoutEvent>((resolve) => {
            const colSpan = pickColSpan()

            if (!ev.cover_image) {
              resolve({ ...ev, col: colSpan, row: 3 })
              return
            }

            const img = new window.Image()
            img.onload = () => {
              const aspect = img.naturalWidth / img.naturalHeight
              // Compute row span to match image's actual aspect ratio
              let rowSpan = Math.round(colSpan * COL_TO_ROW_FACTOR / aspect)
              rowSpan = Math.max(1, Math.min(rowSpan, 12)) // clamp 1–12
              resolve({ ...ev, col: colSpan, row: rowSpan })
            }
            img.onerror = () => {
              resolve({ ...ev, col: colSpan, row: 3 })
            }
            img.src = ev.cover_image
          })
        })
      )
      setPuzzleItems(results)
    }

    loadAllImages()
  }, [events])

  // Handle escape key to close modal seamlessly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedEvent(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => { document.body.style.overflow = 'auto' }
  }, [selectedEvent])

  return (
    <main className="relative min-h-screen w-full bg-white text-black overflow-x-hidden selection:bg-black selection:text-white">

      {/* HEADER OVERLAY */}
      <div className="absolute top-0 left-0 w-full z-40 pointer-events-none p-6 sm:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        {yearData.year_stamp_present && (
          <h1
            className="hidden text-5xl sm:text-7xl text-black opacity-95"
            style={{ fontFamily: 'HelveticaBold', letterSpacing: '-0.02em' }}
          >
            {yearData.year}
          </h1>
        )}
        <p
          className="text-xl sm:text-2xl italic tracking-wide text-[#FF0000] mt-2 sm:mt-0 opacity-90"
          style={{ fontFamily: 'CormorantGaramondNormal' }}
        >
          {yearData.tagline}
        </p>
      </div>

      {/* DENSE GRID JIGSAW — gapless, genuinely varied sizes, slight object-cover crop */}
      <div
        className="pt-36 sm:pt-40 grid grid-cols-12 grid-flow-dense gap-0 bg-white"
        style={{ gridAutoRows: '5vw' }}
      >
        {puzzleItems.map((event, idx) => (
          <div
            key={event.id}
            style={{
              gridColumn: `span ${event.col}`,
              gridRow: `span ${event.row}`,
              animationDelay: `${idx * 100}ms`,
              animationFillMode: 'both'
            }}
            className="animate-fade-in-up fade-in-up relative hover:z-50"
          >
            <motion.div
              layoutId={`event-container-${event.id}`}
              onClick={() => setSelectedEvent(event)}
              whileHover={{ scale: 1.05, zIndex: 30 }}
              transition={{ duration: 0.3 }}
              style={{ zIndex: 10 }}
              className="relative w-full h-full cursor-pointer group bg-white shadow-sm"
            >
              {event.cover_image && (
                <img
                  src={event.cover_image}
                  alt={event.title}
                  className="w-full h-full object-cover block"
                />
              )}

              {/* Overlay with elegant Title & View Gallery prompt */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col justify-end items-start p-4 sm:p-6 lg:p-8">
                <h3
                  className="text-white text-lg sm:text-xl lg:text-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                  style={{ fontFamily: 'HelveticaBold', letterSpacing: '-0.02em' }}
                >
                  {event.title}
                </h3>
                {event.has_gallery && (
                  <p
                    className="text-white/80 text-[10px] sm:text-xs uppercase tracking-[0.2em] mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75"
                    style={{ fontFamily: 'HelveticaBold' }}
                  >
                    View Gallery
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* MODAL / SPLIT VIEW */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10"
          >
            {/* Blurred Background Filter */}
            <motion.div
              className="absolute inset-0 bg-white/70"
              onClick={() => setSelectedEvent(null)}
              initial={{ backdropFilter: 'blur(0px)' }}
              animate={{ backdropFilter: 'blur(24px)' }}
              exit={{ backdropFilter: 'blur(0px)' }}
            />

            {/* Content Split Container */}
            <div className="relative z-10 w-full h-full max-h-[90vh] flex flex-col lg:flex-row gap-8 lg:gap-16 items-start overflow-y-auto overflow-x-hidden scrollbar-hide py-10 lg:py-0">

              {/* Left Side: The Gallery Grid */}
              <div className="w-full lg:w-2/3 h-auto pt-6 pb-20 px-2 sm:px-6">
                <InnerGallery event={selectedEvent} />
              </div>

              {/* Right Side: Details Animating In */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ delay: 0.25, ease: "easeOut", duration: 0.5 }}
                className="w-full lg:w-1/3 flex flex-col justify-start lg:sticky lg:top-10 pb-10 lg:pb-0"
              >
                <div className="max-w-2xl">
                  <h2
                    className="text-4xl sm:text-6xl lg:text-7xl text-black leading-[1.1] mb-6"
                    style={{ fontFamily: 'HelveticaBold', letterSpacing: '-0.02em' }}
                  >
                    {selectedEvent.title}
                  </h2>

                  {selectedEvent.description && (
                    <p
                      className="text-lg sm:text-xl text-black/70 leading-relaxed mb-12"
                      style={{ fontFamily: 'CormorantGaramondNormal' }}
                    >
                      {selectedEvent.description}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="group px-6 py-5 text-black/50 hover:text-black uppercase tracking-[0.1em] text-sm transition-colors flex items-center gap-3 border border-black/10 hover:border-black/30"
                      style={{ fontFamily: 'HelveticaBold' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="transition-transform group-hover:-translate-x-1">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                      </svg>
                      Back
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Top Right Floating Close X */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              onClick={() => setSelectedEvent(null)}
              className="absolute top-6 right-6 sm:top-10 sm:right-10 z-20 text-black/40 hover:text-black transition-colors"
              aria-label="Close"
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </motion.button>

          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="bg-white text-black text-center py-10 mt-12">
        <p className="text-xl text-[#FF0000]" style={{ fontFamily: 'HelveticaBold' }}>
          {yearData.year}
        </p>
        <div className="mt-6 flex justify-center space-x-6 text-[#FF0000]">
          <a href="https://www.instagram.com/ut_awasthi/" target="_blank" rel="noreferrer"><FaInstagram size={28} /></a>
          <a href="https://www.youtube.com/@Yousaidut" target="_blank" rel="noreferrer"><FaYoutube size={28} /></a>
          <a href="https://www.linkedin.com/in/utkarsh-awasthi-b35917231/" target="_blank" rel="noreferrer"><FaLinkedin size={28} /></a>
        </div>
      </footer>

    </main>
  )
}
