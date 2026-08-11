import { useEffect } from 'react'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Services from './components/Services'
import Studio from './components/Studio'
import Work from './components/Work'
import { ScrollTrigger } from './lib/gsap'
import { useLenis } from './lib/useLenis'

export default function App() {
  useLenis()

  // Re-measure scroll choreography once fonts and the full page have loaded.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    document.fonts.ready.then(refresh).catch(() => {})
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Work />
        <Services />
        <Studio />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
