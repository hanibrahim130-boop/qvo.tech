import Reveal from './Reveal'
import SectionHead from './SectionHead'

const SERVICES = [
  {
    index: '01',
    title: 'Web design',
    description: 'Art direction, interface design and design systems.',
  },
  {
    index: '02',
    title: 'Web development',
    description: 'Front-end development for content sites and interactive experiences.',
  },
  {
    index: '03',
    title: 'Digital strategy',
    description: 'Positioning, content and measurement planning.',
  },
]

export default function Services() {
  return (
    <section id="services" className="px-5 py-24 sm:px-8 md:px-12 md:py-32">
      <SectionHead index="01" label="Capabilities" title="Web design, development and strategy" />
      <div className="mt-16 flex flex-col">
        {SERVICES.map((service, i) => (
          <Reveal key={service.index} delay={i * 80}>
            <div className="border-t border-white/10 py-10 md:py-12">
              <div className="flex items-baseline gap-5">
                <span className="font-mono text-xs text-accent">{service.index}</span>
                <div className="flex-1">
                  <h3 className="font-wide font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    {service.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
