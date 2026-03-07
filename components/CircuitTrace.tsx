'use client'

import { useScroll, useTransform, motion } from 'framer-motion'

// Unpredictable PCB trace with varying run lengths and directions
// ViewBox: 0 0 260 1000
const TRACE_PATH =
  'M 30 0 L 30 90 L 200 90 L 200 190 L 80 190 L 80 310 L 210 310 L 210 390 L 50 390 L 50 500 L 175 500 L 175 620 L 35 620 L 35 730 L 195 730 L 195 850 L 65 850 L 65 940 L 185 940 L 185 1000'

const VIAS: [number, number][] = [
  [30, 90], [200, 90],
  [200, 190], [80, 190],
  [80, 310], [210, 310],
  [210, 390], [50, 390],
  [50, 500], [175, 500],
  [175, 620], [35, 620],
  [35, 730], [195, 730],
  [195, 850], [65, 850],
  [65, 940], [185, 940],
]

// Inductor coil on horizontal segment y=90, x=100→145
// 4 upward bumps, each 10px wide
const INDUCTOR_PATH = 'M 100 90 Q 105 82 110 90 Q 115 82 120 90 Q 125 82 130 90 Q 135 82 140 90'

// Resistor rectangle on horizontal segment y=390, x=118→158
// rect drawn as path so we can animate it
const RESISTOR_PATH = 'M 118 384 L 158 384 L 158 396 L 118 396 Z'

// Capacitor plates on vertical segment x=175, y=548→572
// Two horizontal lines with a gap
const CAP_PLATE_TOP = 'M 163 548 L 187 548'
const CAP_PLATE_BOT = 'M 163 572 L 187 572'

export default function CircuitTrace() {
  const { scrollYProgress } = useScroll()
  const pathLength = useTransform(scrollYProgress, [0, 0.95], [0, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.03], [0, 1])

  return (
    <div
      className="fixed left-0 top-0 bottom-0 hidden lg:block pointer-events-none -z-10"
      style={{ width: '260px' }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 260 1000"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="trace-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ghost vias — faintly visible before scroll */}
        {VIAS.map(([cx, cy], i) => (
          <circle
            key={`ghost-${i}`}
            cx={cx}
            cy={cy}
            r={4}
            fill="none"
            stroke="#00d4ff"
            strokeWidth="1"
            opacity={0.06}
          />
        ))}

        {/* Main trace */}
        <motion.path
          d={TRACE_PATH}
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
          style={{ pathLength, opacity }}
          filter="url(#trace-glow)"
        />

        {/* ── Inductor (coil bumps on y=90 horizontal) ── */}
        {/* Mask straight trace underneath */}
        <motion.rect x={98} y={86} width={44} height={8} fill="#0a0a0a" style={{ opacity }} />
        <motion.path
          d={INDUCTOR_PATH}
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ opacity }}
          filter="url(#trace-glow)"
        />

        {/* ── Resistor (IEC rectangle on y=390 horizontal) ── */}
        {/* Mask trace inside rect */}
        <motion.rect x={120} y={386} width={36} height={8} fill="#0a0a0a" style={{ opacity }} />
        <motion.path
          d={RESISTOR_PATH}
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1.5"
          strokeLinejoin="miter"
          style={{ opacity }}
          filter="url(#trace-glow)"
        />

        {/* ── Capacitor (plates on x=175 vertical) ── */}
        {/* Mask trace between plates */}
        <motion.rect x={172} y={548} width={6} height={25} fill="#0a0a0a" style={{ opacity }} />
        <motion.path
          d={CAP_PLATE_TOP}
          stroke="#00d4ff"
          strokeWidth="2"
          strokeLinecap="square"
          style={{ opacity }}
          filter="url(#trace-glow)"
        />
        <motion.path
          d={CAP_PLATE_BOT}
          stroke="#00d4ff"
          strokeWidth="2"
          strokeLinecap="square"
          style={{ opacity }}
          filter="url(#trace-glow)"
        />

        {/* Lit vias — appear as trace is drawn */}
        {VIAS.map(([cx, cy], i) => (
          <motion.circle
            key={`lit-${i}`}
            cx={cx}
            cy={cy}
            r={4}
            fill="#00d4ff"
            fillOpacity={0.25}
            stroke="#00d4ff"
            strokeWidth="1.5"
            style={{ opacity }}
            filter="url(#trace-glow)"
          />
        ))}
      </svg>
    </div>
  )
}
