import { CLIENTS, SERVICES } from '../lib/site'

export default function StaticExperience() {
  return (
    <div className="static-experience" id="top">
      <section className="static-hero" aria-labelledby="static-title">
        <div className="static-frame" aria-hidden="true" />
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
