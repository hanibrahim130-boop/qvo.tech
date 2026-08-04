import { useCallback, useEffect, useRef } from 'react'
import type { CSSProperties, RefObject } from 'react'
import { useScrollProgress } from './useScrollProgress'

export interface ScrollScrubVideoProps {
	/** Video source URL. Short, well-keyframed MP4 or WebM files scrub best. */
	src: string
	/** Poster image shown until the first frame has decoded. */
	poster?: string
	/**
	 * The scrollable element that drives playback. Omit it to use the document
	 * scroll on `window`.
	 */
	scrollRef?: RefObject<HTMLElement | null> | null
	/** Per-frame easing factor between 0 and 1. Defaults to `0.18`. */
	smoothing?: number
	/**
	 * Minimum milliseconds between seeks. Lower values look smoother but cost
	 * more decoding work. Defaults to `33` (roughly 30fps).
	 */
	seekThrottleMs?: number
	/**
	 * When true (the default), the video stays on its first frame for visitors
	 * who ask for reduced motion.
	 */
	respectReducedMotion?: boolean
	className?: string
	style?: CSSProperties
}

const MIN_SEEK_DELTA_SECONDS = 0.04
const TAIL_TRIM_SECONDS = 0.05

/**
 * A background video whose playhead is driven by scroll position: scrolling
 * seeks the footage instead of playing it, which produces a continuous,
 * film-like backdrop.
 *
 * The element is absolutely positioned and fills its nearest positioned
 * ancestor, so wrap it in a fixed or relative container.
 */
export function ScrollScrubVideo({
	src,
	poster,
	scrollRef,
	smoothing = 0.18,
	seekThrottleMs = 33,
	respectReducedMotion = true,
	className,
	style,
}: ScrollScrubVideoProps) {
	const videoRef = useRef<HTMLVideoElement>(null)
	const lastSeekAt = useRef(0)
	const hasPrimedPlayback = useRef(false)
	const prefersReducedMotion = useRef(false)

	useEffect(() => {
		if (typeof window === 'undefined' || !respectReducedMotion) {
			prefersReducedMotion.current = false
			return
		}

		const query = window.matchMedia('(prefers-reduced-motion: reduce)')
		prefersReducedMotion.current = query.matches

		const handleChange = () => {
			prefersReducedMotion.current = query.matches
		}

		query.addEventListener('change', handleChange)
		return () => query.removeEventListener('change', handleChange)
	}, [respectReducedMotion])

	const handleProgress = useCallback(
		(progress: number) => {
			const video = videoRef.current
			if (!video || prefersReducedMotion.current) return

			const { duration } = video
			if (!Number.isFinite(duration) || duration <= 0) return

			const now = performance.now()
			if (now - lastSeekAt.current < seekThrottleMs) return

			const lastSeekableTime = Math.max(0, duration - TAIL_TRIM_SECONDS)
			const targetTime = Math.min(Math.max(0, progress * lastSeekableTime), lastSeekableTime)

			if (Math.abs(targetTime - video.currentTime) > MIN_SEEK_DELTA_SECONDS) {
				video.currentTime = targetTime
				lastSeekAt.current = now
			}
		},
		[seekThrottleMs],
	)

	const refresh = useScrollProgress({ scrollRef, smoothing, onChange: handleProgress })

	/**
	 * iOS refuses to decode a frame for a video that has never played, which
	 * leaves the poster frozen in place. A single muted play/pause cycle primes
	 * the decoder so seeking works from then on.
	 */
	const handleReady = useCallback(() => {
		const video = videoRef.current
		if (!video) return

		const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches

		if (isTouchDevice && !hasPrimedPlayback.current) {
			hasPrimedPlayback.current = true
			void video
				.play()
				.then(() => {
					video.pause()
					refresh()
				})
				.catch(() => {
					// Autoplay was blocked; the poster stays visible until a frame decodes.
				})
		}

		refresh()
	}, [refresh])

	return (
		<video
			ref={videoRef}
			src={src}
			poster={poster}
			muted
			playsInline
			preload="auto"
			disablePictureInPicture
			aria-hidden="true"
			onLoadedMetadata={handleReady}
			onLoadedData={handleReady}
			className={className}
			style={{
				position: 'absolute',
				inset: 0,
				width: '100%',
				height: '100%',
				objectFit: 'cover',
				pointerEvents: 'none',
				...style,
			}}
		/>
	)
}
