import Image from 'next/image'
import FadeIn from './FadeIn'
import { personal } from '@/data/portfolio'

export default function About() {
  return (
    <section id="about" className="py-32 px-6 max-w-5xl mx-auto">
      <FadeIn>
        <p className="font-mono text-accent text-xs tracking-[0.3em] uppercase mb-2">01 /</p>
        <h2 className="text-3xl md:text-4xl font-bold text-text mb-16">About</h2>
      </FadeIn>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <FadeIn delay={0.1}>
          <div className="relative aspect-[3/4] max-w-sm overflow-hidden border border-border">
            <Image
              src={personal.photoPath}
              alt={`Profile photo of ${personal.name}`}
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute inset-0 border-2 border-accent/20" />
          </div>
        </FadeIn>

        <FadeIn delay={0.2} className="flex flex-col gap-6">
          <p className="text-text/80 leading-relaxed text-lg">{personal.about}</p>

          <div className="flex flex-col gap-2 font-mono text-sm">
            <div className="flex gap-3">
              <span className="text-accent">loc</span>
              <span className="text-muted">{personal.location}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-accent">mail</span>
              <a href={`mailto:${personal.email}`} className="text-muted hover:text-accent transition-colors">
                {personal.email}
              </a>
            </div>
            <div className="flex gap-3">
              <span className="text-accent">tel</span>
              <a href={`tel:${personal.phone}`} className="text-muted hover:text-accent transition-colors">
                {personal.phone}
              </a>
            </div>
            <div className="flex gap-3">
              <span className="text-accent">li</span>
              <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="text-muted hover:text-accent transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
