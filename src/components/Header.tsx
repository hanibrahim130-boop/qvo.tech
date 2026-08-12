import { motion } from 'motion/react'

export default function Header() {
  return (
    <motion.header
      className="site-header"
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <a className="wordmark" href="#top" aria-label="QVO, back to top">
        QVO
      </a>
      <motion.a
        className="header-cta"
        href="#contact"
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.25 }}
      >
        Start a project <span aria-hidden="true">&#8599;</span>
      </motion.a>
    </motion.header>
  )
}
