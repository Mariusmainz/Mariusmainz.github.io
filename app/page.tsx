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
      {/* Dot grid — fixed so it covers the full viewport at all scroll positions */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          backgroundImage: 'radial-gradient(circle, rgba(0, 212, 255, 0.13) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
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
