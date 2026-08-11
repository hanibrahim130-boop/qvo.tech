import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { onAnchorClick } from '../lib/anchors'
import { prefersReducedMotion } from '../lib/usePrefersReducedMotion'

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#studio', label: 'Studio' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    const pageRegions = [document.querySelector('main'), document.querySelector('footer')]
    const handleMenuKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        return
      }
      if (event.key !== 'Tab' || !headerRef.current) return

      const focusable = Array.from(
        headerRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ).filter((element) => element.getClientRects().length > 0)
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    if (open) {
      pageRegions.forEach((region) => region?.setAttribute('inert', ''))
      window.addEventListener('keydown', handleMenuKeys)
      menuRef.current?.querySelector<HTMLAnchorElement>('a[href]')?.focus()
    }
    if (open && menuRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        menuRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' },
      )
    }
    return () => {
      window.removeEventListener('keydown', handleMenuKeys)
      pageRegions.forEach((region) => region?.removeAttribute('inert'))
      document.documentElement.classList.remove('menu-open')
      if (open) menuButtonRef.current?.focus()
    }
  }, [open])

  return (
    <header
      ref={headerRef}
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-page"
    >
      <div className="relative z-50 flex items-center justify-between px-5 py-4 sm:px-8 md:px-12">
        <a
          href="#work"
          onClick={onAnchorClick}
          className="font-display text-lg font-semibold tracking-tight text-white"
          aria-label="QVO — back to top"
        >
          qvo.tech
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onAnchorClick}
              className="text-sm text-white/75 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="mailto:hello@qvo.tech"
            className="hidden rounded-full border border-white/15 px-5 py-2 text-sm text-white hover:border-accent hover:text-accent md:inline-flex"
          >
            Start a project
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 md:hidden"
          >
            {open ? (
              <span aria-hidden="true" className="block text-xl leading-none text-white">
                ×
              </span>
            ) : (
              <span aria-hidden="true" className="flex flex-col gap-1.5">
                <span className="block h-px w-5 bg-white" />
                <span className="block h-px w-5 bg-white" />
              </span>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col justify-between bg-page px-5 pb-10 pt-28 md:hidden"
        >
          <nav className="flex flex-col gap-2" aria-label="Mobile">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => {
                  setOpen(false)
                  onAnchorClick(event)
                }}
                className="font-wide font-display text-4xl font-semibold tracking-tight text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href="mailto:hello@qvo.tech"
            className="w-max rounded-full border border-white/15 px-6 py-3 text-sm text-white"
          >
            hello@qvo.tech
          </a>
        </div>
      )}
    </header>
  )
}
