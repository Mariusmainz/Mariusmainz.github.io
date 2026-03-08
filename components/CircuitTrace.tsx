'use client'

import { useEffect, useRef, useState } from 'react'

const SECTION_IDS = ['hero', 'about', 'experience', 'projects', 'skills', 'contact'] as const

interface SectionBounds { top: number; mid: number; bottom: number }

function buildTrace(w: number, h: number, secs: Partial<Record<string, SectionBounds>>) {
  const lx = 48
  const rx = w - 48
  const nodes: { id: string; x: number; y: number }[] = []
  const parts: string[] = [`M ${lx} 0`]

  SECTION_IDS.forEach((id, i) => {
    const isLeft = i % 2 === 0
    const x = isLeft ? lx : rx
    const sec = secs[id]

    if (i > 0) {
      const prev = secs[SECTION_IDS[i - 1]]
      const crossY = sec && prev
        ? Math.round((prev.bottom + sec.top) / 2)
        : Math.round(h * ([0.22, 0.38, 0.54, 0.69, 0.83][i - 1] ?? 0.5))
      const fromX = (i - 1) % 2 === 0 ? lx : rx
      parts.push(`L ${fromX} ${crossY}`, `L ${x} ${crossY}`)
    }

    const nodeY = sec
      ? Math.round(sec.mid)
      : Math.round(h * ([0.15, 0.30, 0.46, 0.62, 0.77, 0.91][i] ?? 0.5))
    parts.push(`L ${x} ${nodeY}`)
    nodes.push({ id, x, y: nodeY })
  })

  const lastX = (SECTION_IDS.length - 1) % 2 === 0 ? lx : rx
  parts.push(`L ${lastX} ${h}`)

  return { path: parts.join(' '), nodes }
}

export default function CircuitTrace() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null)
  const [sections, setSections] = useState<Partial<Record<string, SectionBounds>>>({})
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    const measure = () => {
      const svg = svgRef.current
      if (!svg) return
      const w = svg.clientWidth
      const h = svg.clientHeight
      if (!w || !h) return

      const newSections: Partial<Record<string, SectionBounds>> = {}
      SECTION_IDS.forEach(id => {
        const el = document.getElementById(id)
        if (!el) return
        const rect = el.getBoundingClientRect()
        newSections[id] = {
          top:    rect.top + window.scrollY,
          mid:    rect.top + window.scrollY + rect.height / 2,
          bottom: rect.top + window.scrollY + rect.height,
        }
      })

      setDims({ w, h })
      setSections(newSections)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.25 },
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const { path: tracePath, nodes } = dims
    ? buildTrace(dims.w, dims.h, sections)
    : { path: '', nodes: [] as { id: string; x: number; y: number }[] }

  return (
    // Outside main (z-10), so main's entire stacking context renders above this
    <div
      className="absolute inset-0 pointer-events-none z-0 hidden xl:block"
      style={{ willChange: 'transform' }}
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        viewBox={dims ? `0 0 ${dims.w} ${dims.h}` : undefined}
        className="w-full h-full"
      >
        {dims && tracePath && (
          <>
            {/* Static trace */}
            <path
              d={tracePath}
              fill="none"
              stroke="#00d4ff"
              strokeWidth="1.5"
              opacity={0.15}
              strokeLinecap="square"
              strokeLinejoin="miter"
            />

            {/* Section nodes */}
            {nodes.filter(node => node.id !== 'experience').map(node => {
              const isActive = activeSection === node.id
              return (
                <circle
                  key={node.id}
                  cx={node.x}
                  cy={node.y}
                  r={isActive ? 5 : 3.5}
                  fill="#00d4ff"
                  stroke="#00d4ff"
                  strokeWidth="1.5"
                  style={{
                    fillOpacity:   isActive ? 0.5  : 0.1,
                    strokeOpacity: isActive ? 0.85 : 0.3,
                    transition: 'fill-opacity 0.4s ease, stroke-opacity 0.4s ease',
                  }}
                />
              )
            })}
          </>
        )}
      </svg>
    </div>
  )
}
