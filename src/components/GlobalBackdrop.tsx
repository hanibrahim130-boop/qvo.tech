import { useEffect, useRef } from 'react'
import { ScrollTrigger } from '../lib/gsap'
import { setBackdropProgress } from '../lib/backdropProgress'

/**
 * One video behind the entire site, scrubbed by one master ScrollTrigger.
 *
 * There is no canvas and no procedural drawing any more. The backdrop is a
 * single graded clip seeked frame by frame as the page scrolls, so the whole
 * site reads as one continuous shot instead of several separate backgrounds.
 *
 * Layering: this sits at `fixed inset-0 z-0` and everything else on the page
 * lives in a `relative z-10` wrapper, so the noise overlay (90), navbar (50),
 * cursor (200/210) and preloader (300) are all untouched.
 *
 * Scroll: Lenis already drives ScrollTrigger.update(), so progress is read
 * from a ScrollTrigger rather than a second scroll listener, which would
 * desync the smooth scroll.
 *
 * The clip is hosted off-repo and encoded with every frame as a keyframe.
 * Without that encode, each seek has to decode forward from a distant
 * keyframe and the scrub stutters. See `docs/global-backdrop.md`.
 */

const BACKDROP_VIDEO_URL =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3H8VUZ56qpYUqf0FLA7VCo56ETY/4cfe5d4a-2140-4d67-b2e0-f599d3134941.mp4'

/** One seek per frame at ~30fps is plenty; more only queues up decode work. */
const SEEK_THROTTLE_MS = 33
/** Ignore sub-frame seeks. The clip is 24fps, so one frame is ~0.0417s. */
const MIN_SEEK_DELTA_SECONDS = 0.02
/** Seeking to the very end can land past the final sample. */
const TAIL_TRIM_SECONDS = 0.05
/** Progress chases the scroll instead of matching it. The lag is the point. */
const EASE = 0.1
/** The single frame shown when the visitor prefers reduced motion. */
const STILL_PROGRESS = 0.35

export default function GlobalBackdrop() {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let target = 0
    let rendered = 0
    let duration = 0
    let lastSeekAt = 0
    let lastSeekedTo = -1
    let frameId = 0
    let running = false
    let disposed = false

    const seek = (progress: number, now: number, force = false) => {
      if (!duration) return
      const span = Math.max(duration - TAIL_TRIM_SECONDS, 0)
      const time = Math.min(Math.max(progress, 0), 1) * span
      if (!force) {
        if (Math.abs(time - lastSeekedTo) < MIN_SEEK_DELTA_SECONDS) return
        if (now - lastSeekAt < SEEK_THROTTLE_MS) return
      }
      lastSeekAt = now
      lastSeekedTo = time
      video.currentTime = time
    }

    const paint = (now: number) => {
      const delta = target - rendered
      rendered = Math.abs(delta) < 0.0002 ? target : rendered + delta * EASE
      seek(rendered, now)
      setBackdropProgress(rendered)
    }

    const loop = (now: number) => {
      paint(now)
      frameId = requestAnimationFrame(loop)
    }

    const sync = () => {
      const shouldRun = !reduced && !disposed && duration > 0 && !document.hidden
      if (shouldRun && !running) {
        running = true
        frameId = requestAnimationFrame(loop)
      } else if (!shouldRun && running) {
        running = false
        cancelAnimationFrame(frameId)
      }
    }

    const onMetadata = () => {
      if (disposed) return
      duration = Number.isFinite(video.duration) ? video.duration : 0
      if (!duration) return
      // Some mobile browsers will not paint a seeked frame until the element
      // has been played at least once, so prime the decoder and stop again.
      video
        .play()
        .then(() => video.pause())
        .catch(() => {})
      seek(reduced ? STILL_PROGRESS : rendered, performance.now(), true)
      sync()
    }

    video.addEventListener('loadedmetadata', onMetadata)
    if (video.readyState >= 1) onMetadata()
    document.addEventListener('visibilitychange', sync)

    const trigger = reduced
      ? null
      : ScrollTrigger.create({
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            target = self.progress
          },
        })

    return () => {
      disposed = true
      running = false
      cancelAnimationFrame(frameId)
      video.removeEventListener('loadedmetadata', onMetadata)
      document.removeEventListener('visibilitychange', sync)
      trigger?.kill()
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-page"
    >
      <video
        ref={videoRef}
        src={BACKDROP_VIDEO_URL}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        className="absolute inset-0 block h-full w-full object-cover"
      />
      {/*
        Legibility scrim. Light at the top where the hero type sits over the
        calmest part of the frame, heavier at the bottom where the film gets
        busiest. Tuned to keep the clip visible rather than to hide it.
      */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(130% 95% at 50% 0%, rgba(12,12,12,0.18) 0%, rgba(12,12,12,0.52) 52%, rgba(12,12,12,0.84) 100%)',
        }}
      />
    </div>
  )
}
