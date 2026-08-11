import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { onAnchorClick } from '../lib/anchors'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'

interface WorkItem {
  id: string
  client: string
  detail?: string
  file: string
  width: number
  height: number
}

const WORK: WorkItem[] = [
  {
    id: 'white',
    client: 'WHITE Real Estate Group',
    file: '/work/white.webp',
    width: 1600,
    height: 711,
  },
  {
    id: 'brandi',
    client: 'brandi intl',
    file: '/work/brandi.webp',
    width: 1600,
    height: 716,
  },
  {
    id: 'ferri',
    client: 'FERRI',
    detail: 'Furniture house since 1959 · Tripoli',
    file: '/work/ferri.webp',
    width: 1600,
    height: 723,
  },
  {
    id: 'cityu',
    client: 'City University',
    detail: 'Tripoli',
    file: '/work/cityu.webp',
    width: 1600,
    height: 731,
  },
  {
    id: 'mofa',
    client: 'Mofa Boutique',
    detail: 'Saida',
    file: '/work/mofa.webp',
    width: 1600,
    height: 730,
  },
  {
    id: 'mouttahed',
    client: 'Mouttahed Basketball Academy',
    detail: 'Tripoli',
    file: '/work/mouttahed.webp',
    width: 1600,
    height: 725,
  },
]

interface PanelProps {
  item: WorkItem
  index: number
  first: boolean
}

function Panel({ item, index, first }: PanelProps) {
  return (
    <div className="relative flex min-h-[72svh] w-full items-center justify-center px-5 py-20 sm:px-8 md:h-[100svh] md:min-h-0 md:px-12 md:py-0">
      <div className="w-full max-w-[1180px]">
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">
          <span className="text-accent">0{index + 1}</span>
          <span>{WORK.length} projects</span>
        </div>

        <div className="mt-3 overflow-hidden rounded-md border border-white/10 bg-panel">
          <img
            src={item.file}
            alt={`${item.client} website`}
            width={item.width}
            height={item.height}
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'auto'}
            decoding="async"
            className="h-auto w-full"
          />
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 className="font-wide font-display text-[clamp(1.9rem,5vw,3.75rem)] font-semibold leading-[0.98] tracking-tight text-white">
              {item.client}
            </h2>
            {item.detail && (
              <p className="mt-2 text-sm text-white/55 sm:text-base">{item.detail}</p>
            )}
          </div>
          <a
            href={`mailto:hello@qvo.tech?subject=${encodeURIComponent(item.client)}`}
            className="inline-flex w-max items-center gap-1.5 text-sm text-white/75 hover:text-accent"
          >
            Enquire
            <span aria-hidden="true">→</span>
          </a>
        </div>

        {first && (
          <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-white/60">
              QVO is an independent web design studio in Lebanon.
            </p>
            <a
              href="#services"
              onClick={onAnchorClick}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-white/60 hover:text-accent"
            >
              Scroll to explore
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Desktop: the six projects scroll as one continuous pinned sequence — the
 * section is six screens tall and the sticky viewport slides the track upward
 * on a scrubbed ScrollTrigger (transform only). Mobile: the same panels stack
 * naturally, full-screen, with no pinning.
 */
function WorkMotion() {
  const wrapRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!wrap || !viewport || !track) return

    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      gsap.to(track, {
        y: () => -(track.scrollHeight - viewport.clientHeight),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleY(${self.progress})`
            }
            if (indexRef.current) {
              const n = Math.min(
                WORK.length,
                Math.round(self.progress * (WORK.length - 1)) + 1,
              )
              indexRef.current.textContent = String(n).padStart(2, '0')
            }
          },
        },
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section ref={wrapRef} id="work" aria-label="Selected work" className="relative md:h-[600svh]">
      <h1 className="sr-only">
        QVO — independent web design studio in Lebanon. Selected client work.
      </h1>

      <div
        ref={viewportRef}
        className="relative md:sticky md:top-0 md:h-screen md:overflow-hidden"
      >
        <div ref={trackRef} className="relative flex flex-col will-change-transform">
          {WORK.map((item, i) => (
            <Panel key={item.id} item={item} index={i} first={i === 0} />
          ))}
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 right-6 hidden font-mono text-[11px] uppercase tracking-[0.25em] text-white/50 md:block"
        >
          <span ref={indexRef} className="text-white/80">
            01
          </span>
          <span> / {WORK.length}</span>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 top-0 hidden w-px bg-white/10 md:block"
      >
        <div
          ref={progressRef}
          className="h-full w-full origin-top bg-accent will-change-transform"
          style={{ transform: 'scaleY(0)' }}
        />
      </div>
    </section>
  )
}

/**
 * Reduced motion: a plain, stacked list of the real work. No pin, no scrub,
 * no transforms — this branch is the only one rendered when the visitor asks
 * for reduced motion.
 */
function WorkReduced() {
  return (
    <section
      id="work"
      aria-label="Selected work"
      className="mx-auto max-w-[1600px] px-5 pt-28 sm:px-8 md:px-12 md:pt-32"
    >
      <h1 className="font-wide font-display text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[0.98] tracking-tight text-white">
        Selected work
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
        QVO is an independent web design studio in Lebanon. Recent client work:
      </p>

      <ol className="mt-14 flex flex-col">
        {WORK.map((item, i) => (
          <li
            key={item.id}
            className="grid gap-5 border-t border-white/10 py-10 md:grid-cols-12 md:gap-10 md:py-14"
          >
            <div className="md:col-span-8">
              <img
                src={item.file}
                alt={`${item.client} website`}
                width={item.width}
                height={item.height}
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : 'auto'}
                decoding="async"
                className="h-auto w-full rounded-md border border-white/10"
              />
            </div>
            <div className="flex flex-col justify-center md:col-span-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                0{i + 1}
              </span>
              <h2 className="mt-2 font-wide font-display text-3xl font-semibold tracking-tight text-white">
                {item.client}
              </h2>
              {item.detail && (
                <p className="mt-2 text-sm text-white/55">{item.detail}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default function Work() {
  const reduced = usePrefersReducedMotion()
  return reduced ? <WorkReduced /> : <WorkMotion />
}
