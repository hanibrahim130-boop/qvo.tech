import { CLIENTS, SCENE_MEDIA, SERVICES } from '../lib/site'

/**
 * The reduced-motion and Save-Data branch. It shows the scene's opening frame
 * as a poster image and never references either MP4: `<source media>` lets the
 * browser resolve one candidate, so exactly one WebP is fetched.
 */
export default function StaticExperience() {
  return (
    <div className="static-experience" id="top">
      <section className="static-hero" aria-labelledby="static-title">
        <picture className="static-hero-media">
          <source media="(orientation: portrait) and (max-width: 900px)" srcSet={SCENE_MEDIA.mobile.poster} />
          <img
            src={SCENE_MEDIA.desktop.poster}
            alt=""
            aria-hidden="true"
            width={SCENE_MEDIA.desktop.width}
            height={SCENE_MEDIA.desktop.height}
            decoding="async"
          />
        </picture>
        <p>Independent digital studio / Lebanon</p>
        <h1 id="static-title">QVO</h1>
      </section>

      <section className="static-section" aria-labelledby="static-services-title">
        <h2 id="static-services-title">What we do</h2>
        <ul className="static-services">
          {SERVICES.map((service) => (
            <li key={service}>{service}</li>
          ))}
        </ul>
      </section>

      <section className="static-section" aria-labelledby="static-clients-title">
        <h2 id="static-clients-title">Selected clients</h2>
        <ul className="static-clients">
          {CLIENTS.map((client) => (
            <li key={client}>{client}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
