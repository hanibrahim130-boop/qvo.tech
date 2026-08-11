import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'
import { prefersReducedMotion, usePrefersReducedMotion } from './usePrefersReducedMotion'

let activeLenis: Lenis | null = null

/**
 * Boots Lenis smooth scrolling on the window, drives it from the GSAP ticker
 * and keeps ScrollTrigger in sync. No-op when reduced motion is requested.
 */
export function useLenis() {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    })
    activeLenis = lenis

    lenis.on('scroll', () => ScrollTrigger.update())

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      activeLenis = null
      gsap.ticker.lagSmoothing(500, 33)
    }
  }, [reduced])
}

/** Smooth-scrolls to a selector, element or absolute position. */
export function scrollToTarget(target: string | number | HTMLElement) {
  if (activeLenis) {
    activeLenis.scrollTo(target, { duration: 1.2 })
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  el?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}
