import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, useGsapContext } from '../lib/gsap'
import { CLIENTS, SCENES, SERVICES } from '../lib/site'

export default function CinematicExperience() {
  const sectionRef = useRef<HTMLElement>(null)

  useGsapContext(
    () => {
      if (!sectionRef.current) return

      const select = gsap.utils.selector(sectionRef)
      const leftGate = select('.gate--left')
      const rightGate = select('.gate--right')
      const brand = select('.brand-core')
      const vault = select('.scene-vault')
      const serviceWords = select('.service-word')
      const focusNames = select('.client-focus-name')
      const clientGrid = select('.client-grid')
      const endCue = select('.end-cue')
      const introMeta = select('.intro-meta')
      const scrollCue = select('.scroll-cue')
      const [openingStart] = SCENES.opening
      const [servicesStart] = SCENES.services
      const [clientsStart] = SCENES.clients
      const [resolveStart] = SCENES.resolve

      gsap.set(serviceWords, { opacity: 0, y: 76, scale: 0.86 })
      gsap.set(focusNames, { opacity: 0, x: '28vw', xPercent: -50, yPercent: -50, scale: 0.86 })
      gsap.set(clientGrid, { opacity: 0, y: 36, scale: 0.96 })
      gsap.set(endCue, { opacity: 0, y: 18 })

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.35,
          invalidateOnRefresh: true,
        },
      })

      timeline
        .to(introMeta, { opacity: 0, y: -24, duration: 0.08 }, 0.07)
        .to(scrollCue, { opacity: 0, y: 18, duration: 0.07 }, 0.08)
        .to(brand, { scale: 0.72, opacity: 0.14, duration: 0.18 }, openingStart)
        .to(leftGate, { xPercent: -108, rotateY: -7, duration: 0.3 }, openingStart)
        .to(rightGate, { xPercent: 108, rotateY: 7, duration: 0.3 }, openingStart)
        .to(vault, { scale: 1.18, yPercent: -3, duration: 0.3 }, openingStart)

      serviceWords.forEach((word, index) => {
        timeline.to(
          word,
          { opacity: 1, y: 0, scale: 1, duration: 0.09, ease: 'power3.out' },
          servicesStart + index * 0.065,
        )
      })

      timeline.to(serviceWords, { opacity: 0, y: -52, duration: 0.08 }, 0.62)

      focusNames.forEach((name, index) => {
        const start = clientsStart + 0.01 + index * 0.041
        timeline
          .to(name, { opacity: 1, x: 0, scale: 1, duration: 0.016, ease: 'power2.out' }, start)
          .to(
            name,
            { opacity: 0, x: '-24vw', scale: 1.08, duration: 0.017, ease: 'power2.in' },
            start + 0.022,
          )
      })

      timeline
        .to(clientGrid, { opacity: 1, y: 0, scale: 1, duration: 0.045, ease: 'power3.out' }, resolveStart + 0.015)
        .to(clientGrid, { opacity: 0, y: -24, duration: 0.04 }, 0.945)
        .to(leftGate, { xPercent: -4, rotateY: 0, duration: 0.11, ease: 'power2.inOut' }, resolveStart + 0.03)
        .to(rightGate, { xPercent: 4, rotateY: 0, duration: 0.11, ease: 'power2.inOut' }, resolveStart + 0.03)
        .to(vault, { scale: 1, yPercent: 0, duration: 0.11 }, resolveStart + 0.03)
        .to(brand, { scale: 0.8, opacity: 1, duration: 0.075, ease: 'power2.inOut' }, 0.925)
        .to(endCue, { opacity: 1, y: 0, duration: 0.025 }, 0.975)

      document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => undefined)
    },
    sectionRef,
    [],
  )

  useEffect(() => {
    const section = sectionRef.current
    const world = section?.querySelector<HTMLElement>('.visual-world')
    const supportsPointer = window.matchMedia('(hover: hover) and (pointer: fine)')

    if (!section || !world || !supportsPointer.matches) return

    const onPointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 12
      const y = (event.clientY / window.innerHeight - 0.5) * 8
      gsap.to(world, { x, y, duration: 0.9, ease: 'power3.out', overwrite: 'auto' })
    }

    const onPointerLeave = () => {
      gsap.to(world, { x: 0, y: 0, duration: 1, ease: 'power3.out', overwrite: 'auto' })
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onPointerLeave)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('mouseleave', onPointerLeave)
      gsap.killTweensOf(world)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="cinematic-scroll"
      id="top"
      aria-label="QVO cinematic introduction"
    >
      <div className="cinematic-stage">
        <div className="visual-world" aria-hidden="true">
          <div className="scene-backdrop" />
          <div className="scene-vault" />
          <div className="gate gate--left" />
          <div className="gate gate--right" />
          <div className="foreground-frame" />
        </div>

        <div className="intro-meta" aria-hidden="true">
          <span>Independent digital studio</span>
          <span>Lebanon</span>
        </div>

        <h1 className="brand-core">QVO</h1>

        <section className="service-scene" aria-labelledby="services-title">
          <h2 className="sr-only" id="services-title">
            Services
          </h2>
          <ul className="service-list">
            {SERVICES.map((service, index) => (
              <li className={`service-word service-word--${index + 1}`} key={service}>
                {service}
              </li>
            ))}
          </ul>
        </section>

        <div className="client-focus-track" aria-hidden="true">
          {CLIENTS.map((client) => (
            <span className="client-focus-name" key={client}>
              {client}
            </span>
          ))}
        </div>

        <section className="client-grid" aria-labelledby="clients-title">
          <h2 id="clients-title">Selected clients</h2>
          <ul>
            {CLIENTS.map((client) => (
              <li key={client}>{client}</li>
            ))}
          </ul>
        </section>

        <div className="scroll-cue" aria-hidden="true">
          <span>Scroll to open</span>
          <i />
        </div>
        <div className="end-cue" aria-hidden="true">
          Continue to contact <span>&#8595;</span>
        </div>
      </div>
    </section>
  )
}
