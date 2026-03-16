'use client'

import { useEffect, useRef } from 'react'

export const CONFIG = {
  dotCount:     320,
  edgeCount:    140,   // extra dots seeded along the 4 edges
  heroCount:    120,   // chaotic dots concentrated around the hero area
  opacity:      0.60,
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
  alpha:     number   // per-dot opacity multiplier
  phase:     number
  free:      boolean  // roams freely with larger range
  hero:      boolean  // chaotic hero-area dot
  sparkMode: boolean
  sparkAge:  number
}

function makeDot(kind: 'ambient' | 'edge' | 'hero'): Dot {
  const free = kind === 'ambient' && Math.random() < 0.28
  const hero = kind === 'hero'

  let homeXF: number
  let homeYF: number

  if (kind === 'edge') {
    const depth = Math.random() * 0.07
    const along = Math.random()
    switch (Math.floor(Math.random() * 4)) {
      case 0: homeXF = along;       homeYF = depth;      break  // top
      case 1: homeXF = along;       homeYF = 1 - depth;  break  // bottom
      case 2: homeXF = depth;       homeYF = along;      break  // left
      default: homeXF = 1 - depth; homeYF = along;      break  // right
    }
  } else if (kind === 'hero') {
    // Concentrated in the upper viewport — hero zone
    homeXF = Math.random()
    homeYF = Math.random() * 0.68
  } else {
    homeXF = Math.random()
    homeYF = Math.random()
  }

  return {
    homeXF,
    homeYF,
    driftX:    0,
    driftY:    0,
    vx:        (Math.random() - 0.5) * (hero ? 0.5 : free ? 0.4 : 0.12),
    vy:        (Math.random() - 0.5) * (hero ? 0.5 : free ? 0.4 : 0.12),
    radius:    kind === 'edge'
                 ? 0.5 + Math.random() * 1.4
                 : hero
                   ? 0.4 + Math.random() * 1.8
                   : free
                     ? 0.8 + Math.random() * 1.2
                     : Math.random() < 0.14
                       ? 2.2 + Math.random() * 1.4
                       : 0.6 + Math.random() * 1.6,
    alpha:     hero ? 0.15 + Math.random() * 0.45
                    : free ? 0.18 + Math.random() * 0.35
                           : 0.30 + Math.random() * 0.70,
    phase:     Math.random() * Math.PI * 2,
    free,
    hero,
    sparkMode: false,
    sparkAge:  0,
  }
}

function initDots(): Dot[] {
  return [
    ...Array.from({ length: CONFIG.dotCount  }, () => makeDot('ambient')),
    ...Array.from({ length: CONFIG.edgeCount  }, () => makeDot('edge')),
    ...Array.from({ length: CONFIG.heroCount  }, () => makeDot('hero')),
  ]
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

    let cssW = window.innerWidth
    let cssH = window.innerHeight

    let mouseX = -9999
    let mouseY = -9999

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

      ctx.clearRect(0, 0, cssW, cssH)

      const now = performance.now()
      // Slow spatial wave — period ~63 s, sweeps across the screen
      const wt = now * 0.00010
      // Edge zone: opacity boosts toward the frame boundary
      const edgeMargin = Math.min(cssW, cssH) * 0.40

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

          const fadeT  = 1 - dot.sparkAge / MAX_SPARK_AGE
          const sx     = homeX + dot.driftX
          const sy     = homeY + dot.driftY
          const edgeT  = 1 - Math.min(1, Math.max(0, Math.min(sx, cssW - sx, sy, cssH - sy)) / edgeMargin)
          const edgeMul = 1 + edgeT * edgeT * 0.9
          drawDot(
            ctx, sx, sy,
            Math.max(0.4, dotRadius * 0.45),
            Math.min(1, CONFIG.opacity * dot.alpha * 0.55 * fadeT * edgeMul),
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

        // --- Drift physics ---
        const noise  = dot.hero ? 0.32  : dot.free ? 0.18 : 0.07
        const damp   = dot.hero ? 0.984 : dot.free ? 0.97 : 0.95
        const spring = dot.hero ? 0.0006 : dot.free ? 0.0012 : 0.004
        dot.vx += (Math.random() - 0.5) * noise
        dot.vy += (Math.random() - 0.5) * noise - 0.003
        dot.vx *= damp
        dot.vy *= damp

        // Hero dots: slow rotating flow field — direction sweeps over ~52 s,
        // creating structured-but-unpredictable currents through the hero area
        if (dot.hero) {
          const flowAngle = now * 0.00012 + dot.phase
          dot.vx += Math.cos(flowAngle) * 0.018
          dot.vy += Math.sin(flowAngle) * 0.018
        }

        // Spring back to resting position
        dot.vx -= dot.driftX * spring
        dot.vy -= dot.driftY * spring

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

        // Drift limit
        const maxDrift = dot.hero ? 340 : dot.free ? 260 : 70
        const driftMag = Math.sqrt(dot.driftX * dot.driftX + dot.driftY * dot.driftY)
        if (driftMag > maxDrift) {
          dot.driftX *= maxDrift / driftMag
          dot.driftY *= maxDrift / driftMag
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

        const x      = homeX + dot.driftX + windX
        const y      = homeY + dot.driftY + windY
        const edgeT  = 1 - Math.min(1, Math.max(0, Math.min(x, cssW - x, y, cssH - y)) / edgeMargin)
        const edgeMul = 1 + edgeT * edgeT * 0.9
        drawDot(ctx, x, y, dotRadius, Math.min(1, CONFIG.opacity * dot.alpha * edgeMul))
      })

      raf = requestAnimationFrame(draw)
    }

    rebuild()
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseout',  onMouseOut,  { passive: true })

    const ro = new ResizeObserver(rebuild)
    ro.observe(document.documentElement)

    return () => {
      cancelAnimationFrame(raf)
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
