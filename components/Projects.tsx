'use client'

import { useState } from 'react'
import FadeIn from './FadeIn'
import ProjectDrawer from './ProjectDrawer'
import { projects, Project } from '@/data/portfolio'

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
              type="button"
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
