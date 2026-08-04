import { ArrowUpRight } from 'lucide-react'
import { Reveal } from 'scroll-scrub-video'
import Magnetic from './Magnetic'
import SectionHead from './SectionHead'

const SERVICES = [
  {
    index: '01',
    title: 'Web design',
    description:
      'Art direction, interfaces and design systems that feel inevitable — built around the story your customers need to hear.',
    tags: ['Art direction', 'UX / UI', 'Design systems', 'Prototyping'],
  },
  {
    index: '02',
    title: 'Web development',
    description:
      'Fast, accessible, motion-rich builds on modern stacks. Green scores, smooth frames, maintainable code.',
    tags: ['React', 'Creative dev', 'WebGL & 3D', 'Headless CMS'],
  },
  {
    index: '03',
    title: 'Digital strategy',
    description:
      'Positioning, messaging and measurement that align the website with the business it serves.',
    tags: ['Positioning', 'Content', 'SEO', 'Analytics'],
  },
]

export default function Services() {
  return (
    <section id="services" className="border-t border-white/10 px-5 py-28 sm:px-8 md:px-12 md:py-36">
      <div className="grid gap-14 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <SectionHead
              index="02"
              label="Capabilities"
              title={
                <>
                  Everything a launch <em className="font-serif font-normal italic text-accent">needs.</em>
                </>
              }
            />
            <Reveal delay={220}>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/55">
                Three disciplines, one team, no hand-offs. Strategy shapes the design, design
                shapes the build — and the seams never show.
              </p>
            </Reveal>
            <Reveal delay={320}>
              <Magnetic className="mt-8">
                <a
                  href="mailto:hello@qvo.tech"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm text-white backdrop-blur-md transition-colors duration-300 hover:border-accent hover:text-accent"
                >
                  Scope your project
                  <ArrowUpRight size={15} />
                </a>
              </Magnetic>
            </Reveal>
          </div>
        </div>

        <div className="md:col-span-8">
          {SERVICES.map((service, i) => (
            <Reveal key={service.index} delay={i * 90}>
              <div className="group border-t border-white/10 py-10 transition-all duration-500 first:border-t-0 first:pt-0 hover:pl-3 md:py-12">
                <div className="flex items-baseline gap-5">
                  <span className="font-mono text-xs text-accent">{service.index}</span>
                  <div className="flex-1">
                    <h3 className="font-display text-3xl font-medium tracking-tight text-white transition-colors duration-300 sm:text-4xl md:text-5xl">
                      {service.title}
                    </h3>
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
                      {service.description}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white/60 transition-colors duration-300 group-hover:border-white/25 group-hover:text-white/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
