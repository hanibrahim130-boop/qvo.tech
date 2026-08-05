/**
 * QVO - procedural backdrop
 *
 * The choreography for the single film that runs behind the entire page,
 * drawn in canvas 2D. This is not a fallback: it is the shipped design, it
 * ships zero bytes of assets, and it works on first paint. If a rendered
 * frame sequence is later dropped into /public/backdrop, GlobalBackdrop
 * swaps to it and keeps using this file for the chapter map, the scrim and
 * the reduced-motion still.
 *
 * Everything is normalised (0 -> 1) so the same numbers hold at 360px and
 * 3440px.
 */

export const PALETTE = {
  base: '#0C0C0C',
  jet: '#1D1D1D',
  brand: '#36255C',
  accent: '#8B6FE8',
  lavender: '#D2C3F6',
} as const

export type BackdropState = {
  /** Bloom centre, as a fraction of the viewport. */
  bloomX: number
  bloomY: number
  /** Bloom radius, as a multiple of the viewport's long edge. */
  radius: number
  /** 0 = deep brand violet, 1 = light lavender. */
  tone: number
  /** Overall brightness of the wash. */
  intensity: number
  /** Density of the drifting dust field. */
  dust: number
  /** Extra black laid on top, used to protect opaque sections. */
  scrim: number
}

export type BackdropChapter = BackdropState & {
  id: string
  /** DOM selector for the section that opens this chapter. */
  selector: string
}

export type DustMote = {
  x: number
  y: number
  z: number
  size: number
  phase: number
}

/**
 * One camera move, eight beats. Read top to bottom: an extreme close-up on the
 * hero, pressed almost black behind the opaque showreel, then opening wider
 * through the work until the contact section is the brightest frame on the
 * page, and finally sinking below the fold.
 *
 * Selectors point at markup that already exists. If one goes missing the
 * chapter falls back to an even slice, so a rename degrades instead of
 * breaking.
 */
export const CHAPTERS: readonly BackdropChapter[] = [
  { id: 'hero', selector: '#top', bloomX: 0.72, bloomY: 0.4, radius: 0.55, tone: 0.85, intensity: 1, dust: 1, scrim: 0.06 },
  { id: 'showreel', selector: 'section[aria-label="Showreel"]', bloomX: 0.5, bloomY: 0.55, radius: 0.34, tone: 0.55, intensity: 0.22, dust: 0.3, scrim: 0.62 },
  { id: 'work', selector: '#work', bloomX: 0.24, bloomY: 0.34, radius: 0.72, tone: 0.7, intensity: 0.6, dust: 0.55, scrim: 0.3 },
  { id: 'services', selector: '#services', bloomX: 0.8, bloomY: 0.58, radius: 0.66, tone: 0.62, intensity: 0.52, dust: 0.45, scrim: 0.34 },
  { id: 'process', selector: 'section[aria-label="Process"]', bloomX: 0.38, bloomY: 0.72, radius: 0.88, tone: 0.5, intensity: 0.48, dust: 0.4, scrim: 0.36 },
  { id: 'studio', selector: '#studio', bloomX: 0.66, bloomY: 0.3, radius: 0.78, tone: 0.72, intensity: 0.6, dust: 0.55, scrim: 0.3 },
  { id: 'contact', selector: '#contact', bloomX: 0.5, bloomY: 0.48, radius: 1.05, tone: 0.95, intensity: 0.88, dust: 0.85, scrim: 0.2 },
  { id: 'footer', selector: 'footer', bloomX: 0.5, bloomY: 1.02, radius: 0.85, tone: 0.42, intensity: 0.42, dust: 0.3, scrim: 0.16 },
]

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/**
 * Holds at each chapter, then moves decisively. A crossfade of equal weight
 * reads as mush; a hold plus a committed move reads as a cut.
 */
function holdCurve(t: number): number {
  const e = clamp01((t - 0.12) / 0.76)
  return e * e * e * (e * (e * 6 - 15) + 10)
}

function hexToRgb(hex: string): [number, number, number] {
  const raw = hex.replace('#', '')
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw
  const int = parseInt(full, 16)
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255]
}

function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${Math.round(clamp01(alpha) * 1000) / 1000})`
}

function mix(from: string, to: string, amount: number): string {
  const a = hexToRgb(from)
  const b = hexToRgb(to)
  const t = clamp01(amount)
  const channel = (index: 0 | 1 | 2) =>
    Math.round(lerp(a[index], b[index], t))
      .toString(16)
      .padStart(2, '0')
  return `#${channel(0)}${channel(1)}${channel(2)}`
}

export function baseWithAlpha(alpha: number): string {
  return rgba(PALETTE.base, alpha)
}

function evenStops(): number[] {
  return CHAPTERS.map((_, index) => index / CHAPTERS.length)
}

function normaliseStops(stops?: readonly number[]): number[] {
  if (stops && stops.length === CHAPTERS.length) return [...stops]
  return evenStops()
}

/**
 * Where each chapter actually begins, as a fraction of total scrollable
 * distance. Measured rather than assumed, because Showreel (280vh) and
 * Process (300vh on desktop) are pinned: roughly 40% of real scroll happens
 * inside two sections, so even slices would drift out of sync with the page.
 *
 * Call again on every ScrollTrigger refresh and on resize.
 */
export function measureChapterStops(): number[] {
  const doc = document.documentElement
  const total = Math.max(1, doc.scrollHeight - window.innerHeight)
  const scrollY = window.scrollY || doc.scrollTop || 0
  const stops: number[] = []
  let previous = 0

  CHAPTERS.forEach((chapter, index) => {
    if (index === 0) {
      stops.push(0)
      return
    }
    const element = document.querySelector(chapter.selector)
    const fallback = index / CHAPTERS.length
    const measured = element
      ? (element.getBoundingClientRect().top + scrollY) / total
      : fallback
    const value = Math.min(0.999, Math.max(previous + 0.01, measured))
    previous = value
    stops.push(value)
  })

  return stops
}

/** The film's state at a given progress, blended between chapters. */
export function sampleChapters(
  progress: number,
  stops?: readonly number[],
): BackdropState {
  const p = clamp01(progress)
  const marks = normaliseStops(stops)

  let index = 0
  for (let i = 0; i < marks.length; i += 1) {
    if (p >= marks[i]) index = i
  }

  const from = CHAPTERS[index]
  const to = CHAPTERS[Math.min(index + 1, CHAPTERS.length - 1)]
  const start = marks[index]
  const end = index + 1 < marks.length ? marks[index + 1] : 1
  const t = holdCurve(clamp01((p - start) / Math.max(0.0001, end - start)))

  return {
    bloomX: lerp(from.bloomX, to.bloomX, t),
    bloomY: lerp(from.bloomY, to.bloomY, t),
    radius: lerp(from.radius, to.radius, t),
    tone: lerp(from.tone, to.tone, t),
    intensity: lerp(from.intensity, to.intensity, t),
    dust: lerp(from.dust, to.dust, t),
    scrim: lerp(from.scrim, to.scrim, t),
  }
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Seeded so the dust field is identical on every load and every device. */
export function createDustField(count: number): DustMote[] {
  const random = mulberry32(0x9e3779b9)
  const motes: DustMote[] = []
  for (let i = 0; i < count; i += 1) {
    motes.push({
      x: random(),
      y: random(),
      z: 0.25 + random() * 0.75,
      size: 0.6 + random() * 1.6,
      phase: random() * Math.PI * 2,
    })
  }
  return motes
}

/** One frame of the film. Six cheap passes, no per-pixel work. */
export function drawBackdrop(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: BackdropState,
  dust: readonly DustMote[],
  time: number,
): void {
  const long = Math.max(width, height)
  const breathe = 1 + Math.sin(time * 0.22) * 0.03
  const cx = state.bloomX * width
  const cy = state.bloomY * height
  const radius = Math.max(1, state.radius * long * 1.35 * breathe)

  ctx.globalAlpha = 1
  ctx.fillStyle = PALETTE.base
  ctx.fillRect(0, 0, width, height)

  // Counter-bloom: a dim violet on the opposite side gives the frame depth.
  const ax = (1 - state.bloomX) * width
  const ay = (1 - state.bloomY * 0.7) * height
  const counter = ctx.createRadialGradient(ax, ay, 0, ax, ay, radius * 1.15)
  counter.addColorStop(0, rgba(PALETTE.brand, 0.16 * state.intensity))
  counter.addColorStop(1, rgba(PALETTE.base, 0))
  ctx.fillStyle = counter
  ctx.fillRect(0, 0, width, height)

  // Key light.
  const warm = mix(PALETTE.brand, PALETTE.lavender, state.tone * 0.6)
  const core = mix(PALETTE.accent, PALETTE.lavender, state.tone * 0.45)
  const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
  bloom.addColorStop(0, rgba(core, 0.3 * state.intensity))
  bloom.addColorStop(0.22, rgba(warm, 0.22 * state.intensity))
  bloom.addColorStop(0.55, rgba(PALETTE.brand, 0.13 * state.intensity))
  bloom.addColorStop(1, rgba(PALETTE.base, 0))
  ctx.fillStyle = bloom
  ctx.fillRect(0, 0, width, height)

  // Horizon: one flat band keeps the composition from floating.
  const horizonY = clamp01(state.bloomY + 0.28) * height
  const horizon = ctx.createLinearGradient(0, horizonY, 0, height)
  horizon.addColorStop(0, rgba(PALETTE.jet, 0))
  horizon.addColorStop(0.6, rgba(PALETTE.jet, 0.28 * state.intensity))
  horizon.addColorStop(1, rgba(PALETTE.base, 0.55))
  ctx.fillStyle = horizon
  ctx.fillRect(0, horizonY, width, height - horizonY)

  // Dust, lit only where the key light reaches.
  if (state.dust > 0.01 && dust.length > 0) {
    ctx.fillStyle = PALETTE.lavender
    for (let i = 0; i < dust.length; i += 1) {
      const mote = dust[i]
      const drift = time * 0.012 * mote.z
      const x = ((mote.x + drift) % 1) * width
      const y =
        ((mote.y + Math.sin(time * 0.15 + mote.phase) * 0.01 + 1) % 1) * height
      const falloff = clamp01(1 - Math.hypot(x - cx, y - cy) / radius)
      ctx.globalAlpha =
        0.5 *
        state.dust *
        mote.z *
        falloff *
        (0.55 + Math.sin(time + mote.phase) * 0.45)
      const size = mote.size * mote.z
      ctx.fillRect(x, y, size, size)
    }
    ctx.globalAlpha = 1
  }

  // Vignette, then the section scrim.
  const vignette = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.2,
    width / 2,
    height / 2,
    long * 0.78,
  )
  vignette.addColorStop(0, rgba(PALETTE.base, 0))
  vignette.addColorStop(1, rgba(PALETTE.base, 0.72))
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, width, height)

  if (state.scrim > 0.001) {
    ctx.fillStyle = baseWithAlpha(state.scrim)
    ctx.fillRect(0, 0, width, height)
  }
}
