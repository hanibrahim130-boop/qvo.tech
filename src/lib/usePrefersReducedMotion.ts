export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/** One-off, non-reactive check for imperative code paths. */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_QUERY).matches
}
