'use client'

import { useEffect, useRef } from 'react'

export const CONFIG = {
  dotCount:    100,
  opacity:     0.7,
  cloudRadius: 120,
  glowSize:    3,
}

export default function CircuitTrace() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // placeholder — draw a test dot at center
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, 4, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(56,189,248,0.8)'
      ctx.fill()
      raf = requestAnimationFrame(draw)
    }

    resize()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none hidden xl:block"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
