# scroll-scrub-video

Scroll-scrubbed background video and reveal-on-scroll primitives for React. Scrolling **seeks** the video instead of playing it, which is what gives scroll-driven marketing sites their continuous, film-like feel.

These primitives were extracted from the [QVO](https://qvo.tech) website so they can be used on their own. No Tailwind, no CSS file to import, no runtime dependency beyond React.

- **`ScrollScrubVideo`** — maps scroll progress onto `video.currentTime`, with throttled seeking, poster fallback, and an iOS decoder workaround.
- **`Reveal`** — an `IntersectionObserver` wrapper that fades and lifts children into view with a configurable delay.
- **`useScrollProgress`** — the underlying hook: normalised `0…1` scroll progress with per-frame smoothing, for any element or the window.

Everything honours `prefers-reduced-motion`.

## Install

```bash
npm install scroll-scrub-video
```

React 18 or newer is required as a peer dependency. The package ships TypeScript sources and is consumed through the `exports` field, so any modern bundler (Vite, Next.js, Rspack, Parcel) can build it directly.

## Usage

### Full-screen background video driven by a scroll container

```tsx
import { useRef } from 'react'
import { ScrollScrubVideo } from 'scroll-scrub-video'

export default function Page() {
	const scrollRef = useRef<HTMLDivElement>(null)

	return (
		<>
			<div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#0a0a0a' }}>
				<ScrollScrubVideo src="/hero.mp4" poster="/hero-poster.jpg" scrollRef={scrollRef} />
			</div>

			<div ref={scrollRef} style={{ position: 'relative', zIndex: 10, height: '100dvh', overflowY: 'auto' }}>
				{/* Sections go here. Add enough height for the footage to play through. */}
			</div>
		</>
	)
}
```

### Driven by the document scroll

Omit `scrollRef` and the component tracks `window` instead:

```tsx
<ScrollScrubVideo src="/hero.mp4" poster="/hero-poster.jpg" />
```

### Staggered reveals

```tsx
import { Reveal } from 'scroll-scrub-video'

<Reveal delay={0}>
	<h1>Design that drives growth.</h1>
</Reveal>
<Reveal delay={120}>
	<p>Considered digital experiences for ambitious brands.</p>
</Reveal>
```

### The hook on its own

```tsx
import { useRef, useState } from 'react'
import { useScrollProgress } from 'scroll-scrub-video'

function ProgressBar() {
	const [progress, setProgress] = useState(0)
	useScrollProgress({ onChange: setProgress, smoothing: 0.12 })

	return <div style={{ width: `${progress * 100}%`, height: 2, background: 'white' }} />
}
```

## API

### `<ScrollScrubVideo />`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | — | Video source URL. Required. |
| `poster` | `string` | — | Image shown until the first frame decodes. |
| `scrollRef` | `RefObject<HTMLElement \| null>` | `window` | Scrollable element driving playback. |
| `smoothing` | `number` | `0.18` | Per-frame easing factor between 0 and 1. `1` disables smoothing. |
| `seekThrottleMs` | `number` | `33` | Minimum milliseconds between seeks. |
| `respectReducedMotion` | `boolean` | `true` | Hold the first frame for reduced-motion visitors. |
| `className` | `string` | — | Applied to the `<video>` element. |
| `style` | `CSSProperties` | — | Merged over the built-in positioning styles. |

The video is absolutely positioned and fills its nearest positioned ancestor, so wrap it in a `fixed` or `relative` container.

### `<Reveal />`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | Content to reveal. Required. |
| `delay` | `number` | `0` | Milliseconds to wait after entering the viewport. |
| `distance` | `number` | `32` | Pixels travelled upward while fading in. |
| `duration` | `number` | `700` | Transition duration in milliseconds. |
| `threshold` | `number` | `0.15` | Visible fraction required to trigger. |
| `once` | `boolean` | `true` | When `false`, hides again on exit. |
| `className` | `string` | — | Applied to the wrapper element. |
| `style` | `CSSProperties` | — | Merged over the animation styles. |

### `useScrollProgress(options)`

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `onChange` | `(progress: number) => void` | — | Called each frame with smoothed `0…1` progress. Required. |
| `scrollRef` | `RefObject<HTMLElement \| null>` | `window` | Element to track. |
| `smoothing` | `number` | `0.18` | Per-frame easing factor. |

Returns a `refresh()` function that re-measures scroll position on demand — useful after layout changes or once async media has loaded.

## Tips for smooth scrubbing

- Keep the video short (5–10 seconds) and encode it with **frequent keyframes**; seeking is only as fast as the nearest keyframe. `ffmpeg -i in.mp4 -g 10 -crf 24 -movflags +faststart out.mp4` is a reasonable starting point.
- Serve at most 1080p. Scrubbing decodes frames on demand, so resolution costs more here than in normal playback.
- Always set a `poster`. Mobile browsers may show nothing at all until the first frame is decoded.
- Raise `seekThrottleMs` on low-end devices if scrolling feels heavy; lower it for buttery desktop scrubbing.

## Roadmap

- Prebuilt ESM/CJS output with type declarations via `tsup`
- Canvas-based frame cache option for very heavy footage
- Image-sequence source as an alternative to video
- Automated tests and a hosted demo

## License

MIT
