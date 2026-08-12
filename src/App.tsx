import { MotionConfig } from 'motion/react'
import CinematicExperience from './components/CinematicExperience'
import ContactFooter from './components/ContactFooter'
import Header from './components/Header'
import StaticExperience from './components/StaticExperience'
import { useStaticExperience } from './lib/useStaticExperience'

export default function App() {
  const staticExperience = useStaticExperience()

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content">
        {staticExperience ? <StaticExperience /> : <CinematicExperience />}
        <ContactFooter />
      </main>
    </MotionConfig>
  )
}
