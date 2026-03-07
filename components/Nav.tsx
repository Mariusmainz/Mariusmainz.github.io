'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
      <button
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        className="md:hidden text-muted"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span aria-hidden="true" className="font-mono text-sm">{menuOpen ? '✕' : '☰'}</span>
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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
      </AnimatePresence>
    </motion.nav>
  )
}
