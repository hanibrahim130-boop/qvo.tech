import { useRef } from 'react'
import { gsap, useGsapContext } from '../lib/gsap'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'

const STEPS = [
  {
    index: '01',
    title: 'Discover',
    copy: 'We interrogate the brief, the market and the metrics until the real problem is obvious.',
    points: ['Stakeholder interviews', 'Audience & competitor audit', 'Positioning workshop'],
  },
  {
    index: '02',
    title: 'Design',
    copy: 'Direction before decoration: identity, layout systems and motion designed as one language.',
    points: ['Creative direction', 'Interactive prototypes', 'Design system'],
  },
  {
    index: '03',
    title: 'Build',
    copy: 'The design ships exactly as approved — fast, accessible and animated at a full 60fps.',
    points: ['Modern stack build', 'WebGL & scroll motion', 'CMS & integrations'],
  },
  {
    index: '04',
    title: 'Launch',
    copy: 'QA, analytics and a measured rollout. Then we keep iterating on what the data says.',
    points: ['Cross-device QA', 'Performance budget', 'Post-launch iteration'],
  },
]

export default function Process() {
  const wrapRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  // Desktop: the vertical scroll of the tall wrapper translates the track
  // horizontally inside a sticky viewport. Mobile/reduced motion: plain stack.
  useGsapContext(
    () => {
      if (reduced) return
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px)', () => {
        gsap.to(trackRef.current, {
          x: () => {
            const track = trackRef.current
            if (!track) return 0
            return -(track.scrollWidth - window.innerWidth)
          },
          ease: 'none',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
      })
      return () => mm.revert()
    },
    wrapRef,
    [reduced],
  )

  const horizontal = !reduced

  return (
    <section
      ref={wrapRef}
      aria-label="Process"
      className={`relative border-t border-white/10 ${horizontal ? 'md:h-[300vh]' : ''}`}
    >
      <div
        className={`${
          horizontal ? 'md:sticky md:top-0 md:flex md:h-screen md:items-center md:overflow-hidden' : ''
        }`}
      >
        <div
          ref={trackRef}
          className={`flex flex-col gap-14 px-5 py-28 sm:px-8 md:px-12 ${
            horizontal ? 'md:w-max md:flex-row md:items-center md:gap-24 md:py-0' : 'md:py-36'
          }`}
        >
          <div className={horizontal ? 'md:w-[38vw] md:shrink-0' : ''}>
            <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">
              <span className="text-accent">—</span>
              <span>How we work</span>
            </div>
            <h2 className="mt-6 font-display text-[clamp(2.5rem,5.5vw,4.5rem)] font-medium leading-[1.02] tracking-tight text-white">
              A process built for <em className="font-serif font-normal italic text-accent">momentum.</em>
            </h2>
            <p className="mt-6 hidden max-w-sm text-sm text-white/55 md:block">
              Four phases, zero mystery — keep scrolling.
            </p>
          </div>

          {STEPS.map((step) => (
            <article
              key={step.index}
              className={`border-l border-white/10 pl-8 ${
                horizontal ? 'md:w-[42vw] md:shrink-0 lg:w-[34vw]' : ''
              }`}
            >
              <span
                aria-hidden="true"
                className="text-outline block font-display text-[5rem] font-bold leading-none sm:text-[7rem]"
              >
                {step.index}
              </span>
              <h3 className="mt-5 font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
                {step.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
                {step.copy}
              </p>
              <ul className="mt-5 flex flex-col gap-2">
                {step.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.15em] text-white/45"
                  >
                    <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
