import { useEffect, useRef } from 'react'
import { ScrollTrigger } from '../lib/gsap'
import { setBackdropProgress } from '../lib/backdropProgress'
import { FrameSequence, pickSequence } from '../lib/frameSequence'
import type { BackdropManifest } from '../lib/frameSequence'
import {
  PALETTE,
  baseWithAlpha,
  createDustField,
  drawBackdrop,
  measureChapterStops,
  sampleChapters,
} from '../lib/proceduralBackdrop'

/**
 * One canvas behind the entire site, scrubbed by one master ScrollTrigger.
 *
 * Layering: this sits at `fixed inset-0 z-0` and everything else on the page
 * lives in a `relative z-10` wrapper, so the noise overlay (90), navbar (50),
 * cursor (200/210) and preloader (300) are all untouched.
 *
 * Scroll: Lenis already drives ScrollTrigger.update(), so this reads progress
 * from a ScrollTrigger rather than adding a second scroll listener that would
 * desync the smooth scroll.
 */

const MANIFEST_URL = '/backdrop/manifest.json'
const DUST_COUNT = 220
/** Progress chases the scroll instead of matching it. The lag is the point. */
const EASE = 0.12

export default function GlobalBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dust = createDustField(reduced ? 0 : DUST_COUNT)
    const startedAt = performance.now()

    let width = window.innerWidth
    let height = window.innerHeight
    let stops = measureChapterStops()
    let target = 0
    let rendered = 0
    let direction = 1
    let sequence: FrameSequence | null = null
    let frameId = 0
    let running = false
    let disposed = false

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth || window.innerWidth
      height = canvas.clientHeight || window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const paint = (now: number) => {
      const time = (now - startedAt) / 1000
      const delta = target - rendered
      if (delta > 0.0001) direction = 1
      else if (delta < -0.0001) direction = -1
      rendered = Math.abs(delta) < 0.0002 ? target : rendered + delta * EASE

      const state = sampleChapters(rendered, stops)

      if (sequence && sequence.ready) {
        const index = Math.round(rendered * (sequence.count - 1))
        sequence.prefetch(index, direction)
        const frame = sequence.frameAt(index)
        if (frame) {
          const scale = Math.max(width / frame.width, height / frame.height)
          const w = frame.width * scale
          const h = frame.height * scale
          ctx.drawImage(frame.source, (width - w) / 2, (height - h) / 2, w, h)
        } else {
          ctx.fillStyle = sequence.averageColor
          ctx.fillRect(0, 0, width, height)
        }
        if (state.scrim > 0.001) {
          ctx.fillStyle = baseWithAlpha(state.scrim)
          ctx.fillRect(0, 0, width, height)
        }
      } else {
        drawBackdrop(ctx, width, height, state, dust, time)
      }

      setBackdropProgress(rendered)
    }

    const loop = (now: number) => {
      paint(now)
      frameId = requestAnimationFrame(loop)
    }

    const sync = () => {
      const shouldRun = !reduced && !disposed && !document.hidden
      if (shouldRun && !running) {
        running = true
        frameId = requestAnimationFrame(loop)
      } else if (!shouldRun && running) {
        running = false
        cancelAnimationFrame(frameId)
      }
    }

    const onResize = () => {
      resize()
      stops = measureChapterStops()
      if (!running) paint(performance.now())
    }

    resize()
    paint(performance.now())
    sync()

    // Chapters are keyed to measured section offsets, so they must be
    // re-measured whenever the pinned sections change the document height.
    const trigger = reduced
      ? null
      : ScrollTrigger.create({
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          invalidateOnRefresh: true,
          onRefresh: () => {
            resize()
            stops = measureChapterStops()
          },
          onUpdate: (self) => {
            target = self.progress
          },
        })

    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', sync)

    void (async () => {
      try {
        const response = await fetch(MANIFEST_URL, { cache: 'force-cache' })
        if (!response.ok) return
        const manifest = (await response.json()) as BackdropManifest
        const chosen = pickSequence(manifest)
        if (!chosen || disposed) return
        const next = new FrameSequence(chosen)
        await next.loadCoarse()
        if (disposed) {
          next.dispose()
          return
        }
        sequence = next
        if (!running) paint(performance.now())
      } catch {
        // No manifest: the procedural film is the design, not a fallback.
      }
    })()

    return () => {
      disposed = true
      running = false
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', sync)
      trigger?.kill()
      sequence?.dispose()
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ backgroundColor: PALETTE.base }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
