'use client'

import { useScroll, useTransform, motion } from 'framer-motion'

// PCB-style trace: right-angle turns down the left side of the viewport
// ViewBox: 0 0 260 1000
const TRACE_PATH =
  'M 40 0 L 40 100 L 180 100 L 180 220 L 60 220 L 60 360 L 200 360 L 200 490 L 50 490 L 50 630 L 190 630 L 190 760 L 70 760 L 70 900 L 210 900 L 210 1000'

const VIAS: [number, number][] = [
  [40, 100], [180, 100],
  [180, 220], [60, 220],
  [60, 360], [200, 360],
  [200, 490], [50, 490],
  [50, 630], [190, 630],
  [190, 760], [70, 760],
  [70, 900], [210, 900],
]

export default function CircuitTrace() {
  const { scrollYProgress } = useScroll()
  const pathLength = useTransform(scrollYProgress, [0, 0.95], [0, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.03], [0, 1])

  return (
    <div
      className="fixed left-0 top-0 bottom-0 hidden lg:block pointer-events-none z-0"
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

        {/* Drawn trace */}
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
