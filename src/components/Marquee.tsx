interface MarqueeProps {
  items: string[]
  className?: string
}

/** An infinitely-looping text strip. Two copies translate -50% for a seamless loop. */
export default function Marquee({ items, className }: MarqueeProps) {
  const row = (
    <div className="flex w-max items-center gap-10 pr-10" aria-hidden="true">
      {items.map((item) => (
        <span key={item} className="flex items-center gap-10">
          <span className="font-display text-sm font-medium uppercase tracking-[0.3em] text-white/50">
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
      className={`relative overflow-hidden border-y border-white/10 bg-page/60 py-5 ${className ?? ''}`}
    >
      <div className="flex w-max animate-marquee">
        {row}
        {row}
      </div>
    </div>
  )
}
