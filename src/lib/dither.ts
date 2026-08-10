/**
 * Ordered (Bayer) dithering.
 *
 * Why this and not a CSS filter: CSS can posterise and it can blur, but it
 * cannot threshold per pixel against a repeating matrix, which is what makes
 * a halftone read as *printed* rather than as a photo with an effect on it.
 * Running it on a canvas also means the output is genuinely two colours, so
 * any photograph — including stock — stops looking like stock and starts
 * looking art-directed.
 *
 * The matrix is the classic 8x8 Bayer threshold map, values 0-63. A pixel is
 * pushed to the next tone up when its fractional brightness exceeds the
 * matrix value at its coordinates, which distributes quantisation error in a
 * fixed, regular pattern instead of the cloudy noise you get from
 * error-diffusion. Regular is the point: it looks like a press screen.
 */

const BAYER_SIZE = 8

const BAYER_8 = new Uint8Array([
  0, 32, 8, 40, 2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44, 4, 36, 14, 46, 6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
  3, 35, 11, 43, 1, 33, 9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47, 7, 39, 13, 45, 5, 37,
  63, 31, 55, 23, 61, 29, 53, 21,
])

export type Rgb = readonly [number, number, number]

export interface DitherOptions {
  /** Side of one dither cell in device pixels. 1 is fine, 10 is chunky. */
  cell: number
  /** Output tone count. 2 is pure one-bit; 4 gives a coarse duotone ramp. */
  levels: number
  /** Colour for tone 0. */
  ink: Rgb
  /** Colour for the top tone. */
  paper: Rgb
  /** Contrast applied around mid grey before thresholding. */
  contrast: number
}

/**
 * A single reusable scratch canvas. The source image is drawn into it at the
 * reduced cell resolution, dithered there, then blown back up with smoothing
 * off. Downsampling first is what gives the cells their size — dithering at
 * full resolution and scaling afterwards would just blur the pattern.
 */
let scratch: HTMLCanvasElement | null = null

function getScratch(width: number, height: number): CanvasRenderingContext2D | null {
  if (!scratch) scratch = document.createElement('canvas')
  if (scratch.width !== width) scratch.width = width
  if (scratch.height !== height) scratch.height = height
  return scratch.getContext('2d', { willReadFrequently: true })
}

function clamp01(value: number): number {
  if (value < 0) return 0
  if (value > 1) return 1
  return value
}

/**
 * Draw `source` into `target`, dithered.
 *
 * `target` must already be sized. The source is fitted with a cover crop so
 * the plate never letterboxes.
 */
export function drawDithered(
  target: HTMLCanvasElement,
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  options: DitherOptions,
): void {
  const ctx = target.getContext('2d')
  if (!ctx || target.width === 0 || target.height === 0) return
  if (sourceWidth === 0 || sourceHeight === 0) return

  const cell = Math.max(1, Math.round(options.cell))
  const lowW = Math.max(1, Math.round(target.width / cell))
  const lowH = Math.max(1, Math.round(target.height / cell))

  const low = getScratch(lowW, lowH)
  if (!low) return

  // Cover crop: scale to the larger ratio, centre the overflow.
  const scale = Math.max(lowW / sourceWidth, lowH / sourceHeight)
  const drawW = sourceWidth * scale
  const drawH = sourceHeight * scale
  low.clearRect(0, 0, lowW, lowH)
  low.drawImage(source, (lowW - drawW) / 2, (lowH - drawH) / 2, drawW, drawH)

  const frame = low.getImageData(0, 0, lowW, lowH)
  const data = frame.data
  const levels = Math.max(2, Math.round(options.levels))
  const steps = levels - 1
  const [ir, ig, ib] = options.ink
  const [pr, pg, pb] = options.paper
  const contrast = options.contrast

  for (let y = 0; y < lowH; y += 1) {
    const row = (y % BAYER_SIZE) * BAYER_SIZE
    for (let x = 0; x < lowW; x += 1) {
      const i = (y * lowW + x) * 4

      // Rec. 709 luma. Perceptual weighting matters here: an even average
      // turns skies and skin into the same tone and the plate goes flat.
      const luma = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255
      const pushed = clamp01((luma - 0.5) * contrast + 0.5)

      const threshold = (BAYER_8[row + (x % BAYER_SIZE)] + 0.5) / 64
      const scaled = pushed * steps
      const base = Math.floor(scaled)
      const stepped = scaled - base > threshold ? base + 1 : base
      const tone = Math.min(steps, stepped) / steps

      data[i] = ir + (pr - ir) * tone
      data[i + 1] = ig + (pg - ig) * tone
      data[i + 2] = ib + (pb - ib) * tone
      data[i + 3] = 255
    }
  }

  low.putImageData(frame, 0, 0)

  ctx.imageSmoothingEnabled = false
  ctx.clearRect(0, 0, target.width, target.height)
  ctx.drawImage(scratch as HTMLCanvasElement, 0, 0, lowW, lowH, 0, 0, target.width, target.height)
}

/** Parse `#rrggbb` into an RGB triple. Falls back to black on bad input. */
export function hexToRgb(hex: string): Rgb {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!match) return [0, 0, 0]
  const value = parseInt(match[1], 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}
