import FadeIn from './FadeIn'
import { personal } from '@/data/portfolio'

export default function Contact() {
  return (
    <section id="contact" className="py-32 px-6 max-w-5xl mx-auto">
      <FadeIn>
        <p className="font-mono text-accent text-xs tracking-[0.3em] uppercase mb-2">05 /</p>
        <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">Contact</h2>
        <p className="text-muted text-lg mb-16 max-w-lg">
          {personal.tagline}
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex flex-col gap-4 font-mono">
          <a
            href={`mailto:${personal.email}`}
            className="group flex items-center gap-4 text-text hover:text-accent transition-colors"
          >
            <span className="text-accent text-xs uppercase tracking-widest w-12">mail</span>
            <span className="text-lg group-hover:underline">{personal.email}</span>
          </a>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="group flex items-center gap-4 text-text hover:text-accent transition-colors"
          >
            <span className="text-accent text-xs uppercase tracking-widest w-12">li</span>
            <span className="text-lg group-hover:underline">LinkedIn</span>
          </a>
          <a
            href={`tel:${personal.phone.replace(/\s/g, '')}`}
            className="group flex items-center gap-4 text-text hover:text-accent transition-colors"
          >
            <span className="text-accent text-xs uppercase tracking-widest w-12">tel</span>
            <span className="text-lg group-hover:underline">{personal.phone}</span>
          </a>
          <div className="flex items-center gap-4 text-text">
            <span className="text-accent text-xs uppercase tracking-widest w-12">loc</span>
            <span className="text-lg">{personal.location}</span>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="mt-24 pt-8 border-t border-border flex justify-between items-center">
          <span className="font-mono text-muted text-xs">© {new Date().getFullYear()} {personal.name}</span>
          <span className="font-mono text-muted text-xs">Built with Next.js</span>
        </div>
      </FadeIn>
    </section>
  )
}
