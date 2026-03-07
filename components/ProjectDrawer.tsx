'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
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
