'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import Image from 'next/image'
import { Project } from '@/data/portfolio'

export default function ProjectDrawer({
  project,
  onClose,
}: {
  project: Project | null
  onClose: () => void
}) {
  useEffect(() => {
    if (!project) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [project, onClose])

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
            role="dialog"
            aria-modal="true"
            aria-label={project?.title}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <span className="font-mono text-accent text-xs tracking-widest uppercase">Project</span>
              <button
                type="button"
                onClick={onClose}
                className="font-mono text-muted hover:text-text text-sm transition-colors"
                aria-label="Close project details"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="text-2xl font-bold text-text mb-2">{project.title}</h3>
              <p className="font-mono text-accent text-xs uppercase tracking-widest mb-6">
                {project.type === 'professional' ? 'Professional Project' : 'Personal Project'}
              </p>

              <div className="text-text/80 leading-relaxed mb-8 flex flex-col gap-4">
                {project.detail.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="mb-8">
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

              {project.media && project.media.length > 0 && (() => {
                const images = project.media.filter((m) => m.type === 'image' || m.type === 'press')
                const pdfs = project.media.filter((m) => m.type === 'pdf')
                return (
                  <>
                    {images.length > 0 && (
                      <div className="flex flex-col gap-4 mb-8">
                        {images.map((m, i) => (
                          <figure key={i}>
                            <div className="relative w-full aspect-video overflow-hidden border border-border bg-surface">
                              <Image
                                src={m.src}
                                alt={m.caption ?? ''}
                                fill
                                className="object-cover"
                              />
                              {m.type === 'press' && (
                                <div className="absolute top-2 left-2 font-mono text-xs bg-accent text-black px-2 py-0.5 uppercase tracking-widest">
                                  Press
                                </div>
                              )}
                            </div>
                            {m.caption && (
                              <figcaption className="font-mono text-xs text-muted mt-1.5">{m.caption}</figcaption>
                            )}
                          </figure>
                        ))}
                      </div>
                    )}
                    {pdfs.length > 0 && (
                      <div className="flex flex-col gap-2">
                        {pdfs.map((m, i) => (
                          <a
                            key={i}
                            href={m.src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 border border-border px-4 py-3 font-mono text-sm text-text hover:border-accent hover:text-accent transition-colors group"
                          >
                            <span aria-hidden="true" className="text-accent">↗</span>
                            {m.label ?? 'View Document'}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                )
              })()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
