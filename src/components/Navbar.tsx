import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Hexagon, X } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { onAnchorClick } from '../lib/anchors'
import { prefersReducedMotion } from '../lib/usePrefersReducedMotion'
import Magnetic from './Magnetic'

const LINKS = [
  { href: '#work', label: 'Work', sup: '04' },
  { href: '#services', label: 'Services' },
  { href: '#studio', label: 'Studio' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const headerRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const openRef = useRef(open)
  openRef.current = open

  // Hide on scroll down, reveal on scroll up, glass background once scrolled.
  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const reduced = prefersReducedMotion()
    let lastY = window.scrollY
    let hidden = false

    const setHidden = (value: boolean) => {
      if (hidden === value || reduced) return
      hidden = value
      gsap.to(header, {
        yPercent: value ? -110 : 0,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }

    const onScroll = () => {
      const y = window.scrollY
      header.classList.toggle('nav-scrolled', y > 48)
      if (openRef.current || y < 120) {
        setHidden(false)
      } else if (y > lastY + 4) {
        setHidden(true)
      } else if (y < lastY - 4) {
        setHidden(false)
      }
      lastY = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Full-screen mobile menu choreography.
  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return
    const reduced = prefersReducedMotion()
    const links = overlay.querySelectorAll('[data-menu-link]')

    document.documentElement.classList.toggle('menu-open', open)

    if (open) {
      overlay.style.pointerEvents = 'auto'
      if (reduced) {
        gsap.set(overlay, { yPercent: 0 })
        gsap.set(links, { yPercent: 0, opacity: 1 })
      } else {
        gsap
          .timeline()
          .to(overlay, { yPercent: 100, duration: 0.65, ease: 'power4.inOut' })
          .fromTo(
            links,
            { yPercent: 120, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.6, ease: 'power4.out', stagger: 0.06 },
            '-=0.2',
          )
      }
    } else {
      overlay.style.pointerEvents = 'none'
      gsap.to(overlay, {
        yPercent: -100,
        duration: reduced ? 0 : 0.55,
        ease: 'power4.inOut',
        overwrite: 'auto',
      })
    }
  }, [open])

  useEffect(() => {
    return () => document.documentElement.classList.remove('menu-open')
  }, [])

  return (
    <>
      <header
        ref={headerRef}
        className="fixed left-0 right-0 top-0 z-50 border-b border-transparent px-5 py-4 transition-colors duration-300 sm:px-8 md:px-12"
      >
        <div className="flex items-center justify-between">
          <a
            href="#top"
            onClick={onAnchorClick}
            className="flex items-center gap-2"
            aria-label="QVO — back to top"
          >
            <Hexagon size={24} strokeWidth={1.5} className="text-white" />
            <span className="font-display text-lg font-medium tracking-tight text-white sm:text-xl">
              qvo.tech
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex lg:gap-10" aria-label="Primary">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={onAnchorClick}
                className="group relative text-sm text-white/80 transition-colors duration-300 hover:text-white"
              >
                {link.label}
                {link.sup && (
                  <sup className="ml-0.5 font-mono text-[10px] text-accent">{link.sup}</sup>
                )}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-accent transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100"
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Magnetic>
              <a
                href="mailto:hello@qvo.tech"
                className="hidden items-center gap-1.5 rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition-colors duration-300 hover:bg-accent md:inline-flex"
              >
                Start a project
                <ArrowUpRight size={15} />
              </a>
            </Magnetic>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md md:hidden"
            >
              <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
              {open ? (
                <X size={18} />
              ) : (
                <span aria-hidden="true" className="flex flex-col gap-1.5">
                  <span className="block h-px w-5 bg-white" />
                  <span className="block h-px w-5 bg-white" />
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div
        ref={overlayRef}
        id="mobile-menu"
        className="pointer-events-none fixed inset-0 z-40 flex -translate-y-full flex-col justify-between bg-page px-5 pb-10 pt-28"
      >
        <nav className="flex flex-col gap-2" aria-label="Mobile">
          {LINKS.map((link, i) => (
            <span key={link.href} className="block overflow-hidden">
              <a
                data-menu-link
                href={link.href}
                onClick={(event) => {
                  setOpen(false)
                  onAnchorClick(event)
                }}
                className="inline-flex items-baseline gap-3 font-display text-5xl font-medium tracking-tight text-white"
              >
                <span className="font-mono text-xs text-accent">0{i + 1}</span>
                {link.label}
              </a>
            </span>
          ))}
        </nav>
        <div className="flex flex-col gap-4">
          <a
            data-menu-link
            href="mailto:hello@qvo.tech"
            className="inline-flex w-max items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-black"
          >
            Start a project
            <ArrowUpRight size={16} />
          </a>
          <span data-menu-link className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
            hello@qvo.tech — worldwide
          </span>
        </div>
      </div>
    </>
  )
}
