# Dither engine

QVO turns portfolio photography into two-ink press plates instead of placing
ordinary full-colour screenshots on top of the paper system. The treatment is
implemented locally in two layers:

- [`src/lib/dither.ts`](../src/lib/dither.ts) owns the pixel algorithm.
- [`src/components/DitheredImage.tsx`](../src/components/DitheredImage.tsx)
  connects that algorithm to image loading, canvas sizing, scroll progress and
  reduced-motion preferences.

The ruled page ground in
[`src/components/GlobalBackdrop.tsx`](../src/components/GlobalBackdrop.tsx) is
separate. It is a static CSS paste-up grid; there is no video, video seeking or
shared backdrop-progress store.

## Why ordered dithering

CSS filters can desaturate, increase contrast and posterise an image, but they
cannot threshold each pixel against a repeating screen. QVO uses an 8×8 Bayer
matrix because its regular structure reads like a mechanical press pattern.
Error-diffusion algorithms deliberately scatter error into neighbouring pixels;
that makes a good photograph, but a softer and less repeatable plate.

Canvas is required because the final pixels are genuinely quantised into a
small palette. The effect is not a transparent texture laid over an unchanged
photograph.

## Rendering pipeline

`drawDithered()` receives a source image, an already-sized destination canvas
and a `DitherOptions` object. One render follows this sequence:

1. Round `cell` to at least one device pixel and derive a reduced working size
   from the destination canvas.
2. Draw a centred `cover` crop into one reusable scratch canvas. Working at the
   reduced size creates deliberate cells before any thresholding happens.
3. Convert every source pixel to Rec. 709 luma. Perceptual weighting keeps
   greens, skin and skies from collapsing into the same apparent brightness.
4. Push luma around mid-grey with the configured contrast.
5. Compare the fractional tone with the matching value in the repeating 8×8
   Bayer matrix, then quantise it to the requested number of levels.
6. Interpolate each level between ink and paper and write a fully opaque pixel.
7. Scale the scratch canvas back to the destination with smoothing disabled so
   the press cells keep hard edges.

The production palette is:

```ts
ink:   [20, 18, 16]   // #141210
paper: [237, 233, 225] // #EDE9E1
```

`hexToRgb()` keeps those values readable at the call site while the renderer
works with numeric triples.

## How a plate develops on scroll

`DitheredImage` loads its source once and stores it outside React state because
scroll frames should repaint a canvas, not re-render a component tree. It uses
the existing GSAP `ScrollTrigger` integration rather than registering another
window scroll listener.

From `top bottom` to `center center`, progress is eased with smoothstep and maps
to two decisions:

| State | Cell size | Tone levels |
| --- | ---: | ---: |
| Entering viewport | 9 device pixels | 2 |
| Past 55% progress | interpolating toward 2 | 4 |
| Fully developed | 2 device pixels | 4 |

That change is intentionally a develop, not a fade: the image arrives as a
coarse one-bit screen and resolves into a finer four-tone plate. Paint requests
are coalesced through one `requestAnimationFrame`, so resize and scroll updates
cannot queue duplicate work in the same frame.

A `ResizeObserver` keeps the backing canvas aligned with its rendered box. The
backing resolution follows device pixel ratio but is capped at 2×; denser
canvases cost more while making the cells too fine to read as print.

When `prefers-reduced-motion: reduce` is active, the component skips the
scroll trigger and paints the fully developed plate immediately. The content
and alt text therefore remain available without an animation dependency.

## Source-image constraint

Sources must currently be same-origin paths, normally under `public/work/`.
The renderer calls `getImageData()` on the scratch canvas. Drawing a remote
image without the correct CORS request mode and response headers taints that
canvas, and the browser then blocks pixel reads with a security exception.
`DitheredImage` deliberately does not pretend a remote URL is safe; use a local
asset instead.

Portfolio plates are displayed at a 2:1 aspect ratio and use a centred cover
crop. Choose a source whose important subject survives that crop. Alt text is
provided to the canvas through `role="img"` and `aria-label`; write it for the
specific visible image rather than describing the dither effect.

## Adding or replacing a plate

1. Put the optimised image in `public/work/`.
2. Add or update its `image` and truthful `alt` values in
   [`src/components/Work.tsx`](../src/components/Work.tsx).
3. Run the site and check the crop at mobile and desktop widths.
4. Scroll the plate from below the viewport to its developed state.
5. Test reduced motion and confirm the fine plate appears without scrolling.
6. Check the console for canvas security errors and verify the canvas is not
   blank after a production build.

Change `COARSE_CELL`, `FINE_CELL`, the level switch or contrast only as a single
art-direction decision. Those values establish a shared print language across
all work images; tuning each client image separately would turn the system back
into a collection of unrelated effects.
