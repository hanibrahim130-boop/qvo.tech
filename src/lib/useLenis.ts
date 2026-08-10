import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'
import { prefersReducedMotion } from './usePrefersReducedMotion'

let activeLenis: Lenis | null = null

/**
 * Exposes the single Lenis owner to imperative navigation helpers. Sharing the
 * instance prevents buttons and anchors from starting a native scroll that
 * competes with the frame loop; `null` deliberately signals reduced motion or
 * an unmounted app so callers can use the platform fallback.
 */
export function getLenis(): Lenis | null {
  return activeLenis
}

/**
 * Gives smooth scrolling and ScrollTrigger one shared animation clock. Driving
 * Lenis from GSAP avoids two requestAnimationFrame loops drifting apart, while
 * opting out before construction preserves native scrolling for visitors who
 * request reduced motion.
 */
export function useLenis(): void {
  useEffect(() => {
    if (prefersReducedMotion()) return

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
  }, [])
}

/**
 * Sends every programmatic jump through Lenis when it exists, with a native
 * fallback so navigation still works before hydration and under reduced
 * motion. Keeping that policy here prevents each CTA from choosing a subtly
 * different scroll path.
 */
export function scrollToTarget(target: string | number | HTMLElement): void {
  if (activeLenis) {
    activeLenis.scrollTo(target, { duration: 1.2 })
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  el?.scrollIntoView({ behavior: 'smooth' })
}
