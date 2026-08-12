import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, useGsapContext } from '../lib/gsap'
import { CLIENTS, SCENES, SCENE_MEDIA, SERVICES } from '../lib/site'
import { useSceneVariant } from '../lib/useSceneVariant'
import { useVideoScrubber } from '../lib/useVideoScrubber'

const [, MARK_END] = SCENES.mark
const [OPENING_START, OPENING_END] = SCENES.opening
const [SERVICES_START] = SCENES.services
const [CLIENTS_START] = SCENES.clients
const [RESOLVE_START] = SCENES.resolve

/** Scroll distance between two service beats. */
const SERVICE_BEAT = 0.075
/** Scroll distance a single client name occupies while it passes through. */
const CLIENT_BEAT = (0.85 - (CLIENTS_START + 0.035)) / CLIENTS.length
/** Maximum foreground displacement from pointer drift, in CSS pixels. */
const POINTER_DRIFT_PX = 6

/**
 * Depth planes for the three service beats: each word arrives from a different
 * distance and leaves on a different arc, so they read as separate camera
 * planes rather than one stack.
 */
const SERVICE_PLANES = [
  { enter: { yPercent: 26, scale: 1.05 }, exit: { yPercent: -16, scale: 1.02 } },
  { enter: { yPercent: 32, scale: 0.93 }, exit: { yPercent: -12, scale: 0.97 } },
  { enter: { yPercent: 28, scale: 0.88 }, exit: { yPercent: -20, scale: 1.04 } },
] as const

export default function CinematicExperience() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const foregroundRef = useRef<HTMLDivElement>(null)

  const variant = useSceneVariant()
  const media = SCENE_MEDIA[variant]
  const setSceneProgress = useVideoScrubber(videoRef, media.src)

  useGsapContext(
    () => {
      const root = sectionRef.current
      if (!root) return

      const select = gsap.utils.selector(root)
      const camera = select('.scene-media')
      const veil = select('.scene-veil--text')
      const meta = select('.scene-meta')
      const mark = select('.scene-mark')
      const markRule = select('.scene-mark-rule')
      const services = select('.scene-service')
      const names = select('.scene-name')
      const clients = select('.scene-clients')
      const cue = select('.scene-cue')
      const outro = select('.scene-outro')

      gsap.set(camera, { scale: 1.06 })
      gsap.set(veil, { opacity: 0.34 })
      gsap.set(markRule, { clipPath: 'inset(0% 100% 0% 0%)' })
      gsap.set(names, { opacity: 0, x: '12vw', scale: 0.96 })
      gsap.set(clients, { opacity: 0, y: 30 })
      gsap.set(outro, { opacity: 0, y: 14 })
      services.forEach((word, index) => {
        gsap.set(word, { opacity: 0, ...SERVICE_PLANES[index].enter })
      })

      /**
       * The one scroll-linked timeline. It choreographs the foreground and
       * publishes a progress target for the video controller, but it never
       * touches the playhead itself.
       */
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
          invalidateOnRefresh: true,
          onUpdate: (self) => setSceneProgress(self.progress),
          onRefresh: (self) => setSceneProgress(self.progress),
        },
      })

      timeline
        // Mark — the wordmark holds the frame while the entry furniture clears.
        .to(markRule, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.09 }, 0.01)
        .to(meta, { opacity: 0, y: -16, duration: MARK_END - 0.09 }, 0.035)
        .to(cue, { opacity: 0, y: 12, duration: 0.06 }, 0.03)
        // Opening — the camera settles, the veil thins, the wordmark passes through.
        .to(camera, { scale: 1, duration: OPENING_END - OPENING_START }, OPENING_START)
        .to(veil, { opacity: 0.16, duration: 0.14 }, OPENING_START)
        .to(
          mark,
          { scale: 1.16, yPercent: -7, opacity: 0, duration: 0.2, ease: 'power2.in' },
          OPENING_START + 0.02,
        )
        .to(veil, { opacity: 0.56, duration: 0.1 }, SERVICES_START - 0.06)

      // Services — three beats, three depth planes.
      services.forEach((word, index) => {
        const plane = SERVICE_PLANES[index]
        const start = SERVICES_START + 0.015 + index * SERVICE_BEAT

        timeline
          .to(
            word,
            { opacity: 1, yPercent: 0, scale: 1, duration: 0.045, ease: 'power3.out' },
            start,
          )
          .to(
            word,
            { opacity: 0, ...plane.exit, duration: 0.045, ease: 'power2.in' },
            start + SERVICE_BEAT,
          )
      })

      timeline.to(veil, { opacity: 0.62, duration: 0.08 }, CLIENTS_START)

      // Clients — six names pass through, then the accessible grid settles.
      names.forEach((name, index) => {
        const start = CLIENTS_START + 0.035 + index * CLIENT_BEAT

        timeline
          .to(name, { opacity: 1, x: 0, scale: 1, duration: 0.013, ease: 'power2.out' }, start)
          .to(
            name,
            { opacity: 0, x: '-12vw', scale: 1.03, duration: 0.013, ease: 'power2.in' },
            start + CLIENT_BEAT * 0.58,
          )
      })

      // Resolve — the grid holds and the page hands over to contact.
      timeline
        .to(clients, { opacity: 1, y: 0, duration: 0.05, ease: 'power3.out' }, RESOLVE_START - 0.005)
        .to(camera, { scale: 1.03, duration: 0.14 }, RESOLVE_START)
        .to(veil, { opacity: 0.48, duration: 0.08 }, RESOLVE_START + 0.02)
        .to(outro, { opacity: 1, y: 0, duration: 0.03 }, 0.955)

      document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => undefined)
    },
    sectionRef,
    [setSceneProgress],
  )

  useEffect(() => {
    const layer = foregroundRef.current
    if (!layer) return

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!finePointer.matches || reduceMotion.matches) return

    const driftX = gsap.quickTo(layer, 'x', { duration: 0.9, ease: 'power3.out' })
    const driftY = gsap.quickTo(layer, 'y', { duration: 0.9, ease: 'power3.out' })

    const onPointerMove = (event: PointerEvent) => {
      driftX((event.clientX / window.innerWidth - 0.5) * POINTER_DRIFT_PX * 2)
      driftY((event.clientY / window.innerHeight - 0.5) * POINTER_DRIFT_PX * 2)
    }

    const onPointerLeave = () => {
      driftX(0)
      driftY(0)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onPointerLeave)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('mouseleave', onPointerLeave)
      gsap.killTweensOf(layer)
      gsap.set(layer, { clearProps: 'x,y' })
    }
  }, [])

  return (
    <section ref={sectionRef} className="scene" id="top" aria-label="QVO cinematic introduction">
      <div className="scene-stage">
        <div className="scene-media" aria-hidden="true">
          <video
            ref={videoRef}
            className="scene-video"
            src={media.src}
            poster={media.poster}
            width={media.width}
            height={media.height}
            preload="metadata"
            muted
            playsInline
            disablePictureInPicture
            aria-hidden="true"
          />
        </div>

        <div className="scene-veil scene-veil--base" aria-hidden="true" />
        <div className="scene-veil scene-veil--text" aria-hidden="true" />

        <div className="scene-foreground" ref={foregroundRef}>
          <p className="scene-meta">
            <span>Independent digital studio</span>
            <span>Lebanon</span>
          </p>

          <div className="scene-mark">
            <h1 className="scene-brand">QVO</h1>
            <span className="scene-mark-rule" aria-hidden="true" />
          </div>

          <section className="scene-services" aria-labelledby="services-title">
            <h2 className="sr-only" id="services-title">
              Services
            </h2>
            <ul className="scene-service-list">
              {SERVICES.map((service, index) => (
                <li className={`scene-service scene-service--${index + 1}`} key={service}>
                  {service}
                </li>
              ))}
            </ul>
          </section>

          <div className="scene-names" aria-hidden="true">
            {CLIENTS.map((client) => (
              <span className="scene-name" key={client}>
                {client}
              </span>
            ))}
          </div>

          <section className="scene-clients" aria-labelledby="clients-title">
            <h2 id="clients-title">Selected clients</h2>
            <ul>
              {CLIENTS.map((client) => (
                <li key={client}>{client}</li>
              ))}
            </ul>
          </section>

          <p className="scene-cue" aria-hidden="true">
            <span>Scroll to open</span>
            <i />
          </p>

          <p className="scene-outro" aria-hidden="true">
            Continue to contact <span>&#8595;</span>
          </p>
        </div>
      </div>
    </section>
  )
}
