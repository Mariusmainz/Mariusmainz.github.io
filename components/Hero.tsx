'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { personal } from '@/data/portfolio'

export default function Hero() {
  const scrollToProjects = () =>
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })

  const fullName = personal.name
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    if (charCount >= fullName.length) return
    const t = setTimeout(() => setCharCount(c => c + 1), 72)
    return () => clearTimeout(t)
  }, [charCount, fullName.length])

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient overlay — darkens edges so hero text is legible over the dot grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-transparent to-bg/60" />

      {/* Radial pulse behind name */}
      <motion.div
        animate={{ opacity: [0.04, 0.08, 0.04], scale: [1, 1.15, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(400px circle at 50% 50%, rgba(56,189,248,0.12), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-mono text-accent text-sm tracking-[0.3em] uppercase mb-4"
        >
          — Portfolio —
        </motion.p>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.1 }}
          className="font-mono text-4xl md:text-6xl font-bold text-text mb-4 tracking-tight"
        >
          {fullName.slice(0, charCount)}
          <span className="cursor-blink inline-block w-[2px] h-[0.85em] bg-accent align-middle ml-[2px]" />
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
            type="button"
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
