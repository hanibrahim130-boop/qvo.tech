import type { ReactNode } from 'react'
import { Reveal } from 'scroll-scrub-video'

/**
 * Keeps section hierarchy consistent while allowing each title to carry real
 * inline emphasis. The contract separates navigational numbering from visible
 * copy so neither has to be parsed out of a single string.
 */
interface SectionHeadProps {
  /** Printed sequence marker used to orient long-page scanning. */
  index: string
  /** Short eyebrow that names the section independently of its headline. */
  label: string
  /** Rich heading content, including the deliberate Fraunces emphasis runs. */
  title: ReactNode
  /** Lets a section position the shared opener without forking its typography. */
  className?: string
}

/**
 * Centralises the repeated eyebrow-and-title rhythm so visual hierarchy cannot
 * drift as sections evolve. `ReactNode` titles preserve semantic emphasis
 * instead of forcing callers to inject HTML strings.
 */
export default function SectionHead({ index, label, title, className }: SectionHeadProps) {
  return (
    <div className={className}>
      <Reveal>
        <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
          <span className="text-accent">{index}</span>
          <span className="h-px w-12 bg-ink/20" aria-hidden="true" />
          <span>{label}</span>
        </div>
      </Reveal>
      <Reveal delay={120}>
        <h2 className="mt-6 max-w-4xl font-display text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[1.02] tracking-tight text-ink">
          {title}
        </h2>
      </Reveal>
    </div>
  )
}
