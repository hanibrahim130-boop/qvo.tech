import { ArrowUpRight } from 'lucide-react'
import { Reveal } from 'scroll-scrub-video'
import DitheredImage from './DitheredImage'
import SectionHead from './SectionHead'

export interface WorkItem {
  id: string
  /** The real client or project name. Never a placeholder. */
  client: string
  discipline: string
  year: string
  /** One true sentence. No invented metrics. */
  summary: string
  /**
   * Same-origin path under `public/work/`. Same-origin matters: the plate
   * reads pixels back off a canvas, and a cross-origin file without CORS
   * headers taints it.
   */
  image: string
  href?: string
}

/**
 * Deliberately empty.
 *
 * What used to be here was four fictional clients with fictional results
 * attached to them. That is worse than an empty portfolio: it is a claim,
 * and the first prospect who searches for "Nimbus Analytics" finds nothing.
 *
 * Add entries here as real cases ship. The layout below already handles a
 * populated list — drop the artwork into `public/work/` and fill this array.
 */
const WORK: WorkItem[] = []

export default function Work() {
  return (
    <section id="work" className="px-5 py-28 sm:px-8 md:px-12 md:py-36">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHead
          index="01"
          label="Selected work"
          title={
            <>
              Work that <em className="axis-wonk font-serif font-normal italic text-accent">earns</em> its
              place.
            </>
          }
        />
      </div>

      {WORK.length > 0 ? (
        <div className="mt-16 flex flex-col gap-20 md:gap-28">
          {WORK.map((project, i) => (
            <Reveal key={project.id} threshold={0.1}>
              <a
                href={project.href ?? `mailto:hello@qvo.tech?subject=${project.client}`}
                data-cursor="view"
                className={`group flex flex-col gap-6 md:items-center md:gap-12 ${
                  i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
                }`}
              >
                <div className="w-full border border-ink/15 md:w-7/12">
                  <DitheredImage
                    src={project.image}
                    alt={`${project.client} — ${project.discipline}`}
                    className="aspect-[16/11] w-full"
                  />
                </div>

                <div className="md:w-5/12">
                  <div className="axis-caption flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/55">
                    <span className="text-accent">{String(i + 1).padStart(2, '0')}</span>
                    <span>{project.discipline}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.year}</span>
                  </div>
                  <h3 className="axis-display mt-4 max-w-md font-display text-3xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-4xl">
                    {project.client}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/65">{project.summary}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 border-b border-ink/25 pb-0.5 text-sm text-ink transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
                    Open case
                    <ArrowUpRight size={15} />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal>
          {/* A press sheet waiting to be run, not a "coming soon" badge. */}
          <div className="mt-16 border border-ink/20 bg-panel/60">
            <div className="flex items-center justify-between border-b border-ink/15 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50 sm:px-8">
              <span>Plate 01</span>
              <span>Awaiting run</span>
            </div>
            <div className="px-5 py-16 sm:px-8 sm:py-24">
              <p className="axis-compressed max-w-3xl font-display text-[clamp(1.75rem,4vw,3.25rem)] font-semibold leading-[1.05] tracking-tight text-ink">
                No case studies yet, because there are no clients yet.
              </p>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink/65 sm:text-base">
                This page previously listed four clients and their results. None of them were
                real. It stays empty until there is work we can name, and then it fills with
                that.
              </p>
              <a
                href="mailto:hello@qvo.tech?subject=Work in progress"
                className="mt-8 inline-flex items-center gap-1.5 border-b border-ink/30 pb-0.5 text-sm text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                Ask to see what is on the press
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </Reveal>
      )}
    </section>
  )
}
