import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

export interface RevealProps {
	children: ReactNode
	/** Milliseconds to wait after the element enters the viewport. */
	delay?: number
	/** Pixels to travel upward while fading in. Defaults to `32`. */
	distance?: number
	/** Transition duration in milliseconds. Defaults to `700`. */
	duration?: number
	/** Fraction of the element that must be visible to trigger. Defaults to `0.15`. */
	threshold?: number
	/** When false, the element hides again after leaving the viewport. */
	once?: boolean
	className?: string
	style?: CSSProperties
}

/**
 * Fades and lifts its children into view the first time they enter the
 * viewport. Stagger a group of them with increasing `delay` values to
 * choreograph a whole section.
 *
 * Visitors who ask for reduced motion, and environments without
 * `IntersectionObserver`, see the content immediately.
 */
export function Reveal({
	children,
	delay = 0,
	distance = 32,
	duration = 700,
	threshold = 0.15,
	once = true,
	className,
	style,
}: RevealProps) {
	const ref = useRef<HTMLDivElement>(null)
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const element = ref.current
		if (!element) return

		if (typeof IntersectionObserver === 'undefined') {
			setIsVisible(true)
			return
		}

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			setIsVisible(true)
			return
		}

		let timeoutId: number | undefined

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						timeoutId = window.setTimeout(() => setIsVisible(true), delay)
						if (once) observer.unobserve(entry.target)
					} else if (!once) {
						setIsVisible(false)
					}
				})
			},
			{ threshold },
		)

		observer.observe(element)

		return () => {
			if (timeoutId !== undefined) window.clearTimeout(timeoutId)
			observer.disconnect()
		}
	}, [delay, once, threshold])

	return (
		<div
			ref={ref}
			className={className}
			style={{
				opacity: isVisible ? 1 : 0,
				transform: isVisible ? 'translateY(0)' : `translateY(${distance}px)`,
				transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
				willChange: 'opacity, transform',
				...style,
			}}
		>
			{children}
		</div>
	)
}
