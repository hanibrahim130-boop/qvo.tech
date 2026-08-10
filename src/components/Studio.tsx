import { useRef } from 'react'
import { Reveal } from 'scroll-scrub-video'
import { gsap, useGsapContext } from '../lib/gsap'
import { splitWords } from '../lib/splitText'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'
import DitheredImage from './DitheredImage'
import SectionHead from './SectionHead'

/**
 * Everything on this page has to be true today.
 *
 * What was here before: four counters (24+ projects shipped, 12 industries,
 * 98% client retention, 6 countries) and two testimonials signed by people
 * who do not exist. For a studio that has not shipped its first case, those
 * are not placeholders, they are claims.
 *
 * These four are commitments about how the studio operates, not a scoreboard.
 */
const PRINCIPLES = [
  {
    title: 'You talk to the people building it',
    copy: 'No account managers, no relay. The person who designs it is the person who answers you.',
  },
  {
    title: 'A handful of projects a year',
    copy: 'Capacity is the constraint we protect. Taking on more would mean giving each one less.',
  },
  {
    title: 'Strategy before decoration',
    copy: 'If we cannot say what the site is for, we do not start drawing it.',
  },
  {
    title: 'We hand over the keys',
    copy: 'You own the repository, the domain and the accounts. Nothing is held hostage.',
  },
]

const STATEMENT =
  'We are a small, senior team that takes on a handful of projects a year and gives each one everything: strategy with teeth, design with a point of view, and engineering that makes the whole thing feel effortless.'

/**
 * Builds trust from operating principles and a real studio plate rather than
 * unverifiable counters or testimonials. Word-level scroll emphasis supports
 * the statement, then reverts so the final copy remains ordinary semantic text.
 */
export default function Studio() {
  const sectionRef = useRef<HTMLElement>(null)
  const statementRef = useRef<HTMLParagraphElement>(null)
  const reduced = usePrefersReducedMotion()

  // Statement words darken as they pass through the viewport's focus band.
  useGsapContext(
    () => {
      if (reduced) return
      const statement = statementRef.current
      if (!statement) return
      const split = splitWords(statement)
      gsap.set(split.words, { opacity: 0.18 })
      gsap.to(split.words, {
        opacity: 1,
        ease: 'none',
        stagger: 0.35,
        scrollTrigger: {
          trigger: statement,
          start: 'top 78%',
          end: 'bottom 42%',
          scrub: true,
        },
      })
      return () => split.revert()
    },
    sectionRef,
    [reduced],
  )

  return (
    <section
      ref={sectionRef}
      id="studio"
      className="border-t border-ink/15 px-5 py-28 sm:px-8 md:px-12 md:py-36"
    >
      <SectionHead
        index="03"
        label="The studio"
        title={
          <>
            Small team. <em className="axis-wonk font-serif font-normal italic text-accent">Serious</em>{' '}
            outcomes.
          </>
        }
      />

      <p
        ref={statementRef}
        className="axis-display mt-14 max-w-4xl font-display text-2xl font-medium leading-snug tracking-tight text-ink sm:text-3xl md:text-4xl"
      >
        {STATEMENT}
      </p>

      <div className="mt-20 grid gap-12 md:grid-cols-12 md:gap-10">
        <Reveal className="md:col-span-5">
          {/* First real plate on the site: a same-origin photo, dithered. */}
          <figure className="border border-ink/20">
            <DitheredImage
              src="/studio-portrait.webp"
              alt="A QVO studio consultation"
              className="aspect-[4/5] w-full"
            />
            <figcaption className="axis-caption border-t border-ink/15 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/50">
              Beirut — the studio
            </figcaption>
          </figure>
        </Reveal>

        <div className="grid gap-px bg-ink/15 md:col-span-7 md:grid-cols-2">
          {PRINCIPLES.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <div className="h-full bg-page p-6 sm:p-8">
                <span className="axis-caption font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="axis-display mt-4 font-display text-xl font-semibold leading-tight tracking-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{item.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
