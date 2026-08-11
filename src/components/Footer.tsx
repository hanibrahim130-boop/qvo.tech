import { onAnchorClick } from '../lib/anchors'

const NAV = [
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#studio', label: 'Studio' },
  { href: '#contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-5 pb-8 pt-16 sm:px-8 md:px-12">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <span className="font-display text-lg font-semibold tracking-tight text-white">
            qvo.tech
          </span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
            Independent web design studio in Lebanon.
          </p>
        </div>

        <nav className="md:col-span-3" aria-label="Footer">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Menu</p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {NAV.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={onAnchorClick}
                  className="text-sm text-white/70 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
            Elsewhere
          </p>
          <ul className="mt-4 flex flex-col gap-2.5">
            <li>
              <a
                href="mailto:hello@qvo.tech"
                className="text-sm text-white/70 hover:text-white"
              >
                hello@qvo.tech
              </a>
            </li>
            <li>
              <a
                href="https://github.com/hanibrahim130-boop/qvo.tech"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-white/70 hover:text-white"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
          © 2026 QVO
        </span>
        <a
          href="#work"
          onClick={onAnchorClick}
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-white"
        >
          Back to top
        </a>
      </div>
    </footer>
  )
}
