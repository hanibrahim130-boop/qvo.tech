import { useCallback, useRef } from 'react'
import { gsap, useGsapContext, ScrollTrigger } from '../lib/gsap'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4'

/** Mirrors the scroll-scrub-video package's seek tuning. */
const SEEK_THROTTLE_MS = 33
const MIN_SEEK_DELTA_SECONDS = 0.04
const TAIL_TRIM_SECONDS = 0.05

/**
 * A pinned, full-viewport showreel whose playhead is driven by scroll — the
 * same technique the `scroll-scrub-video` package extracts, here wired to a
 * section-scoped ScrollTrigger instead of the whole document.
 */
export default function Showreel() {
  const wrapRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const lastSeekAt = useRef(0)
  const hasPrimed = useRef(false)
  const reduced = usePrefersReducedMotion()

  /** iOS refuses to decode frames for a video that has never played. */
  const primeDecoder = useCallback(() => {
    const video = videoRef.current
    if (!video || hasPrimed.current) return
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (!isTouch) return
    hasPrimed.current = true
    void video
      .play()
      .then(() => video.pause())
      .catch(() => {
        // Autoplay blocked; the poster stays until a frame decodes.
      })
  }, [])

  useGsapContext(
    () => {
      if (reduced) return

      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const video = videoRef.current
          if (!video) return
          const { duration } = video
          if (!Number.isFinite(duration) || duration <= 0) return

          const now = performance.now()
          if (now - lastSeekAt.current < SEEK_THROTTLE_MS) return

          const lastSeekable = Math.max(0, duration - TAIL_TRIM_SECONDS)
          const target = Math.min(Math.max(0, self.progress * lastSeekable), lastSeekable)
          if (Math.abs(target - video.currentTime) > MIN_SEEK_DELTA_SECONDS) {
            video.currentTime = target
            lastSeekAt.current = now
          }
        },
      })

      gsap.to(barRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      })

      gsap.fromTo(
        titleRef.current,
        { yPercent: 30 },
        {
          yPercent: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    },
    wrapRef,
    [reduced],
  )

  return (
    <section ref={wrapRef} className="relative h-[280vh]" aria-label="Showreel">
      <div className="sticky top-0 h-screen overflow-hidden">
        {reduced ? (
          <img
            src="/hero-poster.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            src={VIDEO_URL}
            poster="/hero-poster.jpg"
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
            onLoadedMetadata={primeDecoder}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Legibility gradients */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-page/80 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-page/90 to-transparent" />

        <div className="absolute inset-x-0 top-24 flex items-center justify-between px-5 font-mono text-[11px] uppercase tracking-[0.25em] text-white/60 sm:px-8 md:px-12">
          <span>Showreel — ©2026</span>
          <span className="hidden sm:block">{reduced ? 'Stills' : 'Scroll to scrub'}</span>
        </div>

        <div ref={titleRef} className="absolute inset-x-0 bottom-16 px-5 sm:px-8 md:px-12">
          <span className="text-outline font-display text-[clamp(3.5rem,13vw,12rem)] font-bold uppercase leading-none tracking-tight">
            Showreel
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 px-5 pb-6 sm:px-8 md:px-12">
          <div className="h-px w-full bg-white/15">
            <div ref={barRef} className="h-px origin-left scale-x-0 bg-accent" />
          </div>
        </div>
      </div>
    </section>
  )
}
