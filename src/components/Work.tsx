import { ArrowUpRight } from 'lucide-react'
import { Reveal } from 'scroll-scrub-video'
import DitheredImage from './DitheredImage'
import SectionHead from './SectionHead'

export interface WorkItem {
  id: string
  /** The real client name, spelled the way the client spells it. */
  client: string
  /** What was actually built. Not a service category. */
  scope: string
  /** Where the business operates. Readable off the site itself. */
  place: string
  /**
   * One or two true sentences describing the brief.
   *
   * There is deliberately no field for results on this type. An earlier
   * version of this file carried invented revenue lifts against invented
   * clients; removing the field entirely is a stronger guarantee than
   * remembering to leave it blank. If a client ever shares a number we are
   * allowed to publish, add it here with their name attached to it.
   */
  summary: string
  /**
   * Same-origin path under `public/work/`. Same-origin is not a preference:
   * DitheredImage reads the pixels back off a canvas, and a cross-origin
   * file served without CORS headers taints that canvas and throws.
   */
  image: string
  /** Written per image, because "Client screenshot" helps nobody. */
  alt: string
  /** Live URL. Optional — an entry without one renders as a figure, not a link. */
  href?: string
}

const WORK: WorkItem[] = [
  {
    id: 'white',
    client: 'White Real Estate Group',
    scope: 'Brokerage site and listings platform',
    place: 'Lebanon',
    summary:
      'Exclusive brokerage and property advisory across residential, commercial and investment assets. The site carries listings, land, and international investment as separate routes, and hands every enquiry straight to WhatsApp.',
    image: '/work/white.webp',
    alt: 'White Real Estate Group homepage: an aerial photograph of a Beirut marina full of yachts, with the wordmark set across it.',
  },
  {
    id: 'brandi',
    client: 'brandi intl',
    scope: 'Brand site and online store',
    place: 'Lebanon · Turkey · KSA · Syria',
    summary:
      'An international concept store working across four markets. The landing page refuses to choose for the visitor: customised projects and the online shop sit side by side as equals.',
    image: '/work/brandi.webp',
    alt: 'brandi intl homepage: a thin white logotype centred on black, with the words International Concept Store ghosted behind it.',
  },
  {
    id: 'ferri',
    client: 'FERRI',
    scope: 'Heritage brand site and showroom booking',
    place: 'Tripoli, since 1959',
    summary:
      'A family furniture and lighting house born in Tripoli in 1959, now selling across Lebanon, Africa and the Gulf. The site is built around the archive rather than the catalogue — heritage, craft and showrooms lead, and the primary action is booking a visit.',
    image: '/work/ferri.webp',
    alt: 'FERRI homepage: a warmly lit interior with a tan leather chesterfield and green velvet armchairs behind the line Rooms That Become Legacy.',
  },
  {
    id: 'cityu',
    client: 'City University',
    scope: 'University site and admissions funnel',
    place: 'Tripoli, North Lebanon',
    summary:
      'Seven faculties on one green campus in North Lebanon. Built bilingual in English and Arabic from the start, and organised so that applying is never more than one action away from wherever the visitor is standing.',
    image: '/work/cityu.webp',
    alt: 'City University homepage: the campus photographed behind a deep blue wash, with the headline International Educational Standards in the heart of Tripoli.',
  },
  {
    id: 'mofa',
    client: 'Mofa Boutique',
    scope: 'Boutique storefront',
    place: 'Saida, Lebanon',
    summary:
      'A small, tightly edited fashion boutique delivering across Lebanon. The whole storefront is arranged around one promise the owner can actually keep: chosen with care, ordered in a tap.',
    image: '/work/mofa.webp',
    alt: 'Mofa Boutique homepage: a cream page with a rail of pale dresses photographed against a white wall.',
  },
  {
    id: 'mouttahed',
    client: 'Mouttahed Basketball Academy',
    scope: 'Academy site and trial booking',
    place: 'Tripoli',
    summary:
      'Youth basketball on the Al Mouttahed Tripoli club pathway, from Mini Basket through U18. Bilingual, photographed with the academy\u2019s own teams rather than stock, and every route ends at booking a trial on WhatsApp.',
    image: '/work/mouttahed.webp',
    alt: 'Mouttahed Basketball Academy homepage: the U18 girls team celebrating on court beside the line Where champions begin.',
  },
]

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
          {WORK.map((project, i) => {
            const body = (
              <>
                <div className="w-full border border-ink/15 md:w-7/12">
                  <DitheredImage src={project.image} alt={project.alt} className="aspect-[2/1] w-full" />
                </div>

                <div className="md:w-5/12">
                  <div className="axis-caption flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/55">
                    <span className="text-accent">{String(i + 1).padStart(2, '0')}</span>
                    <span>{project.place}</span>
                  </div>
                  <h3 className="axis-display mt-4 max-w-md font-display text-3xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-4xl">
                    {project.client}
                  </h3>
                  <p className="axis-caption mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/55">
                    {project.scope}
                  </p>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/70">{project.summary}</p>
                  {project.href ? (
                    <span className="mt-6 inline-flex items-center gap-1.5 border-b border-ink/25 pb-0.5 text-sm text-ink transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
                      Visit site
                      <ArrowUpRight size={15} />
                    </span>
                  ) : null}
                </div>
              </>
            )

            const layout = `group flex flex-col gap-6 md:items-center md:gap-12 ${
              i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
            }`

            return (
              <Reveal key={project.id} threshold={0.1}>
                {project.href ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-cursor="view"
                    className={layout}
                  >
                    {body}
                  </a>
                ) : (
                  <figure className={`${layout} m-0`}>{body}</figure>
                )}
              </Reveal>
            )
          })}
        </div>
      ) : (
        <Reveal>
          <div className="mt-16 border border-ink/20 bg-panel/60 px-5 py-16 sm:px-8 sm:py-24">
            <p className="axis-compressed max-w-3xl font-display text-[clamp(1.75rem,4vw,3.25rem)] font-semibold leading-[1.05] tracking-tight text-ink">
              Nothing on the press right now.
            </p>
            <a
              href="mailto:hello@qvo.tech?subject=Work in progress"
              className="mt-8 inline-flex items-center gap-1.5 border-b border-ink/30 pb-0.5 text-sm text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              Ask what is coming next
              <ArrowUpRight size={15} />
            </a>
          </div>
        </Reveal>
      )}
    </section>
  )
}
