import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/usePrefersReducedMotion'

interface MagneticProps {
  children: ReactNode
  /** Pull strength: fraction of the pointer offset applied to the element. */
  strength?: number
  className?: string
}

/**
 * Makes its children subtly gravitate toward the pointer while hovered and
 * snap back with an elastic ease on leave. Inert on touch devices and for
 * reduced motion.
 */
export default function Magnetic({ children, strength = 0.32, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const relX = event.clientX - (rect.left + rect.width / 2)
      const relY = event.clientY - (rect.top + rect.height / 2)
      xTo(relX * strength)
      yTo(relY * strength)
    }

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' })
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(el)
    }
  }, [strength])

  return (
    <span ref={ref} className={`inline-block will-change-transform ${className ?? ''}`}>
      {children}
    </span>
  )
}
