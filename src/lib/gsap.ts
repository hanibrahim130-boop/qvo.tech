import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }

/**
 * Gives each component one scoped owner for GSAP's imperative DOM mutations.
 * React cannot clean up tweens it did not create, and development Strict Mode
 * can run effects twice; reverting the context prevents duplicate triggers,
 * stale inline styles and selectors leaking into neighbouring sections.
 */
export function useGsapContext(
  setup: (ctx: gsap.Context) => void,
  scope: RefObject<HTMLElement | null>,
  deps: readonly unknown[] = [],
) {
  useLayoutEffect(() => {
    if (!scope.current) return
    const ctx = gsap.context(setup, scope)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
