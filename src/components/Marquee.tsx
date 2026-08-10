/**
 * Treats one set of unique labels as the source for both visual copies, which
 * keeps the loop seamless without duplicating content in `App`.
 */
interface MarqueeProps {
  /** Unique service labels; values also provide stable keys for the repeated rows. */
  items: string[]
  /** Allows the strip's section-level spacing to be composed by its caller. */
  className?: string
}

/**
 * Uses two identical rows so a single `-50%` translation can loop without a
 * visible reset. Both copies are hidden from assistive technology because the
 * wrapper already exposes the list once through its label.
 */
export default function Marquee({ items, className }: MarqueeProps) {
  const row = (
    <div className="flex w-max items-center gap-10 pr-10" aria-hidden="true">
      {items.map((item) => (
        <span key={item} className="flex items-center gap-10">
          <span className="font-display text-sm font-medium uppercase tracking-[0.3em] text-ink/50">
            {item}
          </span>
          <span className="text-accent">✦</span>
        </span>
      ))}
    </div>
  )

  return (
    <div
      role="marquee"
      aria-label={items.join(', ')}
      className={`relative overflow-hidden border-y border-ink/10 bg-page/60 py-5 ${className ?? ''}`}
    >
      <div className="flex w-max animate-marquee">
        {row}
        {row}
      </div>
    </div>
  )
}
