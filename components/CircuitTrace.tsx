'use client'

import { useEffect, useRef } from 'react'

export const CONFIG = {
  dotCount:     600,
  edgeCount:    240,
  opacity:      0.60,
}

const MAX_SPARK_AGE   = 160
const CURSOR_RADIUS   = 170
const CURSOR_STRENGTH = 0.22

// Star colour palette — weighted toward white/warm-white like the real night sky
// Each entry: [r, g, b, weight]
const STAR_PALETTE: [number, number, number, number][] = [
  [255, 255, 255, 0.28],   // pure white
  [255, 252, 242, 0.22],   // warm white
  [210, 225, 255, 0.18],   // blue-white
  [120, 160, 255, 0.10],   // blue
  [255, 245, 120, 0.11],   // yellow
  [255, 200,  80, 0.07],   // orange-yellow
  [255, 110, 110, 0.04],   // red
]

// Build a cumulative distribution for fast weighted sampling
const PALETTE_CDF = (() => {
  let sum = 0
  return STAR_PALETTE.map(([r, g, b, w]) => { sum += w; return { r, g, b, cdf: sum } })
})()

function pickColor(): string {
  const t = Math.random()
  const entry = PALETTE_CDF.find(e => t <= e.cdf) ?? PALETTE_CDF[PALETTE_CDF.length - 1]
  return `${entry.r},${entry.g},${entry.b}`
}

interface Dot {
  homeXF:       number
  homeYF:       number
  driftX:       number
  driftY:       number
  vx:           number
  vy:           number
  radius:       number
  alpha:        number
  phase:        number
  color:        string   // 'r,g,b'
  twinkle:      boolean  // true → this star scintillates
  twinkleSpeed: number   // rad/ms — individual flicker rate
  free:         boolean
  sparkMode:    boolean
  sparkAge:     number
}

function makeDot(edgePlaced: boolean): Dot {
  const free    = !edgePlaced && Math.random() < 0.28
  const twinkle = Math.random() < 0.15   // ~15% of stars twinkle

  let homeXF: number
  let homeYF: number
  if (edgePlaced) {
    const depth = Math.random() * 0.07
    const along = Math.random()
    switch (Math.floor(Math.random() * 4)) {
      case 0: homeXF = along;       homeYF = depth;      break
      case 1: homeXF = along;       homeYF = 1 - depth;  break
      case 2: homeXF = depth;       homeYF = along;      break
      default: homeXF = 1 - depth; homeYF = along;      break
    }
  } else {
    homeXF = Math.random()
    homeYF = Math.random()
  }

  return {
    homeXF,
    homeYF,
    driftX:       0,
    driftY:       0,
    vx:           (Math.random() - 0.5) * (free ? 0.4 : 0.12),
    vy:           (Math.random() - 0.5) * (free ? 0.4 : 0.12),
    radius:       edgePlaced
                    ? 0.5 + Math.random() * 1.4
                    : free
                      ? 0.8 + Math.random() * 1.2
                      : Math.random() < 0.14
                        ? 2.2 + Math.random() * 1.4
                        : 0.6 + Math.random() * 1.6,
    alpha:        free ? 0.18 + Math.random() * 0.35 : 0.30 + Math.random() * 0.70,
    phase:        Math.random() * Math.PI * 2,
    color:        pickColor(),
    twinkle,
    twinkleSpeed: 0.0003 + Math.random() * 0.0035,   // ~0.3–6 s per cycle (wide spread)
    free,
    sparkMode:    false,
    sparkAge:     0,
  }
}

function initDots(): Dot[] {
  return [
    ...Array.from({ length: CONFIG.dotCount }, () => makeDot(false)),
    ...Array.from({ length: CONFIG.edgeCount }, () => makeDot(true)),
  ]
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  radius: number,
  opacity: number,
  color: string,
  glow: boolean,
) {
  if (opacity < 0.008) return

  if (glow) {
    // Tight halo for brighter/twinkling stars — like atmospheric diffraction spikes
    const glowR = radius * 3.5
    const grd = ctx.createRadialGradient(x, y, 0, x, y, glowR)
    grd.addColorStop(0, `rgba(${color},${(opacity * 0.35).toFixed(3)})`)
    grd.addColorStop(1, `rgba(${color},0)`)
    ctx.beginPath()
    ctx.arc(x, y, glowR, 0, Math.PI * 2)
    ctx.fillStyle = grd
    ctx.fill()
  }

  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(${color},${opacity.toFixed(3)})`
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

      const now        = performance.now()
      const wt         = now * 0.00010
      const edgeMargin = Math.min(cssW, cssH) * 0.40

      dots.forEach(dot => {
        const homeX = dot.homeXF * cssW
        const homeY = dot.homeYF * cssH

        // Base radius breathes gently
        const dotRadius = Math.max(0.4,
          dot.radius * (1 + 0.18 * Math.sin(now * 0.00018 + dot.phase * 1.5)),
        )

        if (dot.sparkMode) {
          dot.vx     *= 0.97
          dot.vy     *= 0.97
          dot.driftX += dot.vx
          dot.driftY += dot.vy
          dot.sparkAge++

          const fadeT   = 1 - dot.sparkAge / MAX_SPARK_AGE
          const sx      = homeX + dot.driftX
          const sy      = homeY + dot.driftY
          const edgeT   = 1 - Math.min(1, Math.max(0, Math.min(sx, cssW - sx, sy, cssH - sy)) / edgeMargin)
          const edgeMul = 1 + edgeT * edgeT * 0.9
          drawStar(
            ctx, sx, sy,
            Math.max(0.4, dotRadius * 0.45),
            Math.min(1, CONFIG.opacity * dot.alpha * 0.55 * fadeT * edgeMul),
            dot.color,
            false,
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

        // Physics
        const noise  = dot.free ? 0.18 : 0.07
        const damp   = dot.free ? 0.97 : 0.95
        const spring = dot.free ? 0.0012 : 0.004
        dot.vx += (Math.random() - 0.5) * noise
        dot.vy += (Math.random() - 0.5) * noise - 0.003
        dot.vx *= damp
        dot.vy *= damp
        dot.vx -= dot.driftX * spring
        dot.vy -= dot.driftY * spring

        // Cursor pull
        const cx     = homeX + dot.driftX
        const cy     = homeY + dot.driftY
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

        const maxDrift = dot.free ? 260 : 70
        const driftMag = Math.sqrt(dot.driftX * dot.driftX + dot.driftY * dot.driftY)
        if (driftMag > maxDrift) {
          dot.driftX *= maxDrift / driftMag
          dot.driftY *= maxDrift / driftMag
        }

        // Spark emission
        if (Math.random() < 0.00012) {
          dot.sparkMode = true
          dot.sparkAge  = 0
          const a = Math.random() * Math.PI * 2
          const s = 0.6 + Math.random() * 1.3
          dot.vx = Math.cos(a) * s
          dot.vy = Math.sin(a) * s - 0.3
        }

        // Position with wind undulation
        const windAmp = 9
        const windX   = Math.sin(wt + homeX * 0.0030) * windAmp
        const windY   = Math.cos(wt * 0.71 + homeY * 0.0028) * windAmp * 0.5
        const x       = homeX + dot.driftX + windX
        const y       = homeY + dot.driftY + windY

        // Edge intensity boost
        const edgeT   = 1 - Math.min(1, Math.max(0, Math.min(x, cssW - x, y, cssH - y)) / edgeMargin)
        const edgeMul = 1 + edgeT * edgeT * 0.9

        // Twinkle — spike opacity briefly then drop, independent per star
        let twinkleMul = 1
        if (dot.twinkle) {
          const s = Math.sin(now * dot.twinkleSpeed + dot.phase)
          // Squared sine gives sharp bright spikes with dimmer troughs
          twinkleMul = 0.25 + 0.75 * s * s
        }

        const finalOpacity = Math.min(1, CONFIG.opacity * dot.alpha * edgeMul * twinkleMul)

        drawStar(ctx, x, y, dotRadius, finalOpacity, dot.color, false)
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
