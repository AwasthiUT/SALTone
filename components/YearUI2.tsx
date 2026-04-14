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

export default function YearUI2({ yearData, events }: Props) {
  const router = useRouter()
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  // Filter all active events, forget about major/minor, no grouping.
  const activeEvents = events.filter(e => e.is_active)

  type ColumnData = { widthClass: string; items: Event[] }
  const [columns, setColumns] = useState<ColumnData[]>([])

  useEffect(() => {
    // We do the randomization safely on the client
    const shuffled = [...activeEvents].sort(() => Math.random() - 0.5)
    // We determine the grid layout ratios once per render
    const renderRandomizer = Math.random()

    const buildColumns = () => {
      const isMobile = window.innerWidth < 640
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024

      let numCols = 3
      let widths: string[] = []
      let widthValues: number[] = []

      if (isMobile) {
        numCols = 1
        widths = ['w-full']
        widthValues = [1]
      } else if (isTablet) {
        numCols = 2
        if (renderRandomizer > 0.5) {
          widths = ['w-[60%]', 'w-[40%]']
          widthValues = [0.6, 0.4]
        } else {
          widths = ['w-[40%]', 'w-[60%]']
          widthValues = [0.4, 0.6]
        }
      } else {
        // Desktop
        numCols = 3
        if (renderRandomizer > 0.75) {
          widths = ['w-1/2', 'w-1/4', 'w-1/4'] // left huge
          widthValues = [0.5, 0.25, 0.25]
        } else if (renderRandomizer > 0.5) {
          widths = ['w-1/4', 'w-1/2', 'w-1/4'] // center huge
          widthValues = [0.25, 0.5, 0.25]
        } else if (renderRandomizer > 0.25) {
          widths = ['w-1/4', 'w-1/4', 'w-1/2'] // right huge
          widthValues = [0.25, 0.25, 0.5]
        } else {
          widths = ['w-1/3', 'w-1/3', 'w-1/3'] // balanced
          widthValues = [0.33, 0.33, 0.33]
        }
      }

      const newCols: ColumnData[] = widths.map(w => ({ widthClass: w, items: [] }))
      const colHeights = new Array(numCols).fill(0)

      shuffled.forEach((ev) => {
        // Distribute algorithmically to the physically shortest column
        let shortestIdx = 0
        for (let i = 1; i < numCols; i++) {
          if (colHeights[i] < colHeights[shortestIdx]) {
            shortestIdx = i
          }
        }
        newCols[shortestIdx].items.push(ev)
        // A wider column scales images up proportionally, making it climb faster vertically per item
        colHeights[shortestIdx] += widthValues[shortestIdx]
      })

      setColumns(newCols)
    }

    buildColumns()
    window.addEventListener('resize', buildColumns)
    return () => window.removeEventListener('resize', buildColumns)
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

      {/* ALGORITHMIC ZERO-CROP DOM COLUMNS (Custom Flex Masonry) */}
      <div className="pt-36 sm:pt-40 flex flex-row w-full gap-0 bg-white items-start">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className={`flex flex-col gap-0 ${col.widthClass}`}>
            {col.items.map(event => (
              <motion.div
                layoutId={`event-container-${event.id}`}
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                whileHover={{ scale: 1.05, zIndex: 30 }}
                transition={{ duration: 0.3 }}
                style={{ zIndex: 10 }}
                className="relative w-full cursor-pointer group bg-white border-0 outline-none"
              >
                {event.cover_image && (
                  <img
                    src={event.cover_image}
                    alt={event.title}
                    className="w-full h-auto block m-0 p-0 bg-white border-0 outline-none"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-white/10 transition-colors duration-500 pointer-events-none" />
              </motion.div>
            ))}
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
            <div className="relative z-10 w-full h-full max-h-[90vh] flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-stretch overflow-y-auto overflow-x-hidden scrollbar-hide py-10 lg:py-0">

              {/* Left Side: The Animated Image */}
              <motion.div
                layoutId={`event-container-${selectedEvent.id}`}
                className="relative w-full lg:w-1/2 h-auto max-h-[80vh] flex items-center justify-center overflow-hidden flex-shrink-0"
              >
                {selectedEvent.cover_image && (
                  <img
                    src={selectedEvent.cover_image}
                    alt={selectedEvent.title}
                    className="w-full h-auto max-h-[80vh] object-contain drop-shadow-2xl"
                  />
                )}
              </motion.div>

              {/* Right Side: Details Animating In */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ delay: 0.25, ease: "easeOut", duration: 0.5 }}
                className="w-full lg:w-1/2 flex flex-col justify-center pb-10 lg:pb-0"
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
                    {selectedEvent.has_gallery && (
                      <button
                        onClick={() => router.push(`/gallery/event/${selectedEvent.id}`)}
                        className="px-10 py-5 bg-[#FF0000] text-white text-sm uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white transition-colors duration-300"
                        style={{ fontFamily: 'HelveticaBold' }}
                      >
                        Explore Gallery
                      </button>
                    )}

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
