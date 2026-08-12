import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }

export function useGsapContext(
  setup: () => void,
  scope: RefObject<HTMLElement | null>,
  dependencies: readonly unknown[] = [],
) {
  useLayoutEffect(() => {
    if (!scope.current) return

    const context = gsap.context(setup, scope)
    return () => context.revert()
    // The caller owns the dependency list, matching React's effect API.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}
