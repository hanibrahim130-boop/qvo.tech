import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

/**
 * Keeps reveal timing declarative while the component owns observation and
 * reduced-motion fallbacks. Callers can compose choreography without reaching
 * into the observer lifecycle or hiding content themselves.
 */
export interface RevealProps {
	/** Content remains in normal document flow so visibility never changes layout. */
	children: ReactNode
	/** Offsets sibling entrances without requiring several observer instances. */
	delay?: number
	/** Keeps travel proportional to the surrounding composition. Defaults to `32`. */
	distance?: number
	/** Lets a consumer match local motion tempo. Defaults to `700`. */
	duration?: number
	/** Delays activation until enough content is meaningful. Defaults to `0.15`. */
	threshold?: number
	/** Set false only when repeated entrances communicate state rather than decoration. */
	once?: boolean
	/** Composes layout on the wrapper without coupling the package to a CSS system. */
	className?: string
	/** Allows host-specific layout values while transition ownership stays internal. */
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
