# Global backdrop

One continuous, scroll-driven film behind the whole site.

It exists to fix a specific problem: the page used to carry six unrelated
background treatments (a hero CSS gradient, a WebGL orb that died after one
viewport, an opaque pinned showreel, four case-study cards in four unrelated
hues, a lime contact glow, and a lime accent token). Each one was fine alone.
Together they read as six themes, which is the single loudest "cheap" signal a
site can send.

## Architecture

- `src/components/GlobalBackdrop.tsx` mounts one `<canvas>` at
  `fixed inset-0 z-0`. Everything else lives in a `relative z-10` wrapper.
  Existing layers are untouched: noise overlay 90, navbar 50, mobile menu 40,
  cursor 200/210, preloader 300.
- One master ScrollTrigger publishes progress. There is deliberately no second
  scroll listener: `useLenis` already calls `ScrollTrigger.update()` on every
  Lenis scroll and drives `gsap.ticker`, so a second system would desync.
- Progress is eased toward its target every frame (`EASE = 0.12`). The film
  keeps moving for a beat after the wheel stops. That lag is what reads as
  expensive.
- `src/lib/proceduralBackdrop.ts` holds the art direction and draws it in
  canvas 2D. Zero asset bytes, correct on first paint.
- `src/lib/frameSequence.ts` scrubs a rendered image sequence instead, but only
  if `/backdrop/manifest.json` exists.
- `src/lib/backdropProgress.ts` is a 30-line store so other components can read
  the film's position without their own listener.

## Chapters

Eight beats of one camera move, not eight effects.

| # | Chapter | Anchor | Intent |
|---|---------|--------|--------|
| 1 | hero | `#top` | Brightest close-up, bloom high right behind the headline |
| 2 | showreel | `section[aria-label="Showreel"]` | Pressed near-black (scrim 0.62) so the opaque video reads as a deliberate cut |
| 3 | work | `#work` | Opens left and wide; the case cards sit in the same violet family |
| 4 | services | `#services` | Light crosses to the right |
| 5 | process | `section[aria-label="Process"]` | Drops low and widest during the horizontal pin |
| 6 | studio | `#studio` | Rises back up, warmer |
| 7 | contact | `#contact` | Brightest frame on the page; the bloom replaces the old lime glow |
| 8 | footer | `footer` | Sinks below the fold |

Chapters are keyed to **measured** offsets, not equal slices of the document.
This matters: `Showreel` is `280vh` pinned and `Process` is `300vh` pinned on
desktop, so roughly 40% of real scroll distance happens inside two sections.
Equal eighths would be out of sync with what is on screen. Offsets are
re-measured on every `ScrollTrigger.refresh()` and on resize.

If an anchor selector ever stops matching, that chapter falls back to an even
slice. A rename degrades the timing; it does not break the page.

## Performance

- Six flat canvas passes per frame, no per-pixel loops, no WebGL context.
- Device pixel ratio is capped at 2.
- The loop pauses on `visibilitychange`.
- `prefers-reduced-motion` renders a single still frame and never starts the
  loop or the ScrollTrigger.
- Removing `Hero3D` takes three.js (~600 KB) out of the bundle.

## Adding a rendered film later

Drop frames plus a manifest into `public/backdrop/` and the component switches
over on the next load, with no code change. See `public/backdrop/README.md`.

Budget: 4 MB total for desktop. If the sequence cannot hit that, keep the
procedural film. A slow premium backdrop is worse than a fast one.

## Wiring checklist

The backdrop is inert until it is mounted. Remaining edits:

- [ ] `src/App.tsx` - render `<GlobalBackdrop />` and wrap `<main>` + `<Footer>`
      in `<div className="relative z-10">`
- [ ] `src/components/Hero.tsx` - delete the local radial gradient and the
      lazy `Hero3D` mount; keep only the bottom fade into the next section
- [ ] `src/components/Work.tsx` - retune the four case gradients to one violet
      ramp (four depths of the same family, not four hues)
- [ ] `src/components/Contact.tsx` - delete the lime radial glow
- [ ] `tailwind.config.cjs` + `src/index.css` - `accent` to `#8B6FE8`, add
      `lavender` `#D2C3F6`, align `page` with the canvas base `#0C0C0C`,
      update `::selection` and `:focus-visible`
- [ ] delete `src/components/Hero3D.tsx` and drop `three` / `@types/three`
