import { useCallback, useEffect, useRef } from 'react'
import type { RefObject } from 'react'

export interface UseScrollProgressOptions {
	/**
	 * The scrollable element to track. Omit it (or pass null) to track the
	 * document scroll on `window` instead.
	 */
	scrollRef?: RefObject<HTMLElement | null> | null
	/**
	 * Per-frame easing factor between 0 and 1. Lower values feel heavier and
	 * smoother, `1` disables smoothing and follows the scroll position exactly.
	 * Defaults to `0.18`.
	 */
	smoothing?: number
	/** Called with the smoothed progress, normalised to the `0…1` range. */
	onChange: (progress: number) => void
}

const EPSILON = 0.0005

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/**
 * Tracks scroll position as a normalised `0…1` progress value and reports it on
 * every animation frame, with optional per-frame smoothing.
 *
 * Returns a `refresh` function that re-measures the scroll position on demand,
 * which is useful after layout changes or once async media has loaded.
 */
export function useScrollProgress({
	scrollRef,
	smoothing = 0.18,
	onChange,
}: UseScrollProgressOptions): () => void {
	const onChangeRef = useRef(onChange)
	onChangeRef.current = onChange

	const targetProgress = useRef(0)
	const smoothedProgress = useRef(0)
	const frameId = useRef<number | null>(null)
	const measureRef = useRef<() => void>(() => {})

	useEffect(() => {
		if (typeof window === 'undefined') return

		const element = scrollRef?.current ?? null
		const factor = clamp01(smoothing)

		const animate = () => {
			const delta = targetProgress.current - smoothedProgress.current

			smoothedProgress.current =
				factor >= 1 || Math.abs(delta) < EPSILON
					? targetProgress.current
					: smoothedProgress.current + delta * factor

			onChangeRef.current(smoothedProgress.current)

			if (Math.abs(targetProgress.current - smoothedProgress.current) >= EPSILON) {
				frameId.current = requestAnimationFrame(animate)
			} else {
				frameId.current = null
			}
		}

		const schedule = () => {
			if (frameId.current === null) {
				frameId.current = requestAnimationFrame(animate)
			}
		}

		const measure = () => {
			if (element) {
				const maxScroll = element.scrollHeight - element.clientHeight
				targetProgress.current = maxScroll > 0 ? clamp01(element.scrollTop / maxScroll) : 0
			} else {
				const maxScroll = document.documentElement.scrollHeight - window.innerHeight
				targetProgress.current = maxScroll > 0 ? clamp01(window.scrollY / maxScroll) : 0
			}
			schedule()
		}

		measureRef.current = measure

		const scrollSource: EventTarget = element ?? window
		scrollSource.addEventListener('scroll', measure, { passive: true })
		window.addEventListener('resize', measure)
		measure()

		return () => {
			scrollSource.removeEventListener('scroll', measure)
			window.removeEventListener('resize', measure)
			if (frameId.current !== null) {
				cancelAnimationFrame(frameId.current)
				frameId.current = null
			}
			measureRef.current = () => {}
		}
	}, [scrollRef, smoothing])

	return useCallback(() => measureRef.current(), [])
}
