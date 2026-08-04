import { useEffect, useRef, useState } from 'react'
import { Hexagon } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/usePrefersReducedMotion'

interface PreloaderProps {
  /** Fired as the curtain starts lifting, so the hero intro can overlap it. */
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const [gone, setGone] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) {
      onCompleteRef.current()
      setGone(true)
      return
    }

    const root = rootRef.current
    const count = countRef.current
    if (!root || !count) return

    document.documentElement.classList.add('is-loading')
    window.scrollTo(0, 0)

    const progress = { value: 0 }
    const tl = gsap.timeline({
      onComplete: () => setGone(true),
    })

    tl.from(markRef.current, { y: 28, opacity: 0, duration: 0.7, ease: 'power3.out' })
      .to(
        progress,
        {
          value: 100,
          duration: 1.5,
          ease: 'power2.inOut',
          onUpdate: () => {
            count.textContent = String(Math.round(progress.value)).padStart(3, '0')
          },
        },
        '<0.1',
      )
      .add(() => {
        document.documentElement.classList.remove('is-loading')
        onCompleteRef.current()
      })
      .to(root, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '<0.1')

    return () => {
      tl.kill()
      document.documentElement.classList.remove('is-loading')
    }
  }, [])

  if (gone) return null

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[300] flex flex-col justify-between bg-page px-5 py-6 sm:px-8 md:px-12"
    >
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
        <span>QVO — Studio</span>
        <span>Est. 2026</span>
      </div>

      <div ref={markRef} className="flex items-center justify-center gap-3">
        <Hexagon size={34} strokeWidth={1.5} className="text-accent" />
        <span className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
          qvo.tech
        </span>
      </div>

      <div className="flex items-end justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
          Loading experience
        </span>
        <span
          ref={countRef}
          className="font-display text-6xl font-medium leading-none tracking-tight text-white/90 sm:text-7xl"
        >
          000
        </span>
      </div>
    </div>
  )
}
