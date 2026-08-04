import type { ReactNode } from 'react'
import { Reveal } from 'scroll-scrub-video'

interface SectionHeadProps {
  index: string
  label: string
  title: ReactNode
  className?: string
}

/** Consistent section opener: `04 — LABEL` eyebrow plus a large display title. */
export default function SectionHead({ index, label, title, className }: SectionHeadProps) {
  return (
    <div className={className}>
      <Reveal>
        <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">
          <span className="text-accent">{index}</span>
          <span className="h-px w-12 bg-white/20" aria-hidden="true" />
          <span>{label}</span>
        </div>
      </Reveal>
      <Reveal delay={120}>
        <h2 className="mt-6 max-w-4xl font-display text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[1.02] tracking-tight text-white">
          {title}
        </h2>
      </Reveal>
    </div>
  )
}
