/**
 * The page ground.
 *
 * This used to seek a violet stock film to scroll position. That film was the
 * most generated-looking thing on the site — an abstract fluid gradient is
 * exactly what an image model produces when asked for "premium background" —
 * so it is gone, along with the canvas engine that preceded it.
 *
 * What replaces it is not a picture at all. It is the ruled grid of a paste-up
 * board: a hairline column grid and a baseline rule, sitting under everything
 * at 4-6% ink. It never animates, never decodes, never seeks, and costs two
 * repeating-linear-gradients. The motion on this site now comes from the type
 * and from the plates developing, which is where it should have been.
 */
export default function GlobalBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-page">
      {/* Columns: a 12-part grid on wide screens, halved below. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to right, rgba(20,18,16,0.07) 0 1px, transparent 1px calc(100% / 12))',
          backgroundSize: '100% 100%',
        }}
      />
      {/* Baseline rules, 96px apart, fainter than the columns. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, rgba(20,18,16,0.045) 0 1px, transparent 1px 96px)',
        }}
      />
      {/* Trim marks: the page reads as a sheet with an edge, not a viewport. */}
      <div className="absolute inset-y-0 left-5 w-px bg-ink/10 sm:left-8 md:left-12" />
      <div className="absolute inset-y-0 right-5 w-px bg-ink/10 sm:right-8 md:right-12" />
    </div>
  )
}
