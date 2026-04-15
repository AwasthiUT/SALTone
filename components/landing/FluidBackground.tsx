'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

type Blob = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  phase: number
  speed: number
}

const COLORS = [
  'rgba(255, 51, 102, 0.6)',   // Hot pink
  'rgba(255, 107, 53, 0.5)',   // Orange
  'rgba(255, 215, 0, 0.5)',    // Gold
  'rgba(0, 210, 255, 0.5)',    // Cyan
  'rgba(138, 43, 226, 0.5)',   // Purple
  'rgba(0, 255, 136, 0.4)',    // Mint
]

export default function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const blobsRef = useRef<Blob[]>([])
  const mouseRef = useRef({ x: -1, y: -1 })
  const animRef = useRef<number>(0)

  const initBlobs = useCallback((w: number, h: number) => {
    blobsRef.current = COLORS.map((color, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.min(w, h) * (0.15 + Math.random() * 0.15),
      color,
      phase: (i / COLORS.length) * Math.PI * 2,
      speed: 0.003 + Math.random() * 0.005,
    }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      if (blobsRef.current.length === 0) {
        initBlobs(canvas.width, canvas.height)
      }
    }

    resize()
    window.addEventListener('resize', resize)

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouse)

    let time = 0

    const animate = () => {
      time++
      const { width: w, height: h } = canvas

      // Clear
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, w, h)

      blobsRef.current.forEach((blob) => {
        // Sine-wave drift
        blob.x += blob.vx + Math.sin(time * blob.speed + blob.phase) * 0.8
        blob.y += blob.vy + Math.cos(time * blob.speed * 0.7 + blob.phase) * 0.6

        // Mouse attraction
        const mx = mouseRef.current.x
        const my = mouseRef.current.y
        if (mx > 0 && my > 0) {
          const dx = mx - blob.x
          const dy = my - blob.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 500) {
            const force = (500 - dist) / 500 * 0.015
            blob.x += dx * force
            blob.y += dy * force
          }
        }

        // Wrap around edges
        if (blob.x < -blob.radius) blob.x = w + blob.radius
        if (blob.x > w + blob.radius) blob.x = -blob.radius
        if (blob.y < -blob.radius) blob.y = h + blob.radius
        if (blob.y > h + blob.radius) blob.y = -blob.radius

        // Draw blob
        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.radius
        )
        gradient.addColorStop(0, blob.color)
        gradient.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.beginPath()
        ctx.fillStyle = gradient
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Apply blur via CSS filter on the canvas element itself
      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [initBlobs])

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0"
      style={{ filter: 'blur(80px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    />
  )
}
