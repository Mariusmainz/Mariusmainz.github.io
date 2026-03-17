'use client'

import { useEffect, useRef } from 'react'

export const CONFIG = {
  dotCount:     320,
  edgeCount:    140,   // extra dots seeded along the 4 edges
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
  alpha:     number   // per-dot opacity multiplier (0.3–1.0)
  phase:     number
  free:      boolean  // true → roams freely with larger range
  sparkMode: boolean
  sparkAge:  number
}

function makeDot(edgePlaced: boolean): Dot {
  const free = !edgePlaced && Math.random() < 0.28

  let homeXF: number
  let homeYF: number
  if (edgePlaced) {
    // Seed along one of the 4 edges, within 7% of the boundary
    const depth = Math.random() * 0.07
    const along = Math.random()
    switch (Math.floor(Math.random() * 4)) {
      case 0: homeXF = along;        homeYF = depth;        break  // top
      case 1: homeXF = along;        homeYF = 1 - depth;    break  // bottom
      case 2: homeXF = depth;        homeYF = along;        break  // left
      default: homeXF = 1 - depth;  homeYF = along;        break  // right
    }
  } else {
    homeXF = Math.random()
    homeYF = Math.random()
  }

  return {
    homeXF,
    homeYF,
    driftX:    0,
    driftY:    0,
    vx:        (Math.random() - 0.5) * (free ? 0.4 : 0.12),
    vy:        (Math.random() - 0.5) * (free ? 0.4 : 0.12),
    radius:    edgePlaced
                 ? 0.5 + Math.random() * 1.4
                 : free
                   ? 0.8 + Math.random() * 1.2
                   : Math.random() < 0.14
                     ? 2.2 + Math.random() * 1.4
                     : 0.6 + Math.random() * 1.6,
    alpha:     free ? 0.18 + Math.random() * 0.35 : 0.30 + Math.random() * 0.70,
    phase:     Math.random() * Math.PI * 2,
    free,
    sparkMode: false,
    sparkAge:  0,
  }
}

function initDots(): Dot[] {
  return [
    ...Array.from({ length: CONFIG.dotCount },   () => makeDot(false)),
    ...Array.from({ length: CONFIG.edgeCount },   () => makeDot(true)),
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

    let cssW = 0
    let cssH = 0

    let mouseX = -9999
    let mouseY = -9999

    const onMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY }
    const onMouseOut  = () => { mouseX = -9999; mouseY = -9999 }

    const rebuild = () => {
      const newW = window.innerWidth
      const newH = window.innerHeight
      // Only resize the canvas when the viewport itself changes.
      // Page-content changes (e.g. accordion expand) alter scrollHeight but
      // not innerWidth/innerHeight — skipping here prevents the 1-frame blank flash.
      if (newW === cssW && newH === cssH) return
      const dpr = window.devicePixelRatio || 1
      cssW = newW
      cssH = newH
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

        // --- Drift physics — free dots roam wider, calm dots float softly ---
        const noise  = dot.free ? 0.18 : 0.07
        const damp   = dot.free ? 0.97 : 0.95
        const spring = dot.free ? 0.0012 : 0.004
        dot.vx += (Math.random() - 0.5) * noise
        dot.vy += (Math.random() - 0.5) * noise - 0.003
        dot.vx *= damp
        dot.vy *= damp

        // Gentle spring back to resting position
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

        // Drift limit — free dots roam up to 260px, calm dots up to 70px
        const maxDrift = dot.free ? 260 : 70
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
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
