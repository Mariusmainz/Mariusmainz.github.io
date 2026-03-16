'use client'

import { useEffect, useRef } from 'react'

export const CONFIG = {
  dotCount: 200,
  opacity:  0.60,
  maxDrift: 70,    // max px each dot can wander from its resting position
}

const MAX_SPARK_AGE   = 160
const CURSOR_RADIUS   = 170
const CURSOR_STRENGTH = 0.22

interface Dot {
  homeXF:    number   // resting x as 0–1 fraction of viewport width
  homeYF:    number   // resting y as 0–1 fraction of viewport height
  driftX:    number
  driftY:    number
  vx:        number
  vy:        number
  radius:    number
  alpha:     number   // per-dot opacity multiplier (0.3–1.0)
  phase:     number
  sparkMode: boolean
  sparkAge:  number
}

function initDots(): Dot[] {
  return Array.from({ length: CONFIG.dotCount }, () => ({
    homeXF:    Math.random(),
    homeYF:    Math.random(),
    driftX:    0,
    driftY:    0,
    vx:        (Math.random() - 0.5) * 0.12,
    vy:        (Math.random() - 0.5) * 0.12,
    // Mix of small ambient dots and occasional larger feature dots
    radius:    Math.random() < 0.14
                 ? 2.2 + Math.random() * 1.4
                 : 0.6 + Math.random() * 1.6,
    alpha:     0.28 + Math.random() * 0.72,
    phase:     Math.random() * Math.PI * 2,
    sparkMode: false,
    sparkAge:  0,
  }))
}

function drawDot(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  radius: number,
  opacity: number,
) {
  if (opacity < 0.008) return
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(56,189,248,${opacity.toFixed(3)})`
  ctx.fill()
}

export default function CircuitTrace() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf  = 0
    const dots = initDots()

    let lastScrollY = window.scrollY
    let velocity    = 0
    let cssW = window.innerWidth
    let cssH = window.innerHeight

    let mouseX = -9999
    let mouseY = -9999

    const onScroll    = () => {
      const sy = window.scrollY
      const raw = Math.max(-200, Math.min(200, sy - lastScrollY))
      velocity    = velocity + (raw - velocity) * 0.12
      lastScrollY = sy
    }
    const onMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY }
    const onMouseOut  = () => { mouseX = -9999; mouseY = -9999 }

    const rebuild = () => {
      const dpr = window.devicePixelRatio || 1
      cssW = window.innerWidth
      cssH = window.innerHeight
      canvas.width  = cssW * dpr
      canvas.height = cssH * dpr
      canvas.style.width  = `${cssW}px`
      canvas.style.height = `${cssH}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(draw)
    }

    const draw = () => {
      if (document.hidden) { raf = requestAnimationFrame(draw); return }

      // Scroll velocity decays when not scrolling
      velocity *= 0.92

      ctx.clearRect(0, 0, cssW, cssH)

      const now = performance.now()
      // Slow spatial wave — period ~63 s, sweeps across the screen
      const wt = now * 0.00010

      dots.forEach(dot => {
        const homeX = dot.homeXF * cssW
        const homeY = dot.homeYF * cssH

        // Per-dot radius breathes slowly
        const dotRadius = Math.max(0.4,
          dot.radius * (1 + 0.22 * Math.sin(now * 0.00018 + dot.phase * 1.5)),
        )

        if (dot.sparkMode) {
          dot.vx     *= 0.97
          dot.vy     *= 0.97
          dot.driftX += dot.vx
          dot.driftY += dot.vy
          dot.sparkAge++

          const t = 1 - dot.sparkAge / MAX_SPARK_AGE
          drawDot(
            ctx,
            homeX + dot.driftX,
            homeY + dot.driftY,
            Math.max(0.4, dotRadius * 0.45),
            CONFIG.opacity * dot.alpha * 0.55 * t,
          )

          if (dot.sparkAge >= MAX_SPARK_AGE) {
            dot.sparkMode = false
            dot.sparkAge  = 0
            dot.driftX    = 0
            dot.driftY    = 0
            dot.vx        = (Math.random() - 0.5) * 0.12
            dot.vy        = (Math.random() - 0.5) * 0.12
          }
          return
        }

        // --- Calm atmospheric drift ---
        dot.vx += (Math.random() - 0.5) * 0.07
        dot.vy += (Math.random() - 0.5) * 0.07 - 0.003   // faint upward bias
        dot.vx *= 0.95
        dot.vy *= 0.95

        // Subtle scroll push — dots drift with the page momentum
        dot.vy += velocity * 0.006

        // Gentle spring back to resting position
        dot.vx -= dot.driftX * 0.004
        dot.vy -= dot.driftY * 0.004

        // Cursor magnetic pull — soft quadratic falloff
        const cx = homeX + dot.driftX
        const cy = homeY + dot.driftY
        const cdx    = mouseX - cx
        const cdy    = mouseY - cy
        const cdist2 = cdx * cdx + cdy * cdy
        if (cdist2 < CURSOR_RADIUS * CURSOR_RADIUS && cdist2 > 0.01) {
          const cdist = Math.sqrt(cdist2)
          const t     = 1 - cdist / CURSOR_RADIUS
          dot.vx += (cdx / cdist) * t * t * CURSOR_STRENGTH
          dot.vy += (cdy / cdist) * t * t * CURSOR_STRENGTH
        }

        dot.driftX += dot.vx
        dot.driftY += dot.vy

        // Hard drift limit — keeps each dot tethered to its home
        const driftMag = Math.sqrt(dot.driftX * dot.driftX + dot.driftY * dot.driftY)
        if (driftMag > CONFIG.maxDrift) {
          dot.driftX *= CONFIG.maxDrift / driftMag
          dot.driftY *= CONFIG.maxDrift / driftMag
        }

        // Rare ember spark
        if (Math.random() < 0.00012) {
          dot.sparkMode = true
          dot.sparkAge  = 0
          const a = Math.random() * Math.PI * 2
          const s = 0.6 + Math.random() * 1.3
          dot.vx = Math.cos(a) * s
          dot.vy = Math.sin(a) * s - 0.3
        }

        // Slow spatial wave — position offset that sweeps across the field
        const windAmp = 9
        const windX   = Math.sin(wt + homeX * 0.0030) * windAmp
        const windY   = Math.cos(wt * 0.71 + homeY * 0.0028) * windAmp * 0.5

        drawDot(
          ctx,
          homeX + dot.driftX + windX,
          homeY + dot.driftY + windY,
          dotRadius,
          CONFIG.opacity * dot.alpha,
        )
      })

      raf = requestAnimationFrame(draw)
    }

    rebuild()
    window.addEventListener('scroll',    onScroll,    { passive: true })
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseout',  onMouseOut,  { passive: true })

    const ro = new ResizeObserver(rebuild)
    ro.observe(document.documentElement)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll',    onScroll)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseout',  onMouseOut)
      ro.disconnect()
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
