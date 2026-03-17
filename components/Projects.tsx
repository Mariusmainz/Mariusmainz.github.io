'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FadeIn from './FadeIn'
import { projects } from '@/data/portfolio'

const TYPE_LABEL: Record<string, string> = {
  professional: 'Professional',
  personal:     'Personal',
  academic:     'Academic',
}

export default function Projects() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section id="projects" className="py-32 px-6 max-w-5xl mx-auto">
      <FadeIn>
        <p className="font-mono text-accent2 text-xs tracking-[0.3em] uppercase mb-2">03 /</p>
        <h2 className="text-3xl md:text-4xl font-bold text-text mb-16">Projects</h2>
      </FadeIn>

      <div className="border-t border-border">
        {projects.map((project, i) => {
          const isOpen = openId === project.id

          return (
            <FadeIn key={project.id} delay={i * 0.04}>
              <div className="relative border-b border-border">

                {/* Left accent bar — slides in when open */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-px bg-accent origin-top"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                />

                {/* Row header */}
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : project.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left px-5 py-5 group"
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    {/* Index */}
                    <span className="font-mono text-xs text-muted tabular-nums w-6 shrink-0 select-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    {/* Title */}
                    <span
                      className={`flex-1 font-semibold transition-colors duration-150 ${
                        isOpen ? 'text-accent' : 'text-text group-hover:text-accent'
                      }`}
                    >
                      {project.title}
                    </span>

                    {/* Type */}
                    <span className="font-mono text-xs text-muted uppercase tracking-widest hidden sm:block shrink-0">
                      {TYPE_LABEL[project.type]}
                    </span>

                    {/* Chevron */}
                    <motion.span
                      className={`text-xs shrink-0 transition-colors ${isOpen ? 'text-accent' : 'text-muted'}`}
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.22 }}
                      aria-hidden="true"
                    >
                      ↓
                    </motion.span>
                  </div>
                </button>

                {/* Expanded content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pl-5 sm:pl-16 pr-5 pb-8 pt-1">

                        {/* Detail text */}
                        <p className="text-muted text-sm leading-relaxed mb-5 max-w-2xl">
                          {project.detail ?? project.shortDescription}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {project.tags.map(tag => (
                            <span
                              key={tag}
                              className="font-mono text-xs text-muted/70 border border-border px-2.5 py-1"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Media */}
                        {project.media && project.media.length > 0 && (
                          <div className="space-y-4">

                            {/* Images / press clippings */}
                            {project.media.filter(m => m.type === 'image' || m.type === 'press').length > 0 && (
                              <div className="grid grid-cols-2 gap-2">
                                {project.media
                                  .filter(m => m.type === 'image' || m.type === 'press')
                                  .map((m, mi) => (
                                    <figure key={mi}>
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={m.src}
                                        alt={m.caption ?? ''}
                                        loading="lazy"
                                        className="w-full aspect-video object-cover border border-border"
                                      />
                                      {m.caption && (
                                        <figcaption className="font-mono text-xs text-muted mt-1.5">
                                          {m.caption}
                                        </figcaption>
                                      )}
                                    </figure>
                                  ))}
                              </div>
                            )}

                            {/* PDF links */}
                            <div className="flex flex-wrap gap-2">
                              {project.media.filter(m => m.type === 'pdf').map((m, mi) => (
                                <a
                                  key={mi}
                                  href={m.src}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 font-mono text-xs text-accent border border-accent/30 px-4 py-2 hover:bg-accent/10 hover:border-accent/60 transition-colors"
                                >
                                  {m.label ?? 'View PDF'}
                                  <span aria-hidden="true">↗</span>
                                </a>
                              ))}
                            </div>

                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </FadeIn>
          )
        })}
      </div>
    </section>
  )
}
