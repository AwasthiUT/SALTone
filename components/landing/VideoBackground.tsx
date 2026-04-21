'use client'

import { motion } from 'framer-motion'

type Props = {
  isVisible: boolean
}

export default function VideoBackground({ isVisible }: Props) {
  return (
    <motion.div
      className="fixed inset-0 z-0 pointer-events-none"
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
      >
        <source src="https://rwoqsdnokmwrwqinevlk.supabase.co/storage/v1/object/public/Movie%20Thumbnails/BG%20videos/reducingits.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-black/40" />
    </motion.div>
  )
}
