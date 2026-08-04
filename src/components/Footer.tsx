import { ArrowUp, Hexagon } from 'lucide-react'
import { onAnchorClick } from '../lib/anchors'
import { scrollToTarget } from '../lib/useLenis'

const NAV = [
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#studio', label: 'Studio' },
  { href: '#contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 px-5 pb-8 pt-16 sm:px-8 md:px-12">
      <div className="relative z-10 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2">
            <Hexagon size={22} strokeWidth={1.5} className="text-white" />
            <span className="font-display text-lg font-medium tracking-tight text-white">qvo.tech</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
            Web design for ambitious brands — strategy, identity and websites with cinematic motion.
          </p>
        </div>

        <nav className="md:col-span-3" aria-label="Footer">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Menu</p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {NAV.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={onAnchorClick}
                  className="text-sm text-white/70 transition-colors duration-300 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Elsewhere</p>
          <ul className="mt-4 flex flex-col gap-2.5">
            <li>
              <a
                href="mailto:hello@qvo.tech"
                className="text-sm text-white/70 transition-colors duration-300 hover:text-white"
              >
                hello@qvo.tech
              </a>
            </li>
            <li>
              <a
                href="https://github.com/hanibrahim130-boop/qvo.tech"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-white/70 transition-colors duration-300 hover:text-white"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://github.com/hanibrahim130-boop/qvo.tech/tree/main/packages/scroll-scrub-video"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-white/70 transition-colors duration-300 hover:text-white"
              >
                scroll-scrub-video — our open-source motion kit
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="text-outline pointer-events-none mt-14 select-none text-center font-display text-[26vw] font-bold leading-[0.8] tracking-tight opacity-60"
      >
        QVO
      </div>

      <div className="relative z-10 mt-6 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
          © 2026 QVO Studio — All rights reserved
        </span>
        <button
          type="button"
          onClick={() => scrollToTarget(0)}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 transition-colors duration-300 hover:text-white"
        >
          Back to top
          <ArrowUp size={14} />
        </button>
      </div>
    </footer>
  )
}
