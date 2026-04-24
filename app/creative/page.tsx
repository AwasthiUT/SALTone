'use client'

import { useState, useEffect } from 'react'
import { getActiveBackgrounds } from '@/lib/supabase/backgrounds'
import CreativeContent from '@/components/landing/CreativeContent'

const FALLBACK_VIDEO =
  'https://rwoqsdnokmwrwqinevlk.supabase.co/storage/v1/object/public/Movie%20Thumbnails/BG%20videos/reducingits.mp4'

const FONT_UI = '"Helvetica Neue", Helvetica, Arial, sans-serif'

export default function CreativeWorldPage() {
  const [background, setBackground] = useState<any>(null)

  useEffect(() => {
    async function fetchBackground() {
      try {
        const data = await getActiveBackgrounds()
        if (!data || data.length === 0) return
        
        const creative = data.filter((bg) => bg.mode?.toLowerCase() === 'creative')
        
        const isMobile = window.innerWidth < 768
        const suitable = creative.filter(bg => {
          if (isMobile && bg.device_type?.toLowerCase() === 'desktop') return false
          if (!isMobile && bg.device_type?.toLowerCase() === 'mobile') return false
          return true
        })

        const pool = suitable.length > 0 ? suitable : creative
        if (pool.length === 0) return
        
        const randomBg = pool[Math.floor(Math.random() * pool.length)]
        setBackground(randomBg)
      } catch (err) {
        console.error("Failed to fetch background:", err)
      }
    }
    fetchBackground()
  }, [])

  const mediaUrl = background?.video_url ?? FALLBACK_VIDEO
  const isImage = mediaUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i) !== null
  const brightness = background?.brightness ?? 1
  const blur = background?.blur_level ?? 0

  return (
    <main style={{ position: 'relative', minHeight: '100dvh', background: '#0d0d0d', overflow: 'hidden', fontFamily: FONT_UI }}>
      {isImage ? (
        <img
          src={mediaUrl}
          alt=""
          style={{
            position: 'fixed', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', zIndex: 0,
            filter: `brightness(${brightness}) blur(${blur}px)`
          }}
        />
      ) : (
        <video
          key={mediaUrl}
          autoPlay muted loop playsInline preload="auto"
          aria-hidden="true"
          style={{
            position: 'fixed', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', zIndex: 0,
            filter: `brightness(${brightness}) blur(${blur}px)`
          }}
        >
          <source src={mediaUrl} type="video/mp4" />
        </video>
      )}

      <CreativeContent />
    </main>
  )
}
