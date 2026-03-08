'use client'

import { motion } from 'framer-motion'
import { personal } from '@/data/portfolio'

export default function Hero() {
  const scrollToProjects = () =>
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient overlay — darkens edges so hero text is legible over the dot grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-transparent to-bg/60" />

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
