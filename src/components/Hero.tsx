import { useEffect, useRef } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { gsap, useGsapContext } from '../lib/gsap'
import { splitLines } from '../lib/splitText'
import type { SplitResult } from '../lib/splitText'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'
import { onAnchorClick } from '../lib/anchors'
import Magnetic from './Magnetic'

interface HeroProps {
  /** Flips to true as the preloader lifts; starts the intro timeline. */
  started: boolean
}

export default function Hero({ started }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const reduced = usePrefersReducedMotion()

  // Pre-hide the intro elements while the preloader still covers the page.
  useGsapContext(
    () => {
      if (reduced) return
      gsap.set('[data-hero-fade]', { y: 26, opacity: 0 })
    },
    sectionRef,
    [reduced],
  )

  // Intro: masked line reveal for the headline, then the supporting cast.
  useEffect(() => {
    if (!started || reduced) return
    const section = sectionRef.current
    const headline = headlineRef.current
    if (!section || !headline) return

    let split: SplitResult | null = null
    const ctx = gsap.context(() => {
      split = splitLines(headline)
      gsap.set(split.words, { yPercent: 115 })
      gsap.set(headline, { opacity: 1 })
      gsap
        .timeline({
          onComplete: () => {
            split?.revert()
            split = null
          },
        })
        .to(split.words, { yPercent: 0, duration: 1.05, ease: 'power4.out', stagger: 0.055 })
        .to(
          '[data-hero-fade]',
          { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', stagger: 0.09 },
          '-=0.55',
        )
    }, section)

    return () => {
      split?.revert()
      ctx.revert()
    }
  }, [started, reduced])

  // Content recedes as the visitor scrolls out of the hero.
  useGsapContext(
    () => {
      if (reduced) return
      gsap.to(contentRef.current, {
        yPercent: -12,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    },
    sectionRef,
    [reduced],
  )

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex h-[100svh] min-h-[640px] flex-col overflow-hidden"
    >
      {/*
        No local backdrop and no floor fade. GlobalBackdrop paints this section
        and every section after it, so the film runs through unbroken. The
        gradient that used to sit here faded the hero into the showreel; with
        that section gone it only laid an opaque band over the video.
      */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-1 flex-col justify-end px-5 pb-8 pt-28 sm:px-8 md:px-12"
      >
        <div>
          <div data-hero-fade className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-accent motion-safe:animate-pulse" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
              Independent web design studio
            </span>
          </div>

          <h1
            ref={headlineRef}
            className={`max-w-5xl font-display text-[clamp(3rem,9.5vw,8.75rem)] font-medium leading-[0.98] tracking-[-0.02em] text-white ${
              reduced ? '' : 'opacity-0'
            }`}
          >
            Design that drives <em className="font-serif font-normal italic text-accent">growth.</em>
          </h1>

          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p data-hero-fade className="max-w-md text-base leading-relaxed text-white/65 sm:text-lg">
              QVO crafts considered digital experiences that make ambitious brands clear,
              credible, and impossible to ignore.
            </p>

            <div data-hero-fade className="flex flex-wrap items-center gap-3">
              <Magnetic>
                <a
                  href="mailto:hello@qvo.tech"
                  className="inline-flex items-center gap-2 rounded-full bg-lavender px-7 py-3.5 text-sm font-medium text-page transition-colors duration-300 hover:bg-white"
                >
                  Start a project
                  <ArrowUpRight size={16} />
                </a>
              </Magnetic>
              <a
                href="#work"
                onClick={onAnchorClick}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/15"
              >
                See the work
              </a>
            </div>
          </div>
        </div>

        <div
          data-hero-fade
          className="mt-12 flex items-center justify-between border-t border-white/10 pt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45"
        >
          <span className="inline-flex items-center gap-2">
            Scroll to explore
            <ArrowDown size={13} className="motion-safe:animate-bounce" aria-hidden="true" />
          </span>
          <span className="hidden sm:block">Design × Engineering × Motion</span>
          <span>Est. 2026</span>
        </div>
      </div>
    </section>
  )
}
