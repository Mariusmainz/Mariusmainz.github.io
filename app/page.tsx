import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'
import CircuitTrace from '@/components/CircuitTrace'

export default function Home() {
  return (
    <div className="relative">
      {/* Dot grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          backgroundImage: 'radial-gradient(circle, rgba(56, 189, 248, 0.10) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Cyan glow — top right */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: 'radial-gradient(600px circle at 80% 10%, rgba(56,189,248,0.04), transparent)',
        }}
        aria-hidden="true"
      />

      {/* Amber glow — bottom left */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: 'radial-gradient(600px circle at 20% 90%, rgba(245,158,11,0.03), transparent)',
        }}
        aria-hidden="true"
      />

      <CircuitTrace />

      <main className="relative z-10">
        <Nav />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </div>
  )
}
