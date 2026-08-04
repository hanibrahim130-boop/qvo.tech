import { useRef } from 'react'
import { ArrowUpRight, Hexagon } from 'lucide-react'
import { Reveal } from 'scroll-scrub-video'
import { gsap, useGsapContext } from '../lib/gsap'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'
import SectionHead from './SectionHead'

/**
 * Placeholder case studies — swap for real projects as they ship. The
 * thumbnails are generated gradient art so the repo needs no image assets.
 */
const CASES = [
  {
    client: 'Aurelia Watches',
    sector: 'E-commerce',
    year: '2026',
    title: 'A flagship digital boutique for a Swiss micro-brand',
    result: '+212% online revenue in one quarter',
    monogram: 'A',
    art: 'radial-gradient(120% 140% at 20% 10%, #2c3818 0%, #11130a 45%, #0a0a0a 100%)',
  },
  {
    client: 'Nimbus Analytics',
    sector: 'SaaS',
    year: '2025',
    title: 'Turning a dense data platform into a clear story',
    result: '2.4× demo requests after relaunch',
    monogram: 'N',
    art: 'radial-gradient(130% 120% at 80% 15%, #1b2a33 0%, #0d1216 50%, #0a0a0a 100%)',
  },
  {
    client: 'Studio Form',
    sector: 'Architecture',
    year: '2025',
    title: 'A portfolio as considered as the buildings',
    result: 'Shortlisted, Awwwards SOTD',
    monogram: 'F',
    art: 'radial-gradient(120% 130% at 30% 85%, #33241b 0%, #16100c 50%, #0a0a0a 100%)',
  },
  {
    client: 'Volta Mobility',
    sector: 'Automotive',
    year: '2024',
    title: 'Launching an EV startup with cinematic 3D',
    result: '38k waitlist signups at launch',
    monogram: 'V',
    art: 'radial-gradient(140% 120% at 75% 80%, #24182e 0%, #100b14 50%, #0a0a0a 100%)',
  },
]

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  // Gentle parallax on each thumbnail as it crosses the viewport.
  useGsapContext(
    () => {
      if (reduced) return
      gsap.utils.toArray<HTMLElement>('[data-work-thumb]').forEach((thumb) => {
        gsap.fromTo(
          thumb,
          { yPercent: 6 },
          {
            yPercent: -6,
            ease: 'none',
            scrollTrigger: {
              trigger: thumb,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })
    },
    sectionRef,
    [reduced],
  )

  return (
    <section ref={sectionRef} id="work" className="px-5 py-28 sm:px-8 md:px-12 md:py-36">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHead
          index="01"
          label="Selected work"
          title={
            <>
              Work that <em className="font-serif font-normal italic text-accent">works.</em>
            </>
          }
        />
        <Reveal delay={200}>
          <p className="max-w-xs text-sm leading-relaxed text-white/55">
            Four engagements, four sectors — the same obsession with clarity, craft and
            measurable outcomes.
          </p>
        </Reveal>
      </div>

      <div className="mt-16 flex flex-col gap-20 md:gap-28">
        {CASES.map((project, i) => (
          <Reveal key={project.client} threshold={0.1}>
            <a
              href={`mailto:hello@qvo.tech?subject=Case study — ${project.client}`}
              data-cursor="view"
              className={`group flex flex-col gap-6 md:items-center md:gap-12 ${
                i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
              }`}
            >
              <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 md:w-7/12">
                <div
                  data-work-thumb
                  className="relative aspect-[16/11] w-full scale-[1.06] transition-transform duration-700 ease-out group-hover:scale-[1.12]"
                  style={{ backgroundImage: project.art }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center font-serif text-[10rem] italic leading-none text-white/10 sm:text-[13rem]"
                  >
                    {project.monogram}
                  </span>
                  <Hexagon
                    aria-hidden="true"
                    size={20}
                    strokeWidth={1.5}
                    className="absolute left-5 top-5 text-white/30"
                  />
                  <span className="absolute bottom-5 right-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                    {project.client} — {project.year}
                  </span>
                </div>
              </div>

              <div className="md:w-5/12">
                <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                  <span className="text-accent">0{i + 1}</span>
                  <span>{project.sector}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.year}</span>
                </div>
                <h3 className="mt-4 max-w-md font-display text-2xl font-medium leading-snug tracking-tight text-white sm:text-3xl">
                  {project.title}
                </h3>
                <p className="mt-3 text-sm text-white/55">{project.result}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm text-white/75 transition-colors duration-300 group-hover:text-accent">
                  View case study
                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal delay={100}>
        <p className="mt-20 border-t border-white/10 pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
          Full case studies available on request — hello@qvo.tech
        </p>
      </Reveal>
    </section>
  )
}
