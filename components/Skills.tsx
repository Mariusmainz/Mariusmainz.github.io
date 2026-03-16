'use client'

import { motion } from 'framer-motion'
import FadeIn from './FadeIn'
import { skills } from '@/data/portfolio'

export default function Skills() {
  return (
    <section id="skills" className="py-32 px-6 max-w-5xl mx-auto">
      <FadeIn>
        <p className="font-mono text-accent2 text-xs tracking-[0.3em] uppercase mb-2">04 /</p>
        <h2 className="text-3xl md:text-4xl font-bold text-text mb-16">Skills</h2>
      </FadeIn>

      <div className="flex flex-col gap-12">
        {Object.entries(skills).map(([category, tags], ci) => (
          <FadeIn key={category} delay={ci * 0.1}>
            <div>
              <p className="font-mono text-xs text-muted uppercase tracking-widest mb-4">{category}</p>
              <ul role="list" className="flex flex-wrap gap-2">
                {tags.map((tag, ti) => (
                  <motion.li
                    key={tag}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: ci * 0.1 + ti * 0.04, duration: 0.3 }}
                  >
                    <span className="font-mono text-sm px-4 py-2 border border-border text-text hover:border-accent2/60 hover:text-accent2 hover:bg-accent2/10 hover:scale-[1.03] transition-all duration-150 block cursor-default">
                      {tag}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
