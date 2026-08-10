import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

/**
 * Subscribes React to the operating-system motion preference through the
 * external-store contract, which keeps concurrent renders and live preference
 * changes consistent instead of reading `matchMedia` once at mount time.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  )
}

/**
 * Lets imperative setup code honour reduced motion before it allocates an
 * animation object. Hooks cannot be called inside event handlers or GSAP setup
 * callbacks, so those paths need the same policy as a synchronous query.
 */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(QUERY).matches
}
