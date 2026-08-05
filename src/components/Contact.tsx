import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from 'scroll-scrub-video'
import { gsap, useGsapContext } from '../lib/gsap'
import { splitLines } from '../lib/splitText'
import type { SplitResult } from '../lib/splitText'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'
import Magnetic from './Magnetic'

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const reduced = usePrefersReducedMotion()

  // Masked line reveal, played once when the heading enters the viewport.
  useGsapContext(
    () => {
      const heading = headingRef.current
      if (!heading || reduced) return
      let split: SplitResult | null = splitLines(heading)
      gsap.set(split.words, { yPercent: 115 })
      gsap.to(split.words, {
        yPercent: 0,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.05,
        scrollTrigger: { trigger: heading, start: 'top 82%', once: true },
        onComplete: () => {
          split?.revert()
          split = null
        },
      })
      return () => split?.revert()
    },
    sectionRef,
    [reduced],
  )

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-white/10 px-5 py-32 text-center sm:px-8 md:px-12 md:py-44"
    >
      {/*
        The local glow is gone. This is the brightest chapter of the global
        backdrop, so the bloom behind this section is the film itself.
      */}

      <Reveal>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">
          Have a project in mind?
        </p>
      </Reveal>

      <h2
        ref={headingRef}
        className="mx-auto mt-8 max-w-4xl font-display text-[clamp(2.75rem,8vw,7rem)] font-medium leading-[1.0] tracking-tight text-white"
      >
        Let&rsquo;s make your brand <em className="font-serif font-normal italic text-accent">matter.</em>
      </h2>

      <Reveal delay={150}>
        <div className="mt-12 flex flex-col items-center gap-6">
          <Magnetic strength={0.4}>
            <a
              href="mailto:hello@qvo.tech"
              className="inline-flex items-center gap-2.5 rounded-full bg-lavender px-9 py-4 text-base font-medium text-page transition-colors duration-300 hover:bg-white sm:px-10 sm:py-5"
            >
              Book a call
              <ArrowUpRight size={18} />
            </a>
          </Magnetic>
          <a
            href="mailto:hello@qvo.tech"
            className="text-sm text-white/55 underline decoration-white/20 underline-offset-4 transition-colors duration-300 hover:text-white"
          >
            hello@qvo.tech
          </a>
          <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
            <span className="h-1.5 w-1.5 rounded-full bg-accent motion-safe:animate-pulse" aria-hidden="true" />
            Now booking — Q4 2026
          </p>
        </div>
      </Reveal>
    </section>
  )
}
