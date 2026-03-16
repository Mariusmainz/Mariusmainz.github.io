'use client'

import { useEffect, useRef } from 'react'

export const CONFIG = {
  dotCount:    100,
  opacity:     0.7,
  cloudRadius: 120,
  glowSize:    3,
}

const SECTION_IDS = ['hero', 'about', 'experience', 'projects', 'skills', 'contact'] as const
const FREEZE_DELAY_MS = 80

function catmullRomPoint(
  p0: [number, number], p1: [number, number],
  p2: [number, number], p3: [number, number],
  t: number,
): [number, number] {
  const t2 = t * t
  const t3 = t2 * t
  return [
    0.5*(2*p1[0]+(-p0[0]+p2[0])*t+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),
    0.5*(2*p1[1]+(-p0[1]+p2[1])*t+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3),
  ]
}

function samplePath(waypoints: [number, number][], t: number): [number, number] {
  const n = waypoints.length
  if (n === 0) return [0, 0]
  if (n === 1) return waypoints[0]
  const clamped = Math.max(0, Math.min(1, t))
  const maxSeg  = n - 1
  const scaled  = clamped * maxSeg
  const seg     = Math.min(Math.floor(scaled), maxSeg - 1)
  const lt      = scaled - seg
  const p0 = waypoints[Math.max(0, seg - 1)]
  const p1 = waypoints[seg]
  const p2 = waypoints[Math.min(n - 1, seg + 1)]
  const p3 = waypoints[Math.min(n - 1, seg + 2)]
  return catmullRomPoint(p0, p1, p2, p3, lt)
}

interface PathData {
  waypoints:     [number, number][]
  sectionBounds: { top: number; bottom: number }[]
}

function buildPathData(vw: number): PathData {
  const waypoints:     [number, number][]               = []
  const sectionBounds: { top: number; bottom: number }[] = []

  waypoints.push([vw * 0.5, 0])

  const els = SECTION_IDS.map(id => document.getElementById(id))
  els.forEach((el, i) => {
    if (!el) return
    const rect   = el.getBoundingClientRect()
    const top    = rect.top    + window.scrollY
    const bottom = rect.bottom + window.scrollY
    sectionBounds.push({ top, bottom })

    // During section: cloud retreats to alternating edges with varied depth
    const edgeXFrac = i % 2 === 0
      ? 0.08 + Math.abs(Math.sin(i * 1.7)) * 0.09   // 8–17% from left
      : 0.92 - Math.abs(Math.sin(i * 1.7)) * 0.09   // 83–92% from left
    waypoints.push([vw * edgeXFrac, top + (bottom - top) * 0.5])

    // Between sections: multiple waypoints with sinusoidal x variation → wavy path
    const nextEl = els[i + 1]
    if (nextEl) {
      const nRect   = nextEl.getBoundingClientRect()
      const nextTop = nRect.top + window.scrollY
      const gapLen  = nextTop - bottom
      if (gapLen > 20) {
        // First curve point — offset left or right
        waypoints.push([
          vw * (0.5 + Math.sin(i * 2.3 + 1.0) * 0.28),
          bottom + gapLen * 0.35,
        ])
        // Second curve point — opposite side
        waypoints.push([
          vw * (0.5 + Math.sin(i * 2.3 + 2.8) * 0.28),
          bottom + gapLen * 0.70,
        ])
      }
    }
  })

  waypoints.push([vw * 0.5, document.body.scrollHeight])
  return { waypoints, sectionBounds }
}

interface Dot {
  angle:  number   // base angle from cloud center
  dist:   number   // 0–1 fraction of cloudRadius
  radius: number   // dot radius in px
  phase:  number   // per-dot phase for time-based pulse
  driftX: number   // current spark drift offset x
  driftY: number   // current spark drift offset y
  vx:     number   // drift velocity x
  vy:     number   // drift velocity y
}

function initDots(): Dot[] {
  return Array.from({ length: CONFIG.dotCount }, () => ({
    angle:  Math.random() * Math.PI * 2,
    dist:   Math.random(),
    radius: 1.5 + Math.random() * 1.0,
    phase:  Math.random() * Math.PI * 2,
    driftX: 0,
    driftY: 0,
    vx:     (Math.random() - 0.5) * 0.4,
    vy:     (Math.random() - 0.5) * 0.4,
  }))
}

function drawDot(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  radius: number,
  opacity: number,
  displayRadius: number,
) {
  if (opacity < 0.01) return

  const glowR = Math.max(0.1, radius * CONFIG.glowSize * (displayRadius / CONFIG.cloudRadius))

  const grd = ctx.createRadialGradient(x, y, 0, x, y, glowR)
  grd.addColorStop(0, `rgba(56,189,248,${(opacity * 0.45).toFixed(3)})`)
  grd.addColorStop(1, 'rgba(56,189,248,0)')
  ctx.beginPath()
  ctx.arc(x, y, glowR, 0, Math.PI * 2)
  ctx.fillStyle = grd
  ctx.fill()

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

    let raf      = 0
    let pathData: PathData = { waypoints: [], sectionBounds: [] }
    const dots   = initDots()

    // Cloud state (page coordinates)
    let cloudX         = 0
    let cloudY         = 0
    let displayRadius  = CONFIG.cloudRadius
    let displayOpacity = CONFIG.opacity

    // Scroll state
    let lastScrollY    = window.scrollY
    let velocity       = 0
    let lastScrollTime = 0
    let maxScroll      = Math.max(1, document.body.scrollHeight - window.innerHeight)
    let cssW = window.innerWidth
    let cssH = window.innerHeight

    const onScroll = () => { lastScrollTime = Date.now() }

    const rebuild = () => {
      const dpr  = window.devicePixelRatio || 1
      cssW = window.innerWidth
      cssH = window.innerHeight
      canvas.width  = cssW * dpr
      canvas.height = cssH * dpr
      canvas.style.width  = `${cssW}px`
      canvas.style.height = `${cssH}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      pathData  = buildPathData(cssW)
      maxScroll = Math.max(1, document.body.scrollHeight - cssH)

      const progress = Math.min(1, window.scrollY / maxScroll)
      const [ix, iy] = samplePath(pathData.waypoints, progress)
      cloudX = ix
      cloudY = iy

      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(draw)
    }

    const isInSection = (pageY: number): boolean =>
      pathData.sectionBounds.some(b => pageY >= b.top && pageY <= b.bottom)

    const draw = () => {
      if (document.hidden) {
        raf = requestAnimationFrame(draw)
        return
      }

      const frozen = Date.now() - lastScrollTime > FREEZE_DELAY_MS

      if (!frozen) {
        const currentScrollY = window.scrollY
        const rawVelocity    = Math.max(-200, Math.min(200, currentScrollY - lastScrollY))
        velocity             = velocity + (rawVelocity - velocity) * 0.15
        lastScrollY          = currentScrollY

        const progress = Math.min(1, currentScrollY / maxScroll)
        const [tx, ty] = samplePath(pathData.waypoints, progress)

        cloudX += (tx - cloudX) * 0.08
        cloudY += (ty - cloudY) * 0.08

        // Zone detection: between sections = bloom, inside section = contract
        const inSection     = isInSection(cloudY)
        const targetRadius  = inSection ? CONFIG.cloudRadius * 0.5 : CONFIG.cloudRadius * 1.6
        const targetOpacity = inSection ? CONFIG.opacity * 0.25    : CONFIG.opacity
        displayRadius  += (targetRadius  - displayRadius)  * 0.06
        displayOpacity += (targetOpacity - displayOpacity) * 0.06
      } else {
        velocity = 0
      }

      ctx.clearRect(0, 0, cssW, cssH)

      const now     = performance.now()
      const screenY = cloudY - window.scrollY
      // Max drift radius scales with cloud size so sparks stay proportional
      const maxDrift = displayRadius * 0.45
      // Velocity stretch: elongate cloud in scroll direction
      const stretch  = 1 + Math.min(Math.abs(velocity) * 0.012, 0.5)

      dots.forEach(dot => {
        // --- Spark drift: random walk with slight upward bias + spring ---
        dot.vx += (Math.random() - 0.5) * 0.9
        dot.vy += (Math.random() - 0.5) * 0.9 - 0.12   // upward bias
        dot.vx *= 0.90
        dot.vy *= 0.90
        // Soft spring back toward (0,0) so sparks don't escape the cloud
        dot.vx -= dot.driftX * 0.018
        dot.vy -= dot.driftY * 0.018
        dot.driftX += dot.vx
        dot.driftY += dot.vy
        // Clamp to max drift radius
        const driftMag = Math.sqrt(dot.driftX * dot.driftX + dot.driftY * dot.driftY)
        if (driftMag > maxDrift) {
          dot.driftX *= maxDrift / driftMag
          dot.driftY *= maxDrift / driftMag
        }

        // Time-based pulse — always runs, even when frozen
        const pulse = 1 + 0.25 * Math.sin(now * 0.0008 + dot.phase)

        const r  = dot.dist * displayRadius * pulse
        const dx = Math.cos(dot.angle) * r + dot.driftX
        const dy = Math.sin(dot.angle) * r * stretch + dot.driftY
        const x  = cloudX  + dx
        const y  = screenY + dy

        const distOpacity = displayOpacity * (1 - dot.dist * 0.75)
        drawDot(ctx, x, y, dot.radius, distOpacity, displayRadius)
      })

      raf = requestAnimationFrame(draw)
    }

    rebuild()
    window.addEventListener('scroll', onScroll, { passive: true })

    const ro = new ResizeObserver(rebuild)
    ro.observe(document.documentElement)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
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
