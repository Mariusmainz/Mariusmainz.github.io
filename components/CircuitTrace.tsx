'use client'

import { useEffect, useRef } from 'react'

export const CONFIG = {
  dotCount:    100,
  opacity:     0.7,
  cloudRadius: 120,
  glowSize:    3,
}

const SECTION_IDS = ['hero', 'about', 'experience', 'projects', 'skills', 'contact'] as const

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
    const edgeX = i % 2 === 0 ? vw * 0.10 : vw * 0.90
    waypoints.push([edgeX, top + (bottom - top) * 0.5])
    const nextEl = els[i + 1]
    if (nextEl) {
      const nRect   = nextEl.getBoundingClientRect()
      const nextTop = nRect.top + window.scrollY
      if (nextTop > bottom + 20) {
        waypoints.push([vw * 0.5, bottom + (nextTop - bottom) * 0.5])
      }
    }
  })

  waypoints.push([vw * 0.5, document.body.scrollHeight])
  return { waypoints, sectionBounds }
}

interface Dot {
  angle:  number   // fixed angle from cloud center
  dist:   number   // 0–1 fraction of cloudRadius
  radius: number   // dot radius in px
  phase:  number   // random offset for pulse sin
}

function initDots(): Dot[] {
  return Array.from({ length: CONFIG.dotCount }, () => ({
    angle:  Math.random() * Math.PI * 2,
    dist:   Math.random(),
    radius: 1.5 + Math.random() * 1.0,
    phase:  Math.random() * Math.PI * 2,
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

    let cloudX         = 0
    let cloudY         = 0
    // eslint-disable-next-line prefer-const
    let displayRadius  = CONFIG.cloudRadius
    // eslint-disable-next-line prefer-const
    let displayOpacity = CONFIG.opacity

    const rebuild = () => {
      const dpr  = window.devicePixelRatio || 1
      const cssW = window.innerWidth
      const cssH = window.innerHeight
      canvas.width  = cssW * dpr
      canvas.height = cssH * dpr
      canvas.style.width  = `${cssW}px`
      canvas.style.height = `${cssH}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      pathData = buildPathData(cssW)

      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight)
      const progress  = Math.min(1, window.scrollY / maxScroll)
      const [ix, iy]  = samplePath(pathData.waypoints, progress)
      cloudX = ix
      cloudY = iy

      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(draw)
    }

    const draw = () => {
      const { waypoints } = pathData
      const scrollY   = window.scrollY
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight)
      const progress  = Math.min(1, scrollY / maxScroll)
      const [tx, ty]  = samplePath(waypoints, progress)

      cloudX += (tx - cloudX) * 0.08
      cloudY += (ty - cloudY) * 0.08

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      const screenY = cloudY - scrollY

      dots.forEach(dot => {
        const r  = dot.dist * displayRadius
        const dx = Math.cos(dot.angle) * r
        const dy = Math.sin(dot.angle) * r
        const x  = cloudX  + dx
        const y  = screenY + dy
        const distOpacity = displayOpacity * (1 - dot.dist * 0.75)
        drawDot(ctx, x, y, dot.radius, distOpacity, displayRadius)
      })

      raf = requestAnimationFrame(draw)
    }

    rebuild()

    // ResizeObserver on documentElement (not body) — avoids loop from canvas resize
    const ro = new ResizeObserver(rebuild)
    ro.observe(document.documentElement)

    return () => {
      cancelAnimationFrame(raf)
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
