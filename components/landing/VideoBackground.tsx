'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { getActiveBackgrounds } from '@/lib/supabase/backgrounds'

type Props = {
  isVisible: boolean
}

interface BackgroundData {
  id: string
  video_url: string
  mode: string
  is_active: boolean
  weight: number
  brightness: number
  blur_level: number
  device_type: string
}

const FALLBACK_VIDEO = "https://rwoqsdnokmwrwqinevlk.supabase.co/storage/v1/object/public/Movie%20Thumbnails/BG%20videos/reducingits.mp4"

export default function VideoBackground({ isVisible }: Props) {
  const [background, setBackground] = useState<BackgroundData | null>(null)

  // Track scroll for fade-out effect
  const { scrollY } = useScroll()
  // Fade out from scroll 0 to 600px
  const scrollOpacity = useTransform(scrollY, [0, 2500], [1, 0])

  useEffect(() => {
    async function fetchBackground() {
      try {
        console.log("Fetching backgrounds...")
        const data = await getActiveBackgrounds()

        if (!data || data.length === 0) {
          console.warn("No active backgrounds found in Supabase (Check if RLS is enabled without a public read policy!)")
          return
        }

        console.log("Found active backgrounds:", data)

        // Wait to filter specifically for creative mode 
        const creativeBackgrounds = data.filter(bg => bg.mode === 'creative' || bg.mode === 'Creative') // Case tolerant

        if (creativeBackgrounds.length === 0) {
          console.warn("No backgrounds passed the 'mode=creative' filter.")
          return
        }

        // Filter based on device type
        const isMobile = window.innerWidth < 768
        const suitableData = creativeBackgrounds.filter(bg => {
          if (isMobile && (bg.device_type === 'desktop' || bg.device_type === 'Desktop')) return false
          return true
        })

        const pool = suitableData.length > 0 ? suitableData : creativeBackgrounds

        // Simple random select
        const randomBg = pool[Math.floor(Math.random() * pool.length)]
        console.log("Selected background for user:", randomBg)
        setBackground(randomBg as BackgroundData)
      } catch (error) {
        console.error("Error fetching backgrounds from service:", error)
      }
    }

    fetchBackground()
  }, [])

  // Compute final styles
  const mediaUrl = background?.video_url ?? " "
  const mediaBrightness = background?.brightness ?? 1
  const mediaBlur = background?.blur_level ?? 0

  // Detect file type
  const isImage = mediaUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i) !== null

  return (
    <motion.div
      className="fixed inset-0 z-0 pointer-events-none bg-black"
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ opacity: scrollOpacity }}
      >
        {/* Background Media */}
        {isImage ? (
          <img
            key={mediaUrl}
            src={mediaUrl}
            alt="Background"
            className="w-full h-full object-cover transition-all duration-1000"
            style={{
              filter: `brightness(${mediaBrightness}) blur(${mediaBlur}px)`,
            }}
          />
        ) : (
          <video
            key={mediaUrl} // Ensures the video reloads correctly when the source changes
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover transition-all duration-1000"
            style={{
              filter: `brightness(${mediaBrightness}) blur(${mediaBlur}px)`,
            }}
          >
            <source src={mediaUrl} type="video/mp4" />
          </video>
        )}

        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>
    </motion.div>
  )
}
