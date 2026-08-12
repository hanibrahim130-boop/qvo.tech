import { motion } from 'motion/react'
import { SITE } from '../lib/site'

export default function ContactFooter() {
  return (
    <>
      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <p className="contact-kicker">Have a project in mind?</p>
        <h2 id="contact-title">Let&apos;s open<br />the frame.</h2>
        <motion.a
          className="email-link"
          href={`mailto:${SITE.email}`}
          whileHover={{ x: 6 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.25 }}
        >
          {SITE.email} <span aria-hidden="true">&#8599;</span>
        </motion.a>
      </section>

      <footer className="site-footer">
        <span>QVO / Lebanon</span>
        <a href={SITE.github} rel="noreferrer" target="_blank">
          GitHub <span aria-hidden="true">&#8599;</span>
        </a>
        <span>&copy; {new Date().getFullYear()} QVO</span>
      </footer>
    </>
  )
}
