import { useRef } from 'react'
import type { ReactNode } from 'react'
import { gsap, useGsapContext } from '../lib/gsap'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Delay in milliseconds before the reveal starts. */
  delay?: number
  /** Vertical travel distance in pixels. */
  y?: number
}

/**
 * Fades and lifts children into view once they enter the viewport. Uses
 * transform + opacity only, and does nothing when reduced motion is requested
 * (content is visible by default, so no animation is gated behind CSS).
 */
export default function Reveal({ children, className, delay = 0, y = 26 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useGsapContext(
    () => {
      if (reduced || !ref.current) return
      gsap.from(ref.current, {
        y,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: delay / 1000,
        scrollTrigger: { trigger: ref.current, start: 'top 86%', once: true },
      })
    },
    ref,
    [reduced, delay, y],
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
