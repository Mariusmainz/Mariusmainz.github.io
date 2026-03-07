# Portfolio Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a dark minimal single-page portfolio + CV website for Marius Mainz Elkjær, exported as static files and deployed to GitHub Pages.

**Architecture:** Next.js 14 single-page app with `output: 'export'`. All content in `data/portfolio.ts`. Sections scroll into view with Framer Motion animations. Project details open in a slide-in drawer.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, GitHub Actions

---

## Prerequisites

Before starting, install Node.js (v18+). Verify with `node -v`.

---

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`

**Step 1: Scaffold Next.js app**

Run from repo root:
```bash
npx create-next-app@14 . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```
Answer prompts: accept all defaults. This overwrites `README.md` — that's fine.

**Step 2: Install Framer Motion**

```bash
npm install framer-motion
```

**Step 3: Install JetBrains Mono font package**

```bash
npm install @fontsource/jetbrains-mono
```

**Step 4: Configure static export**

Open `next.config.ts` and replace its content with:
```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '',
}

export default nextConfig
```

**Step 5: Verify build works**

```bash
npm run build
```
Expected: `out/` directory created, no errors.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js 14 project with Tailwind and Framer Motion"
```

---

### Task 2: Global Styles and Fonts

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**Step 1: Replace `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import '@fontsource/jetbrains-mono/400.css';
@import '@fontsource/jetbrains-mono/700.css';

:root {
  --accent: #00d4ff;
  --bg: #0a0a0a;
  --surface: #111111;
  --border: #1f1f1f;
  --text: #e5e5e5;
  --muted: #6b7280;
}

html {
  scroll-behavior: smooth;
  background-color: var(--bg);
  color: var(--text);
}

body {
  font-family: 'Inter', 'Geist', sans-serif;
  background-color: var(--bg);
}

.font-mono {
  font-family: 'JetBrains Mono', monospace;
}

::selection {
  background: var(--accent);
  color: #000;
}

::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: var(--bg);
}
::-webkit-scrollbar-thumb {
  background: var(--accent);
  border-radius: 2px;
}
```

**Step 2: Replace `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Marius Mainz Elkjær',
  description: 'MSc Electrical Engineering · IC Design',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

**Step 3: Update `tailwind.config.ts`** to add accent color and mono font:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#00d4ff',
        bg: '#0a0a0a',
        surface: '#111111',
        border: '#1f1f1f',
        muted: '#6b7280',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
```

**Step 4: Verify build**

```bash
npm run build
```
Expected: no errors.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: configure global styles, fonts, and Tailwind theme"
```

---

### Task 3: Content Data File

**Files:**
- Create: `data/portfolio.ts`

**Step 1: Create `data/portfolio.ts`**

```ts
export const personal = {
  name: 'Marius Mainz Elkjær',
  title: 'MSc Student · Electrical Engineering',
  tagline: 'IC design, embedded systems, and hardware-aware software.',
  email: 'Marius.mainze@gmail.com',
  phone: '+45 61 69 37 83',
  location: 'Copenhagen, Denmark',
  linkedin: 'https://www.linkedin.com/in/marius-mainz-elkjær-60664822b',
  cvPath: '/Resources/CV_english_mme.pdf',
  photoPath: '/Resources/photo_mme.jpg',
  about: `Electrical engineering student specializing in IC design. Experienced in designing, simulating, and testing electronic systems, with a strong foundation in circuit analysis and hardware-aware software development. Four years of experience in professional engineering teams, with a strong interest in startup environments.`,
}

export const experience = [
  {
    id: 'ic-optimize',
    role: 'Student Assistant',
    company: 'IC Optimize',
    location: 'Kongens Lyngby',
    period: 'Jul 2025 – Present',
    description: 'Analog IC design, software development and testing.',
  },
  {
    id: 'pascal',
    role: 'Student Assistant',
    company: 'Pascal A/S',
    location: 'Herlev',
    period: 'Mar 2022 – Jul 2025',
    description: 'Led automated audio testing of class D amplifiers. Focus in software R&D with occasional hardware design tasks.',
  },
  {
    id: 'kite',
    role: 'Shop Manager',
    company: 'KiteDanmark',
    location: 'Copenhagen',
    period: '2019 – 2022',
    description: 'Managed shop operations.',
  },
  {
    id: 'avis',
    role: 'Car Rental Agent',
    company: 'Avis Budget Group',
    location: 'Copenhagen',
    period: 'May 2017 – Jun 2018',
    description: 'Customer service and vehicle fleet management.',
  },
]

export const education = [
  {
    id: 'dtu-msc',
    degree: "Master's Degree",
    field: 'Electrical Engineering (IC Design)',
    institution: 'DTU',
    period: '2024 – Present',
  },
  {
    id: 'hkust',
    degree: 'Study Exchange',
    field: 'IC Design Engineering',
    institution: 'HKUST',
    period: 'Sep 2025 – Dec 2025',
  },
  {
    id: 'dtu-bsc',
    degree: "Bachelor's Degree",
    field: 'Electrical Engineering',
    institution: 'DTU',
    period: '2020 – 2023',
  },
]

export const projects = [
  {
    id: 'audio-test',
    title: 'Automated Audio Test Setup',
    shortDescription: 'Fully automated test system for class D audio amplifiers.',
    tags: ['Python', 'Robot Framework', 'APx', 'Test Automation'],
    detail: 'Fully automated audio test setup mainly written in Python, used for production and R&D testing of class D amplifiers at Pascal A/S.',
    type: 'professional',
  },
  {
    id: 'pcb-gpio',
    title: 'GPIO Test PCB',
    shortDescription: 'PCB design for automated GPIO testing circuit.',
    tags: ['KiCAD', 'PCB Design', 'Hardware'],
    detail: 'Designed a custom PCB for automated GPIO functional testing, integrating with the Python test framework.',
    type: 'professional',
  },
  {
    id: 'openroad',
    title: 'Autonomous Digital Integration (OpenROAD)',
    shortDescription: 'Autonomous integration of digital blocks using OpenROAD Flow Scripts.',
    tags: ['Cadence', 'ORFS', 'IC Design', 'PDK'],
    detail: 'Autonomous integration of digital blocks in Cadence using OpenROAD Flow Scripts with a closed PDK for DTU.',
    type: 'professional',
  },
  {
    id: 'skill-gui',
    title: 'SKILL GUI for Virtuoso',
    shortDescription: 'Frontend SKILL GUI for Cadence Virtuoso.',
    tags: ['SKILL', 'Cadence', 'Virtuoso'],
    detail: 'Built a frontend GUI using the SKILL scripting language inside Cadence Virtuoso to streamline IC design workflows at IC Optimize.',
    type: 'professional',
  },
  {
    id: 'result-viewer',
    title: 'Result Viewer – IC Optimize OPUS',
    shortDescription: 'Application for viewing IC simulation results.',
    tags: ['Software', 'IC Design', 'Tooling'],
    detail: 'Result viewer application for IC Optimize OPUS, enabling engineers to visualize and compare simulation outputs efficiently.',
    type: 'professional',
  },
  {
    id: 'liquid-container',
    title: 'Automated Liquid Container',
    shortDescription: 'Embedded system with DC motors, sensors, and timer.',
    tags: ['Embedded', 'C', 'Sensors', 'DC Motors'],
    detail: 'Automated liquid container with DC motors, internal timer, sensors, and a trigger mechanism. Built as a personal embedded systems project.',
    type: 'personal',
  },
  {
    id: 'engagement-circuit',
    title: 'Engagement Feedback Circuit',
    shortDescription: 'LCD display circuit with cloud control.',
    tags: ['Embedded', 'IoT', 'LCD', 'Cloud'],
    detail: 'Engagement feedback circuit with LCD display and cloud control interface.',
    type: 'personal',
  },
  {
    id: 'thesis',
    title: 'Bachelor Thesis: Loudspeaker Protection',
    shortDescription: 'Dynamic DSP filters for loudspeaker protection.',
    tags: ['DSP', 'MATLAB', 'Audio', 'Thesis'],
    detail: '"Protection Algorithms for Loudspeakers": Investigation of dynamic filters for mechanical and thermal protection of loudspeakers using DSP.',
    type: 'personal',
  },
]

export const skills = {
  'Embedded & Hardware': ['Embedded Systems', 'PCB Design', 'FPGA', 'Circuit Analysis', 'Analog IC Design'],
  'Software & Tools': ['Python', 'C', 'C++', 'MATLAB', 'Robot Framework', 'Test Automation'],
  'EDA & CAD': ['Cadence', 'KiCAD', 'LTSpice', 'Xilinx Vivado', 'Quartus', 'ORFS', 'APx', 'OMNeT++'],
}
```

**Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

**Step 3: Commit**

```bash
git add data/portfolio.ts
git commit -m "feat: add content data file"
```

---

### Task 4: Navigation Component

**Files:**
- Create: `components/Nav.tsx`

**Step 1: Create `components/Nav.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const sections = ['About', 'Experience', 'Projects', 'Skills', 'Contact']

export default function Nav() {
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    sections.forEach((s) => {
      const el = document.getElementById(s.toLowerCase())
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(s.toLowerCase()) },
        { threshold: 0.4 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-bg/80 backdrop-blur border-b border-border"
    >
      <span className="font-mono text-accent text-sm tracking-widest uppercase">MME</span>

      {/* Desktop */}
      <div className="hidden md:flex gap-6">
        {sections.map((s) => (
          <button
            key={s}
            onClick={() => scrollTo(s.toLowerCase())}
            className={`font-mono text-xs uppercase tracking-widest transition-colors ${
              active === s.toLowerCase() ? 'text-accent' : 'text-muted hover:text-text'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Mobile hamburger */}
      <button className="md:hidden text-muted" onClick={() => setMenuOpen(!menuOpen)}>
        <span className="font-mono text-sm">{menuOpen ? '✕' : '☰'}</span>
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-surface border-b border-border flex flex-col py-4"
        >
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => scrollTo(s.toLowerCase())}
              className="font-mono text-xs uppercase tracking-widest text-muted hover:text-accent py-3 px-6 text-left"
            >
              {s}
            </button>
          ))}
        </motion.div>
      )}
    </motion.nav>
  )
}
```

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: no errors.

**Step 3: Commit**

```bash
git add components/Nav.tsx
git commit -m "feat: add sticky navigation component"
```

---

### Task 5: Hero Section

**Files:**
- Create: `components/Hero.tsx`

**Step 1: Create `components/Hero.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import { personal } from '@/data/portfolio'

export default function Hero() {
  const scrollToProjects = () =>
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background dots */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, #00d4ff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/0 via-bg/50 to-bg" />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-mono text-accent text-sm tracking-[0.3em] uppercase mb-4"
        >
          — Portfolio
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-5xl md:text-7xl font-bold text-text mb-4 tracking-tight"
        >
          {personal.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="font-mono text-accent text-base md:text-lg mb-4"
        >
          {personal.title}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="text-muted text-lg mb-10"
        >
          {personal.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <button
            onClick={scrollToProjects}
            className="px-6 py-3 bg-accent text-black font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent/80 transition-colors"
          >
            View Projects
          </button>
          <a
            href={personal.cvPath}
            download
            className="px-6 py-3 border border-accent text-accent font-mono text-sm uppercase tracking-widest hover:bg-accent/10 transition-colors"
          >
            Download CV
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-muted text-xs tracking-widest flex flex-col items-center gap-2"
      >
        <span>scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-6 bg-muted"
        />
      </motion.div>
    </section>
  )
}
```

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: add hero section"
```

---

### Task 6: About Section

**Files:**
- Create: `components/About.tsx`
- Create: `components/FadeIn.tsx` (reusable scroll animation wrapper)

**Step 1: Create `components/FadeIn.tsx`**

```tsx
'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

**Step 2: Create `components/About.tsx`**

```tsx
import Image from 'next/image'
import FadeIn from './FadeIn'
import { personal } from '@/data/portfolio'

export default function About() {
  return (
    <section id="about" className="py-32 px-6 max-w-5xl mx-auto">
      <FadeIn>
        <p className="font-mono text-accent text-xs tracking-[0.3em] uppercase mb-2">01 /</p>
        <h2 className="text-3xl md:text-4xl font-bold text-text mb-16">About</h2>
      </FadeIn>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <FadeIn delay={0.1}>
          <div className="relative aspect-[3/4] max-w-sm overflow-hidden border border-border">
            <Image
              src={personal.photoPath}
              alt={personal.name}
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute inset-0 border-2 border-accent/20" />
          </div>
        </FadeIn>

        <FadeIn delay={0.2} className="flex flex-col gap-6">
          <p className="text-text/80 leading-relaxed text-lg">{personal.about}</p>

          <div className="flex flex-col gap-2 font-mono text-sm">
            <div className="flex gap-3">
              <span className="text-accent">loc</span>
              <span className="text-muted">{personal.location}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-accent">mail</span>
              <a href={`mailto:${personal.email}`} className="text-muted hover:text-accent transition-colors">
                {personal.email}
              </a>
            </div>
            <div className="flex gap-3">
              <span className="text-accent">tel</span>
              <span className="text-muted">{personal.phone}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-accent">li</span>
              <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
```

**Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

**Step 4: Commit**

```bash
git add components/About.tsx components/FadeIn.tsx
git commit -m "feat: add About section and FadeIn utility"
```

---

### Task 7: Experience Section

**Files:**
- Create: `components/Experience.tsx`

**Step 1: Create `components/Experience.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FadeIn from './FadeIn'
import { experience, education } from '@/data/portfolio'

function TimelineItem({
  title,
  subtitle,
  period,
  description,
  index,
}: {
  title: string
  subtitle: string
  period: string
  description: string
  index: number
}) {
  const [open, setOpen] = useState(false)

  return (
    <FadeIn delay={index * 0.08}>
      <div className="relative pl-8 pb-10 border-l border-border last:border-transparent">
        {/* Dot */}
        <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-accent bg-bg" />

        <button
          onClick={() => setOpen(!open)}
          className="text-left w-full group"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-text group-hover:text-accent transition-colors">{title}</p>
              <p className="font-mono text-xs text-accent mt-0.5">{subtitle}</p>
            </div>
            <span className="font-mono text-xs text-muted whitespace-nowrap">{period}</span>
          </div>
        </button>

        <AnimatePresence>
          {open && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-muted text-sm mt-3 leading-relaxed overflow-hidden"
            >
              {description}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </FadeIn>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="py-32 px-6 max-w-5xl mx-auto">
      <FadeIn>
        <p className="font-mono text-accent text-xs tracking-[0.3em] uppercase mb-2">02 /</p>
        <h2 className="text-3xl md:text-4xl font-bold text-text mb-16">Experience</h2>
      </FadeIn>

      <div className="grid md:grid-cols-2 gap-16">
        <div>
          <FadeIn>
            <h3 className="font-mono text-xs text-muted uppercase tracking-widest mb-8">Work</h3>
          </FadeIn>
          {experience.map((e, i) => (
            <TimelineItem
              key={e.id}
              title={e.role}
              subtitle={`${e.company} · ${e.location}`}
              period={e.period}
              description={e.description}
              index={i}
            />
          ))}
        </div>

        <div>
          <FadeIn>
            <h3 className="font-mono text-xs text-muted uppercase tracking-widest mb-8">Education</h3>
          </FadeIn>
          {education.map((e, i) => (
            <TimelineItem
              key={e.id}
              title={e.degree}
              subtitle={`${e.field} · ${e.institution}`}
              period={e.period}
              description={e.field}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add components/Experience.tsx
git commit -m "feat: add Experience section with expandable timeline"
```

---

### Task 8: Projects Section with Drawer

**Files:**
- Create: `components/Projects.tsx`
- Create: `components/ProjectDrawer.tsx`

**Step 1: Create `components/ProjectDrawer.tsx`**

```tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { projects } from '@/data/portfolio'

type Project = (typeof projects)[number]

export default function ProjectDrawer({
  project,
  onClose,
}: {
  project: Project | null
  onClose: () => void
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-surface border-l border-border flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <span className="font-mono text-accent text-xs tracking-widest uppercase">Project</span>
              <button
                onClick={onClose}
                className="font-mono text-muted hover:text-text text-sm transition-colors"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="text-2xl font-bold text-text mb-2">{project.title}</h3>
              <p className="font-mono text-accent text-xs uppercase tracking-widest mb-6">
                {project.type === 'professional' ? 'Professional Project' : 'Personal Project'}
              </p>

              <p className="text-text/80 leading-relaxed mb-8">{project.detail}</p>

              <div>
                <p className="font-mono text-xs text-muted uppercase tracking-widest mb-3">Technologies</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs px-3 py-1 border border-accent/30 text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

**Step 2: Create `components/Projects.tsx`**

```tsx
'use client'

import { useState } from 'react'
import FadeIn from './FadeIn'
import ProjectDrawer from './ProjectDrawer'
import { projects } from '@/data/portfolio'

type Project = (typeof projects)[number]

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null)

  return (
    <section id="projects" className="py-32 px-6 max-w-5xl mx-auto">
      <FadeIn>
        <p className="font-mono text-accent text-xs tracking-[0.3em] uppercase mb-2">03 /</p>
        <h2 className="text-3xl md:text-4xl font-bold text-text mb-16">Projects</h2>
      </FadeIn>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project, i) => (
          <FadeIn key={project.id} delay={i * 0.06}>
            <button
              onClick={() => setSelected(project)}
              className="w-full text-left p-5 border border-border bg-surface hover:border-accent/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="font-mono text-accent text-xs uppercase tracking-widest">
                  {project.type}
                </span>
                <span className="text-muted group-hover:text-accent transition-colors text-sm">↗</span>
              </div>
              <h3 className="font-semibold text-text group-hover:text-accent transition-colors mb-2">
                {project.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-4">{project.shortDescription}</p>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="font-mono text-xs text-muted/60 border border-border px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          </FadeIn>
        ))}
      </div>

      <ProjectDrawer project={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
```

**Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

**Step 4: Commit**

```bash
git add components/Projects.tsx components/ProjectDrawer.tsx
git commit -m "feat: add Projects section with slide-in drawer"
```

---

### Task 9: Skills Section

**Files:**
- Create: `components/Skills.tsx`

**Step 1: Create `components/Skills.tsx`**

```tsx
import FadeIn from './FadeIn'
import { skills } from '@/data/portfolio'

export default function Skills() {
  return (
    <section id="skills" className="py-32 px-6 max-w-5xl mx-auto">
      <FadeIn>
        <p className="font-mono text-accent text-xs tracking-[0.3em] uppercase mb-2">04 /</p>
        <h2 className="text-3xl md:text-4xl font-bold text-text mb-16">Skills</h2>
      </FadeIn>

      <div className="flex flex-col gap-12">
        {Object.entries(skills).map(([category, tags], ci) => (
          <FadeIn key={category} delay={ci * 0.1}>
            <div>
              <p className="font-mono text-xs text-muted uppercase tracking-widest mb-4">{category}</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-sm px-4 py-2 border border-border text-text hover:border-accent hover:text-accent transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
```

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add components/Skills.tsx
git commit -m "feat: add Skills section"
```

---

### Task 10: Contact Section and Footer

**Files:**
- Create: `components/Contact.tsx`

**Step 1: Create `components/Contact.tsx`**

```tsx
import FadeIn from './FadeIn'
import { personal } from '@/data/portfolio'

export default function Contact() {
  return (
    <section id="contact" className="py-32 px-6 max-w-5xl mx-auto">
      <FadeIn>
        <p className="font-mono text-accent text-xs tracking-[0.3em] uppercase mb-2">05 /</p>
        <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">Contact</h2>
        <p className="text-muted text-lg mb-16 max-w-lg">
          Open to opportunities, collaborations, and interesting problems.
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex flex-col gap-4 font-mono">
          <a
            href={`mailto:${personal.email}`}
            className="group flex items-center gap-4 text-text hover:text-accent transition-colors"
          >
            <span className="text-accent text-xs uppercase tracking-widest w-12">mail</span>
            <span className="text-lg group-hover:underline">{personal.email}</span>
          </a>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 text-text hover:text-accent transition-colors"
          >
            <span className="text-accent text-xs uppercase tracking-widest w-12">li</span>
            <span className="text-lg group-hover:underline">LinkedIn</span>
          </a>
          <div className="flex items-center gap-4 text-text">
            <span className="text-accent text-xs uppercase tracking-widest w-12">tel</span>
            <span className="text-lg">{personal.phone}</span>
          </div>
          <div className="flex items-center gap-4 text-text">
            <span className="text-accent text-xs uppercase tracking-widest w-12">loc</span>
            <span className="text-lg">{personal.location}</span>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="mt-24 pt-8 border-t border-border flex justify-between items-center">
          <span className="font-mono text-muted text-xs">© {new Date().getFullYear()} {personal.name}</span>
          <span className="font-mono text-muted text-xs">Built with Next.js</span>
        </div>
      </FadeIn>
    </section>
  )
}
```

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add components/Contact.tsx
git commit -m "feat: add Contact section and footer"
```

---

### Task 11: Assemble Main Page

**Files:**
- Modify: `app/page.tsx`

**Step 1: Replace `app/page.tsx`**

```tsx
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
    </main>
  )
}
```

**Step 2: Copy static assets**

The photo and CV need to be in `public/Resources/` so Next.js can serve them at `/Resources/...`:

```bash
mkdir -p public/Resources
cp Resources/photo_mme.jpg public/Resources/photo_mme.jpg
cp Resources/CV_english_mme.pdf public/Resources/CV_english_mme.pdf
```

**Step 3: Full build check**

```bash
npm run build
```
Expected: `out/` directory created, no errors, no TypeScript errors.

**Step 4: Preview locally**

```bash
npx serve out
```
Open `http://localhost:3000` and verify all sections render correctly.

**Step 5: Commit**

```bash
git add app/page.tsx public/
git commit -m "feat: assemble main page, add static assets"
```

---

### Task 12: GitHub Actions Deployment

**Files:**
- Create: `.github/workflows/deploy.yml`

**Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

**Step 2: Enable GitHub Pages**

In the GitHub repo settings → Pages → Source: select **GitHub Actions**.

**Step 3: Commit and push**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add GitHub Actions deploy workflow"
git push origin main
```
Expected: Actions tab shows a successful deploy run. Site live at `https://mariusmainz.github.io`.

---

## Done

After Task 12, the site is live. Future updates: edit `data/portfolio.ts` and push — the Actions workflow rebuilds and deploys automatically.
