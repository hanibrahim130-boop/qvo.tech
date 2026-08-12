import { useSyncExternalStore } from 'react'
import type { SceneVariant } from './site'

/**
 * The vertical master is used for portrait phone and tablet viewports; every
 * landscape viewport gets the horizontal master. Both files are `object-fit:
 * cover`, so matching the orientation is what keeps the framing intact.
 */
const MOBILE_QUERY = '(orientation: portrait) and (max-width: 900px)'

function subscribe(onChange: () => void) {
  const query = window.matchMedia(MOBILE_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function readVariant(): SceneVariant {
  return window.matchMedia(MOBILE_QUERY).matches ? 'mobile' : 'desktop'
}

/**
 * Resolves which scene master to mount. The value is read synchronously during
 * render, so the correct `<video src>` is the only one that ever reaches the
 * DOM — there is no hidden second element for the browser to fetch. It
 * re-evaluates on breakpoint and orientation changes and detaches its listener
 * on unmount.
 */
export function useSceneVariant(): SceneVariant {
  return useSyncExternalStore(subscribe, readVariant, () => 'desktop')
}
