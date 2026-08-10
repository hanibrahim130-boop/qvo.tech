import { useCallback, useEffect, useRef } from 'react'
import { ScrollTrigger } from '../lib/gsap'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'
import { drawDithered, hexToRgb } from '../lib/dither'

const INK = hexToRgb('#141210')
const PAPER = hexToRgb('#EDE9E1')

/** Cell size at the start of the develop, in device pixels. */
const COARSE_CELL = 9
/** Cell size once the plate has fully developed. */
const FINE_CELL = 2
/** Canvases are capped at 2x. Beyond that the dither cells stop reading. */
const MAX_DPR = 2

interface DitheredImageProps {
  /**
   * Must be same-origin (a path under `public/`). The dither reads pixels
   * back off the canvas, and a cross-origin image without permissive CORS
   * headers taints it and makes `getImageData` throw.
   */
  src: string
  alt: string
  className?: string
}

/**
 * A photograph rendered as a press plate.
 *
 * The plate develops as it crosses the viewport: it enters as a coarse
 * one-bit screen and resolves to a fine four-tone one. That is the whole
 * gesture — the image is being printed while you scroll past it, not
 * fading in.
 */
export default function DitheredImage({ src, alt, className }: DitheredImageProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const progressRef = useRef(0)
  const frameRef = useRef(0)
  const reduced = usePrefersReducedMotion()

  const paint = useCallback(() => {
    frameRef.current = 0
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    const image = imageRef.current
    if (!canvas || !wrap || !image) return

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    const width = Math.round(wrap.clientWidth * dpr)
    const height = Math.round(wrap.clientHeight * dpr)
    if (width === 0 || height === 0) return
    if (canvas.width !== width) canvas.width = width
    if (canvas.height !== height) canvas.height = height

    // Reduced motion gets the developed plate immediately and never moves.
    const t = reduced ? 1 : progressRef.current
    const eased = t * t * (3 - 2 * t)

    drawDithered(canvas, image, image.naturalWidth, image.naturalHeight, {
      cell: COARSE_CELL + (FINE_CELL - COARSE_CELL) * eased,
      levels: t > 0.55 ? 4 : 2,
      ink: INK,
      paper: PAPER,
      contrast: 1.18,
    })
  }, [reduced])

  const schedule = useCallback(() => {
    if (frameRef.current) return
    frameRef.current = requestAnimationFrame(paint)
  }, [paint])

  // Load the source once, then paint whenever scroll or size changes.
  useEffect(() => {
    const image = new Image()
    image.decoding = 'async'
    image.src = src
    const onLoad = () => {
      imageRef.current = image
      schedule()
    }
    if (image.complete && image.naturalWidth > 0) onLoad()
    else image.addEventListener('load', onLoad)
    return () => {
      image.removeEventListener('load', onLoad)
      imageRef.current = null
    }
  }, [src, schedule])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const observer = new ResizeObserver(schedule)
    observer.observe(wrap)

    // Rides the existing ScrollTrigger instance. Lenis already drives
    // ScrollTrigger.update(), so this adds no second scroll listener.
    const trigger = reduced
      ? null
      : ScrollTrigger.create({
          trigger: wrap,
          start: 'top bottom',
          end: 'center center',
          onUpdate: (self) => {
            progressRef.current = self.progress
            schedule()
          },
        })

    return () => {
      observer.disconnect()
      trigger?.kill()
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      frameRef.current = 0
    }
  }, [reduced, schedule])

  return (
    <div ref={wrapRef} className={className}>
      <canvas ref={canvasRef} className="plate-canvas" role="img" aria-label={alt} />
    </div>
  )
}
