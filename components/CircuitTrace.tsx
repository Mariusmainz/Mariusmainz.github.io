'use client'

import { useEffect, useRef } from 'react'

export const CONFIG = {
  dotCount:      160,
  opacity:       0.65,
  cloudRadius:   175,
}

const SECTION_IDS     = ['hero', 'about', 'experience', 'projects', 'skills', 'contact'] as const
const FREEZE_DELAY_MS = 80
const MAX_SPARK_AGE   = 160
const CURSOR_RADIUS   = 170   // px — magnetic pull range
const CURSOR_STRENGTH = 0.20  // max velocity added per frame toward cursor

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

    const edgeXFrac = i % 2 === 0
      ? 0.08 + Math.abs(Math.sin(i * 1.7)) * 0.09
      : 0.92 - Math.abs(Math.sin(i * 1.7)) * 0.09
    waypoints.push([vw * edgeXFrac, top + (bottom - top) * 0.5])

    const nextEl = els[i + 1]
    if (nextEl) {
      const nRect   = nextEl.getBoundingClientRect()
      const nextTop = nRect.top + window.scrollY
      const gapLen  = nextTop - bottom
      if (gapLen > 20) {
        waypoints.push([
          vw * (0.5 + Math.sin(i * 2.3 + 1.0) * 0.28),
          bottom + gapLen * 0.35,
        ])
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
  angle:     number   // orbital angle
  dist:      number   // 0–1 fraction of cloud radius
  radius:    number   // base dot radius in px
  phase:     number   // per-dot phase offset
  driftX:    number   // accumulated drift x
  driftY:    number   // accumulated drift y
  vx:        number
  vy:        number
  sparkMode: boolean
  sparkAge:  number
}

function initDots(): Dot[] {
  return Array.from({ length: CONFIG.dotCount }, () => {
    // Bimodal distribution: tight inner cluster + sparse outer halo
    const isInner = Math.random() < 0.62
    const dist    = isInner
      ? Math.random() * Math.random() * 0.88   // concentrated near center
      : 0.45 + Math.random() * 0.55            // sparse outer halo
    return {
      angle:     Math.random() * Math.PI * 2,
      dist:      Math.min(1, dist),
      radius:    isInner ? 1.0 + Math.random() * 1.8 : 0.5 + Math.random() * 0.9,
      phase:     Math.random() * Math.PI * 2,
      driftX:    0,
      driftY:    0,
      vx:        (Math.random() - 0.5) * 0.12,
      vy:        (Math.random() - 0.5) * 0.12,
      sparkMode: false,
      sparkAge:  0,
    }
  })
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

    let raf      = 0
    let pathData: PathData = { waypoints: [], sectionBounds: [] }
    const dots   = initDots()

    // Cloud position in screen (viewport) coordinates
    let cloudX         = 0
    let cloudSY        = 0
    let displayRadius  = CONFIG.cloudRadius
    let displayOpacity = CONFIG.opacity

    // Scroll state
    let lastScrollY    = window.scrollY
    let velocity       = 0
    let lastScrollTime = 0
    let maxScroll      = Math.max(1, document.body.scrollHeight - window.innerHeight)
    let cssW = window.innerWidth
    let cssH = window.innerHeight

    // Cursor position in viewport coords (-9999 = off-screen / inactive)
    let mouseX = -9999
    let mouseY = -9999

    const onScroll    = () => { lastScrollTime = Date.now() }
    const onMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY }
    const onMouseOut  = () => { mouseX = -9999; mouseY = -9999 }

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
      cloudX  = ix
      cloudSY = iy - window.scrollY

      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(draw)
    }

    const draw = () => {
      if (document.hidden) {
        raf = requestAnimationFrame(draw)
        return
      }

      const frozen = Date.now() - lastScrollTime > FREEZE_DELAY_MS

      if (!frozen) {
        const currentScrollY = window.scrollY
        const rawVelocity    = Math.max(-200, Math.min(200, currentScrollY - lastScrollY))
        velocity             = velocity + (rawVelocity - velocity) * 0.12
        lastScrollY          = currentScrollY

        const progress = Math.min(1, currentScrollY / maxScroll)
        const [tx, ty] = samplePath(pathData.waypoints, progress)

        // Cloud tracks in screen coords — stays in viewport regardless of scroll speed
        const targetSY = ty - currentScrollY
        cloudX  += (tx      - cloudX)  * 0.025
        cloudSY += (targetSY - cloudSY) * 0.025

        // Zone: contract at edges (sections), bloom near center (gaps between sections)
        const atEdge        = Math.abs(tx - cssW * 0.5) > cssW * 0.32
        const targetRadius  = atEdge ? CONFIG.cloudRadius * 0.55 : CONFIG.cloudRadius * 1.5
        const targetOpacity = atEdge ? CONFIG.opacity * 0.28     : CONFIG.opacity
        displayRadius  += (targetRadius  - displayRadius)  * 0.025
        displayOpacity += (targetOpacity - displayOpacity) * 0.025
      } else {
        velocity = 0
      }

      ctx.clearRect(0, 0, cssW, cssH)

      const now = performance.now()

      // Slow breathing size oscillation
      const radiusOsc  = 1 + 0.18 * Math.sin(now * 0.00018)
      const effectiveR = displayRadius * radiusOsc
      const maxDrift   = effectiveR * 0.40

      // Velocity stretch — elongates cloud in scroll direction
      const stretch = 1 + Math.min(Math.abs(velocity) * 0.010, 0.45)

      // Slow atmospheric wave — "wind through mist"
      const wt      = now * 0.00010
      const windAmp = effectiveR * 0.06   // 6% of cloud radius

      dots.forEach(dot => {
        // Subtle global pulse — all dots breathe together at their own phase
        const pulse     = 1 + 0.15 * Math.sin(now * 0.0005 + dot.phase)
        // Per-dot radius breathes slowly and independently
        const dotRadius = Math.max(0.4,
          dot.radius * (1 + 0.28 * Math.sin(now * 0.00020 + dot.phase * 1.6)),
        )

        if (dot.sparkMode) {
          // Ember spark: graceful slow flight, fade to nothing
          dot.vx     *= 0.97
          dot.vy     *= 0.97
          dot.driftX += dot.vx
          dot.driftY += dot.vy
          dot.sparkAge++

          const sparkOpacity = displayOpacity * 0.60 * (1 - dot.sparkAge / MAX_SPARK_AGE)
          const r  = dot.dist * effectiveR * pulse
          const x  = cloudX  + Math.cos(dot.angle) * r + dot.driftX
          const y  = cloudSY + Math.sin(dot.angle) * r * stretch + dot.driftY
          drawDot(ctx, x, y, Math.max(0.4, dotRadius * 0.45), sparkOpacity)

          if (dot.sparkAge >= MAX_SPARK_AGE) {
            dot.sparkMode = false
            dot.sparkAge  = 0
            dot.driftX    = 0
            dot.driftY    = 0
            dot.vx        = (Math.random() - 0.5) * 0.12
            dot.vy        = (Math.random() - 0.5) * 0.12
          }
        } else {
          // --- Calm atmospheric drift ---
          // Very gentle random nudge — slow, smooth, premium
          dot.vx += (Math.random() - 0.5) * 0.08
          dot.vy += (Math.random() - 0.5) * 0.08 - 0.006   // faint upward drift
          // Strong damping for smooth deceleration
          dot.vx *= 0.95
          dot.vy *= 0.95
          // Gentle spring — each dot has a limited movement radius
          dot.vx -= dot.driftX * 0.004
          dot.vy -= dot.driftY * 0.004

          // --- Cursor magnetic pull (soft, restrained) ---
          const approxX = cloudX  + Math.cos(dot.angle) * dot.dist * effectiveR + dot.driftX
          const approxY = cloudSY + Math.sin(dot.angle) * dot.dist * effectiveR + dot.driftY
          const cdx     = mouseX - approxX
          const cdy     = mouseY - approxY
          const cdist2  = cdx * cdx + cdy * cdy
          if (cdist2 < CURSOR_RADIUS * CURSOR_RADIUS && cdist2 > 0.01) {
            const cdist = Math.sqrt(cdist2)
            const t     = 1 - cdist / CURSOR_RADIUS
            const pull  = t * t * CURSOR_STRENGTH   // quadratic falloff — soft near edge
            dot.vx += (cdx / cdist) * pull
            dot.vy += (cdy / cdist) * pull
          }

          dot.driftX += dot.vx
          dot.driftY += dot.vy

          // Soft clamp — limited drift radius per particle
          const driftMag = Math.sqrt(dot.driftX * dot.driftX + dot.driftY * dot.driftY)
          if (driftMag > maxDrift) {
            dot.driftX *= maxDrift / driftMag
            dot.driftY *= maxDrift / driftMag
          }

          // Sparse ember sparks — rare enough to feel intentional, not chaotic
          if (displayOpacity > 0.38 && Math.random() < 0.00022) {
            dot.sparkMode = true
            dot.sparkAge  = 0
            const launchAngle = dot.angle + (Math.random() - 0.5) * 0.5
            const speed       = 0.7 + Math.random() * 1.4   // slow, graceful
            dot.vx = Math.cos(launchAngle) * speed
            dot.vy = Math.sin(launchAngle) * speed - 0.35   // slight upward
          }

          // Slow wave undulation — ripple that sweeps through the cloud
          const windX = Math.sin(wt + dot.angle * 0.75) * windAmp
          const windY = Math.cos(wt * 0.71 + dot.angle * 1.15) * windAmp * 0.5

          const r  = dot.dist * effectiveR * pulse
          const dx = Math.cos(dot.angle) * r + dot.driftX + windX
          const dy = Math.sin(dot.angle) * r * stretch + dot.driftY + windY
          const x  = cloudX  + dx
          const y  = cloudSY + dy

          const distOpacity = displayOpacity * (1 - dot.dist * 0.58)
          drawDot(ctx, x, y, dotRadius, distOpacity)
        }
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
