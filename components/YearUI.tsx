'use client'

import { useState, useEffect } from 'react' // check why do we need this
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa'

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

export default function YearUI({ yearData, events }: Props) {
  const router = useRouter()

  const majorEvents = events.filter(e => e.is_major && e.is_active)
  const activeMajorEventIds = new Set(majorEvents.map(e => e.id))

  const subEvents = events.filter(e => !e.is_major && e.is_active)

  const getSubEvents = (parentId: number) =>
    subEvents.filter(e => e.parent_id === parentId)

  const standaloneSubEvents = subEvents.filter(e => 
    e.parent_id === null || !activeMajorEventIds.has(e.parent_id)
  )

  const [shuffledStandalone, setShuffledStandalone] = useState<Event[]>(standaloneSubEvents)
  
  // Use a string of IDs to track if the standalone events actually changed, preventing infinite render loops
  const standaloneIds = standaloneSubEvents.map(e => e.id).join(',')

  useEffect(() => {
    // Determine random order on client side only to avoid hydration mismatches
    setShuffledStandalone([...standaloneSubEvents].sort(() => Math.random() - 0.5))
  }, [standaloneIds])


  return (
    <main className="relative min-h-screen w-full bg-black text-white overflow-x-hidden">

      {/* HERO */}
      <div className="relative w-full h-[70vh] fade-in-up">
        {yearData.cover_image && (
          <Image
            src={yearData.cover_image}
            alt={String(yearData.year)}
            fill
            className="object-cover opacity-60"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
          {yearData.year_stamp_present && (
            <p
              className="text-6xl sm:text-8xl text-white fade-in-up"
              style={{ fontFamily: 'HelveticaBold', animationDelay: '100ms' }}
            >
              {yearData.year}
            </p>
          )}
          <p
            className="text-lg sm:text-xl text-[#FF0000] italic fade-in-up"
            style={{ fontFamily: 'CormorantGaramondNormal', animationDelay: '250ms' }}
          >
            {yearData.tagline}
          </p>
        </div>
      </div>

      {/* EVENTS */}
      <div className="px-4 sm:px-10 py-12 space-y-20">

        {majorEvents.map((event, idx) => {
          const subs = getSubEvents(event.id)

          return (
            <div key={event.id} className="fade-in-up" style={{ animationDelay: `${idx * 120}ms` }}>

              {/* MAJOR EVENT CARD */}
              <div
                className={`relative w-full h-[50vh] overflow-hidden rounded-sm ${event.has_gallery ? 'cursor-pointer group' : ''}`}
                onClick={() => event.has_gallery && router.push(`/gallery/event/${event.id}`)}
              >
                {event.cover_image && (
                  <Image
                    src={event.cover_image}
                    alt={event.title}
                    fill
                    className={`object-cover transition-transform duration-700 ${event.has_gallery ? 'group-hover:scale-105' : ''}`}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* event number */}
                <p
                  className="absolute top-4 right-6 text-white/40 text-sm"
                  style={{ fontFamily: 'HelveticaBold' }}
                >
                  #{String(idx + 1).padStart(2, '0')}
                </p>

                <div className="absolute bottom-6 left-6 right-6">
                  <p
                    className="text-2xl sm:text-4xl text-white leading-tight"
                    style={{ fontFamily: 'HelveticaBold' }}
                  >
                    {event.title}
                  </p>
                  {event.description && (
                    <p
                      className="mt-2 text-sm sm:text-base text-white/70"
                      style={{ fontFamily: 'CormorantGaramondNormal' }}
                    >
                      {event.description}
                    </p>
                  )}
                  {event.has_gallery && (
                    <p className="mt-3 text-xs text-[#FF0000] tracking-widest uppercase">
                      View Gallery →
                    </p>
                  )}
                </div>
              </div>

              {/* SUB EVENTS — netflix row */}
              {subs.length > 0 && (
                <div className="mt-4 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {subs.map((sub) => (
                    <div
                      key={sub.id}
                      className={`relative flex-shrink-0 w-48 h-32 rounded-sm overflow-hidden ${sub.has_gallery ? 'cursor-pointer group' : ''}`}
                      onClick={() => sub.has_gallery && router.push(`/gallery/event/${sub.id}`)}
                    >
                      {sub.cover_image && (
                        <Image
                          src={sub.cover_image}
                          alt={sub.title}
                          fill
                          className={`object-cover transition-transform duration-500 ${sub.has_gallery ? 'group-hover:scale-110' : ''}`}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <p
                        className="absolute bottom-2 left-2 right-2 text-xs text-white leading-tight"
                        style={{ fontFamily: 'HelveticaBold' }}
                      >
                        {sub.title}
                      </p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )
        })}

        {/* STANDALONE SUB EVENTS (no parent) */}
        {shuffledStandalone.length > 0 && (
          <div className="fade-in-up">
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {shuffledStandalone.map((sub) => (
                <div
                  key={sub.id}
                  className={`relative flex-shrink-0 w-48 h-32 rounded-sm overflow-hidden ${sub.has_gallery ? 'cursor-pointer group' : ''}`}
                  onClick={() => sub.has_gallery && router.push(`/gallery/event/${sub.id}`)}
                >
                  {sub.cover_image && (
                    <Image
                      src={sub.cover_image}
                      alt={sub.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <p
                    className="absolute bottom-2 left-2 right-2 text-xs text-white leading-tight"
                    style={{ fontFamily: 'HelveticaBold' }}
                  >
                    {sub.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <footer className="bg-black text-white text-center py-6 mt-12">
        <p className="text-xl text-[#FF0000]" style={{ fontFamily: 'HelveticaBold' }}>
          {yearData.year}
        </p>
        <div className="mt-6 flex justify-center space-x-6 text-[#FF0000]">
          <a href="https://www.instagram.com/ut_awasthi/" target="_blank"><FaInstagram size={28} /></a>
          <a href="https://www.youtube.com/@Yousaidut" target="_blank"><FaYoutube size={28} /></a>
          <a href="https://www.linkedin.com/in/utkarsh-awasthi-b35917231/" target="_blank"><FaLinkedin size={28} /></a>
        </div>
      </footer>

    </main>
  )
}