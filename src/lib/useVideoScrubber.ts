import { useCallback, useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { SCENE_FRAME_SECONDS } from './site'

/** Damping time constant: `alpha = 1 - exp(-deltaMs / DAMPING_MS)`. */
const DAMPING_MS = 90
/** Longest frame delta we damp with, so a backgrounded tab cannot lurch. */
const MAX_FRAME_MS = 120
/** Progress differences below this count as settled. */
const PROGRESS_EPSILON = 0.0004
/** Never write a seek that cannot change the decoded frame. */
const MIN_SEEK_SECONDS = SCENE_FRAME_SECONDS / 2
/** Assume a `seeked` event was dropped after this long. */
const SEEK_TIMEOUT_MS = 240
/** Jumps this large (scrollbar drags, anchor jumps) ignore the in-flight guard. */
const FORCE_SEEK_SECONDS = 0.3

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value)

/**
 * Drives a video's playhead from a scroll-progress target.
 *
 * This is the single owner of `video.currentTime` in the app: callers only push
 * a `0…1` target, and one `requestAnimationFrame` loop converts it into seeks
 * with time-based exponential damping. Because the damping is derived from the
 * real frame delta rather than a per-frame factor, the feel is identical on
 * 60Hz and 120Hz displays.
 *
 * Handles reverse scrolling, fast direction changes, scrollbar dragging,
 * resize/orientation changes, a mid-page refresh, and returning from a
 * background tab. The loop parks itself whenever the playhead has settled.
 *
 * @param videoRef the video element to drive
 * @param source the mounted source URL, or `null` when no video is mounted
 * @returns a stable setter for the scroll-progress target
 */
export function useVideoScrubber(
  videoRef: RefObject<HTMLVideoElement | null>,
  source: string | null,
): (progress: number) => void {
  const targetRef = useRef(0)
  const kickRef = useRef<() => void>(() => {})

  useEffect(() => {
    const video = videoRef.current
    if (!video || !source) return

    let frameId: number | null = null
    let lastFrameAt = 0
    let smoothed = targetRef.current
    let appliedTime = -1
    let seekStartedAt = 0
    let snapToTarget = true
    let hasPrimed = false
    let isBroken = false

    /** Last frame of the clip, reached only at the end of the scroll. */
    const seekableEnd = () => {
      const { duration } = video
      if (!Number.isFinite(duration) || duration <= 0) return null
      return Math.max(0, duration - SCENE_FRAME_SECONDS)
    }

    /** The only place in the app that assigns `video.currentTime`. */
    const seek = (time: number) => {
      appliedTime = time
      seekStartedAt = performance.now()
      video.currentTime = time
    }

    const step = (now: number) => {
      frameId = null
      if (isBroken) return

      const end = seekableEnd()
      if (end === null) {
        // Metadata has not arrived; the target stays queued for `loadedmetadata`.
        lastFrameAt = now
        return
      }

      if (snapToTarget) {
        snapToTarget = false
        smoothed = targetRef.current
      } else {
        const deltaMs = Math.min(Math.max(now - lastFrameAt, 0), MAX_FRAME_MS)
        const distance = targetRef.current - smoothed
        smoothed =
          Math.abs(distance) < PROGRESS_EPSILON
            ? targetRef.current
            : smoothed + distance * (1 - Math.exp(-deltaMs / DAMPING_MS))
      }
      lastFrameAt = now

      const settled = Math.abs(targetRef.current - smoothed) < PROGRESS_EPSILON
      const time = Math.min(Math.max(smoothed * end, 0), end)
      const reference = appliedTime < 0 ? video.currentTime : appliedTime
      const drift = Math.abs(time - reference)
      const seekInFlight = video.seeking && now - seekStartedAt < SEEK_TIMEOUT_MS
      const canSeek = video.paused && (!seekInFlight || drift > FORCE_SEEK_SECONDS)
      const needsSeek = drift > MIN_SEEK_SECONDS

      if (needsSeek && canSeek) seek(time)
      if (!settled || (needsSeek && !canSeek)) frameId = requestAnimationFrame(step)
    }

    const kick = () => {
      if (frameId === null && !isBroken) frameId = requestAnimationFrame(step)
    }

    const stop = () => {
      if (frameId === null) return
      cancelAnimationFrame(frameId)
      frameId = null
    }

    /** Re-align with the live target without damping through the gap. */
    const resync = () => {
      snapToTarget = true
      appliedTime = -1
      seekStartedAt = 0
      kick()
    }

    /**
     * iOS Safari will not decode a frame for a video that has never played,
     * which leaves the poster frozen. One muted play/pause cycle primes the
     * decoder; it never assigns `currentTime`.
     */
    const primeDecoder = () => {
      if (hasPrimed) return
      hasPrimed = true
      if (!window.matchMedia('(hover: none) and (pointer: coarse)').matches) return

      void video
        .play()
        .then(() => {
          video.pause()
          resync()
        })
        .catch(() => {
          // Autoplay was refused; the poster stays until a seek decodes a frame.
        })
    }

    const onLoadedMetadata = () => {
      resync()
      primeDecoder()
    }

    const onSeeked = () => {
      seekStartedAt = 0
      kick()
    }

    const onError = () => {
      isBroken = true
      stop()
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') resync()
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('seeked', onSeeked)
    video.addEventListener('error', onError)
    document.addEventListener('visibilitychange', onVisibilityChange)
    kickRef.current = kick

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) onLoadedMetadata()
    else kick()

    return () => {
      kickRef.current = () => {}
      stop()
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('error', onError)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [videoRef, source])

  return useCallback((progress: number) => {
    targetRef.current = clamp01(progress)
    kickRef.current()
  }, [])
}
