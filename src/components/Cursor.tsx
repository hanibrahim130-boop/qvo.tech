import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/usePrefersReducedMotion'

/**
 * A two-part custom cursor (dot + trailing ring) rendered with
 * `mix-blend-difference` so it stays visible over any surface. The ring grows
 * over links, buttons and anything tagged with `data-cursor`. Disabled for
 * coarse pointers and reduced motion.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return
    if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return

    document.documentElement.classList.add('has-custom-cursor')
    dot.style.opacity = '0'
    ring.style.opacity = '0'

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let ringX = x
    let ringY = y
    let scale = 1
    let targetScale = 1
    let rafId = 0
    let seen = false

    const onMove = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
      if (!seen) {
        seen = true
        ringX = x
        ringY = y
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
    }

    const isInteractive = (target: EventTarget | null): boolean =>
      target instanceof Element &&
      target.closest('a, button, [role="button"], [data-cursor]') !== null

    const onOver = (event: PointerEvent) => {
      targetScale = isInteractive(event.target) ? 2.4 : 1
    }

    const loop = () => {
      ringX += (x - ringX) * 0.16
      ringY += (y - ringY) * 0.16
      scale += (targetScale - scale) * 0.18
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale})`
      rafId = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    rafId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      cancelAnimationFrame(rafId)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <div aria-hidden="true" className="hidden md:block">
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[210] h-1.5 w-1.5 rounded-full bg-white mix-blend-difference"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[200] h-9 w-9 rounded-full border border-white/70 mix-blend-difference"
      />
    </div>
  )
}
