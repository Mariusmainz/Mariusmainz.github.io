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
              <ul role="list" className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <li key={tag}>
                    <span className="font-mono text-sm px-4 py-2 border border-border text-text hover:border-accent hover:text-accent transition-colors block">
                      {tag}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
