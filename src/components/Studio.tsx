import { useRef } from 'react'
import { Reveal } from 'scroll-scrub-video'
import { gsap, useGsapContext } from '../lib/gsap'
import { splitWords } from '../lib/splitText'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'
import SectionHead from './SectionHead'

const STATS = [
  { value: 24, suffix: '+', label: 'Projects shipped' },
  { value: 12, suffix: '', label: 'Industries served' },
  { value: 98, suffix: '%', label: 'Client retention' },
  { value: 6, suffix: '', label: 'Countries reached' },
]

/** Placeholder testimonials — swap for real client quotes. */
const QUOTES = [
  {
    quote:
      'QVO made our launch feel like a film premiere — and the numbers followed the applause.',
    name: 'Elena Marsh',
    role: 'Founder, Aurelia Watches',
  },
  {
    quote: 'The rare studio that sweats the strategy as hard as the pixels.',
    name: 'Daniel Roe',
    role: 'CMO, Nimbus Analytics',
  },
]

const STATEMENT =
  'We are a small, senior team that takes on a handful of projects a year and gives each one everything: strategy with teeth, design with a point of view, and engineering that makes the whole thing feel effortless.'

export default function Studio() {
  const sectionRef = useRef<HTMLElement>(null)
  const statementRef = useRef<HTMLParagraphElement>(null)
  const reduced = usePrefersReducedMotion()

  // Statement words brighten as they pass through the viewport's focus band.
  useGsapContext(
    () => {
      if (reduced) return
      const statement = statementRef.current
      if (!statement) return
      const split = splitWords(statement)
      gsap.set(split.words, { opacity: 0.16 })
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

  // Stat counters tick up the first time they enter the viewport.
  useGsapContext(
    () => {
      if (reduced) return
      gsap.utils.toArray<HTMLElement>('[data-counter]').forEach((el) => {
        const target = Number(el.dataset.counter ?? '0')
        const state = { value: 0 }
        gsap.to(state, {
          value: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(state.value))
          },
        })
      })
    },
    sectionRef,
    [reduced],
  )

  return (
    <section
      ref={sectionRef}
      id="studio"
      className="border-t border-white/10 px-5 py-28 sm:px-8 md:px-12 md:py-36"
    >
      <SectionHead
        index="03"
        label="The studio"
        title={
          <>
            Small team. <em className="font-serif font-normal italic text-accent">Serious</em> outcomes.
          </>
        }
      />

      <p
        ref={statementRef}
        className="mt-14 max-w-4xl font-display text-2xl font-medium leading-snug tracking-tight text-white sm:text-3xl md:text-4xl"
      >
        {STATEMENT}
      </p>

      <div className="mt-20 grid gap-12 md:grid-cols-12 md:gap-10">
        <Reveal className="md:col-span-5">
          <div className="flex items-center gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <img
              src="/studio-portrait.webp"
              alt="A QVO studio consultation"
              loading="lazy"
              className="h-28 w-24 rounded-xl object-cover"
            />
            <div>
              <p className="text-sm font-medium text-white">Direct access, no account managers.</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                You talk to the people doing the work — from kickoff to launch.
              </p>
              <a
                href="mailto:hello@qvo.tech"
                className="mt-3 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-accent"
              >
                Book a call →
              </a>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:col-span-7">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 90}>
              <div className="border-l border-white/10 pl-5">
                <div className="font-display text-5xl font-medium tracking-tight text-white sm:text-6xl">
                  <span data-counter={stat.value}>{reduced ? stat.value : 0}</span>
                  <span className="text-accent">{stat.suffix}</span>
                </div>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-24 grid gap-10 md:grid-cols-2 md:gap-14">
        {QUOTES.map((item, i) => (
          <Reveal key={item.name} delay={i * 120}>
            <figure className="border-t border-white/10 pt-8">
              <blockquote className="font-serif text-2xl italic leading-snug text-white/85 sm:text-3xl">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                {item.name} — {item.role}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
