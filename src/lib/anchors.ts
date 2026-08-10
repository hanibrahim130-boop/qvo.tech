import type { MouseEvent } from 'react'
import { scrollToTarget } from './useLenis'

/**
 * Routes same-page links through the shared scroll controller so the visible
 * move and the URL update happen as one action. Preventing the browser's
 * default jump avoids fighting Lenis while `replaceState` keeps deep links
 * useful without adding a redundant history entry for every section click.
 */
export function onAnchorClick(event: MouseEvent<HTMLAnchorElement>): void {
  const href = event.currentTarget.getAttribute('href')
  if (!href || !href.startsWith('#')) return
  event.preventDefault()
  if (document.querySelector(href)) {
    scrollToTarget(href)
    window.history.replaceState(null, '', href)
  }
}
