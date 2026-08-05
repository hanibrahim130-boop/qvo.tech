/**
 * Progressive frame-sequence player for the global backdrop.
 *
 * Optional. When /backdrop/manifest.json exists, GlobalBackdrop scrubs a
 * rendered film instead of drawing the procedural one. The loading strategy is
 * the whole point:
 *
 * 1. Fetch a coarse pass (every 8th frame) so scrubbing is usable almost
 *    immediately.
 * 2. Fill in neighbours in the scroll direction, at most a few requests at a
 *    time, so the network is never saturated.
 * 3. Never show a hole: frameAt() returns the nearest decoded frame, so the
 *    film gets sharper as it loads instead of flashing black.
 */

export type FrameSequenceManifest = {
  /** Absolute directory, e.g. "/backdrop/desktop". */
  dir: string
  count: number
  /** Zero-padding width of the frame number. Default 4. */
  pad?: number
  /** File extension without the dot. Default "avif". */
  ext?: string
  /** Filename prefix. Default "frame_". */
  prefix?: string
  /** Painted while a frame is still decoding. */
  averageColor?: string
}

export type BackdropManifest = {
  desktop?: FrameSequenceManifest
  mobile?: FrameSequenceManifest
}

export type Frame = {
  source: CanvasImageSource
  width: number
  height: number
}

const COARSE_STRIDE = 8
const PREFETCH_AHEAD = 15
const MAX_CONCURRENT = 6

export function pickSequence(
  manifest: BackdropManifest,
): FrameSequenceManifest | null {
  const portrait = window.matchMedia(
    '(max-width: 820px), (orientation: portrait)',
  ).matches
  const chosen = portrait
    ? manifest.mobile ?? manifest.desktop
    : manifest.desktop ?? manifest.mobile
  return chosen ?? null
}

export class FrameSequence {
  readonly count: number
  readonly averageColor: string

  private readonly manifest: FrameSequenceManifest
  private readonly frames = new Map<number, Frame>()
  private readonly inFlight = new Set<number>()
  private queue: number[] = []
  private disposed = false
  private firstReady = false

  constructor(manifest: FrameSequenceManifest) {
    this.manifest = manifest
    this.count = Math.max(1, Math.floor(manifest.count))
    this.averageColor = manifest.averageColor ?? '#0C0C0C'
  }

  get ready(): boolean {
    return this.firstReady
  }

  /** Resolves once the first frame is on screen; keeps loading in background. */
  async loadCoarse(): Promise<void> {
    const indices: number[] = []
    for (let i = 0; i < this.count; i += COARSE_STRIDE) indices.push(i)
    if (indices[indices.length - 1] !== this.count - 1) {
      indices.push(this.count - 1)
    }

    await this.load(indices[0])
    this.firstReady = !this.disposed && this.frames.size > 0
    this.enqueue(indices.slice(1))
    void this.drain()
  }

  /** Nearest decoded frame, so a partially loaded sequence never shows a hole. */
  frameAt(index: number): Frame | null {
    const wanted = Math.min(this.count - 1, Math.max(0, index))
    const exact = this.frames.get(wanted)
    if (exact) return exact

    for (let offset = 1; offset <= COARSE_STRIDE * 2; offset += 1) {
      const before = this.frames.get(wanted - offset)
      if (before) return before
      const after = this.frames.get(wanted + offset)
      if (after) return after
    }
    return null
  }

  /** Load ahead of the playhead, in the direction the user is scrolling. */
  prefetch(index: number, direction: number): void {
    if (this.disposed) return
    const step = direction < 0 ? -1 : 1
    const wanted: number[] = []

    for (let i = 0; i < PREFETCH_AHEAD; i += 1) {
      const candidate = index + i * step
      if (candidate < 0 || candidate >= this.count) break
      if (!this.frames.has(candidate) && !this.inFlight.has(candidate)) {
        wanted.push(candidate)
      }
    }

    if (wanted.length > 0) {
      this.queue = [
        ...wanted,
        ...this.queue.filter((i) => !wanted.includes(i)),
      ]
      void this.drain()
    }
  }

  dispose(): void {
    this.disposed = true
    this.queue = []
    for (const frame of this.frames.values()) {
      if (
        typeof ImageBitmap !== 'undefined' &&
        frame.source instanceof ImageBitmap
      ) {
        frame.source.close()
      }
    }
    this.frames.clear()
  }

  private enqueue(indices: number[]): void {
    for (const index of indices) {
      if (!this.frames.has(index) && !this.inFlight.has(index)) {
        this.queue.push(index)
      }
    }
  }

  private async drain(): Promise<void> {
    while (
      !this.disposed &&
      this.queue.length > 0 &&
      this.inFlight.size < MAX_CONCURRENT
    ) {
      const next = this.queue.shift()
      if (next === undefined) return
      void this.load(next)
    }
  }

  private async load(index: number): Promise<void> {
    if (this.disposed) return
    if (this.frames.has(index) || this.inFlight.has(index)) return
    this.inFlight.add(index)

    try {
      const frame = await decode(this.urlFor(index))
      if (this.disposed) {
        if (
          typeof ImageBitmap !== 'undefined' &&
          frame.source instanceof ImageBitmap
        ) {
          frame.source.close()
        }
        return
      }
      this.frames.set(index, frame)
      this.firstReady = true
    } catch {
      // A missing frame is survivable: frameAt falls back to its neighbour.
    } finally {
      this.inFlight.delete(index)
      if (!this.disposed) void this.drain()
    }
  }

  private urlFor(index: number): string {
    const pad = this.manifest.pad ?? 4
    const ext = this.manifest.ext ?? 'avif'
    const prefix = this.manifest.prefix ?? 'frame_'
    const dir = this.manifest.dir.replace(/\/$/, '')
    return `${dir}/${prefix}${String(index + 1).padStart(pad, '0')}.${ext}`
  }
}

async function decode(url: string): Promise<Frame> {
  const response = await fetch(url, { cache: 'force-cache' })
  if (!response.ok) throw new Error(`frame ${url}: ${response.status}`)
  const blob = await response.blob()

  if (typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(blob)
    return { source: bitmap, width: bitmap.width, height: bitmap.height }
  }

  // Older Safari. The object URL is intentionally not revoked: the element
  // keeps drawing from it for the lifetime of the sequence.
  const objectUrl = URL.createObjectURL(blob)
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image()
    element.decoding = 'async'
    element.onload = () => resolve(element)
    element.onerror = () => reject(new Error(`frame ${url}: decode failed`))
    element.src = objectUrl
  })
  return { source: image, width: image.naturalWidth, height: image.naturalHeight }
}
