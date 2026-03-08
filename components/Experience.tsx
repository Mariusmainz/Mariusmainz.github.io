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
  images,
  index,
}: {
  title: string
  subtitle: string
  period: string
  description: string
  images?: { src: string; caption?: string }[]
  index: number
}) {
  const [open, setOpen] = useState(false)

  return (
    <FadeIn delay={index * 0.08}>
      <div className="relative pl-8 pb-10 border-l border-border">
        {/* Dot */}
        <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-accent bg-bg" />

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="text-left w-full group"
          aria-expanded={open}
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
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <p className="text-muted text-sm mt-3 leading-relaxed">{description}</p>
              {images && images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {images.map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={img.src}
                      alt={img.caption ?? ''}
                      className="w-full aspect-video object-cover border border-border"
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeIn>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="py-32 px-6 max-w-5xl mx-auto isolate">
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
              description={e.description ?? e.field}
              images={e.images}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
