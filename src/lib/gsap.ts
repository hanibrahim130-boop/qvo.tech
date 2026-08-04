import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }

/**
 * Runs a GSAP setup function inside `gsap.context`, scoped to `scope`, and
 * reverts every tween/ScrollTrigger it created on cleanup. Selector text used
 * inside the callback resolves within the scope element.
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
