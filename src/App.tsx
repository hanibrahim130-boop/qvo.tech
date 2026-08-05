import { useEffect, useState } from 'react'
import Contact from './components/Contact'
import Cursor from './components/Cursor'
import Footer from './components/Footer'
import GlobalBackdrop from './components/GlobalBackdrop'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Navbar from './components/Navbar'
import Preloader from './components/Preloader'
import Process from './components/Process'
import Services from './components/Services'
import Showreel from './components/Showreel'
import Studio from './components/Studio'
import Work from './components/Work'
import { ScrollTrigger } from './lib/gsap'
import { useLenis } from './lib/useLenis'

const MARQUEE_ITEMS = [
  'Web design',
  'Web development',
  'Digital strategy',
  'Brand systems',
  'Motion & 3D',
]

export default function App() {
  const [started, setStarted] = useState(false)

  useLenis()

  // Re-measure scroll choreography once fonts and the full page have loaded,
  // and again when the preloader hands off.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    document.fonts.ready.then(refresh).catch(() => {})
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  useEffect(() => {
    if (started) ScrollTrigger.refresh()
  }, [started])

  return (
    <>
      <Preloader onComplete={() => setStarted(true)} />
      <Cursor />
      {/* One film behind every section. Sits at z-0; the page rides above it. */}
      <GlobalBackdrop />
      <div className="noise-overlay" aria-hidden="true" />
      <Navbar />
      <div className="relative z-10">
        <main>
          <Hero started={started} />
          <Marquee items={MARQUEE_ITEMS} />
          <Showreel />
          <Work />
          <Services />
          <Process />
          <Studio />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  )
}
