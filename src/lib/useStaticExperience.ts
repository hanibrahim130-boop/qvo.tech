import { useSyncExternalStore } from 'react'
import { REDUCED_MOTION_QUERY, prefersReducedMotion } from './usePrefersReducedMotion'

type SaveDataConnection = EventTarget & { saveData?: boolean }

function getConnection(): SaveDataConnection | undefined {
  if (typeof navigator === 'undefined') return undefined
  return (navigator as Navigator & { connection?: SaveDataConnection }).connection
}

/** True when the visitor has asked the browser to conserve data. */
export function prefersSavedData(): boolean {
  return getConnection()?.saveData === true
}

function subscribe(onChange: () => void) {
  const motion = window.matchMedia(REDUCED_MOTION_QUERY)
  motion.addEventListener('change', onChange)

  const connection = getConnection()
  connection?.addEventListener('change', onChange)

  return () => {
    motion.removeEventListener('change', onChange)
    connection?.removeEventListener('change', onChange)
  }
}

/**
 * Whether to render the static branch instead of the cinematic scene. Reduced
 * motion and Save-Data are both resolved during render, before any media
 * element mounts, so neither MP4 is ever attached for those visitors.
 */
export function useStaticExperience(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => prefersReducedMotion() || prefersSavedData(),
    () => true,
  )
}
