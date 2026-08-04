import type { MouseEvent } from 'react'
import { scrollToTarget } from './useLenis'

/**
 * Click handler for same-page `#anchor` links: smooth-scrolls via Lenis (or
 * native fallback) and keeps the hash in the URL without a jump.
 */
export function onAnchorClick(event: MouseEvent<HTMLAnchorElement>) {
  const href = event.currentTarget.getAttribute('href')
  if (!href || !href.startsWith('#')) return
  event.preventDefault()
  if (document.querySelector(href)) {
    scrollToTarget(href)
    window.history.replaceState(null, '', href)
  }
}
