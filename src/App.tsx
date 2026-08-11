import { MotionConfig } from 'motion/react'
import CinematicExperience from './components/CinematicExperience'
import ContactFooter from './components/ContactFooter'
import Header from './components/Header'
import StaticExperience from './components/StaticExperience'
import { usePrefersReducedMotion } from './lib/usePrefersReducedMotion'

export default function App() {
  const reduceMotion = usePrefersReducedMotion()

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content">
        {reduceMotion ? <StaticExperience /> : <CinematicExperience />}
        <ContactFooter />
      </main>
    </MotionConfig>
  )
}
