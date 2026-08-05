import { useEffect, useState } from 'react'

/**
 * Tiny broadcast store for the global backdrop's eased scroll progress (0 -> 1).
 *
 * GlobalBackdrop owns the only master ScrollTrigger on the page and publishes
 * its progress here, so anything else that needs the film's position can read
 * it without adding a second scroll listener. Lenis already drives
 * ScrollTrigger.update(), and two scroll systems would fight each other.
 */

let current = 0
const listeners = new Set<(value: number) => void>()

export function setBackdropProgress(value: number): void {
  if (value === current) return
  current = value
  for (const listener of listeners) listener(value)
}

export function getBackdropProgress(): number {
  return current
}

export function subscribeBackdropProgress(
  listener: (value: number) => void,
): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * Re-renders the calling component on every backdrop frame. Use sparingly:
 * this is meant for a single small readout, never for a list.
 */
export function useBackdropProgress(): number {
  const [value, setValue] = useState(getBackdropProgress)
  useEffect(() => subscribeBackdropProgress(setValue), [])
  return value
}
