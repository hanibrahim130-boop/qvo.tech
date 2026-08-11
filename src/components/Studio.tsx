import Reveal from './Reveal'
import SectionHead from './SectionHead'

export default function Studio() {
  return (
    <section id="studio" className="border-t border-white/10 px-5 py-24 sm:px-8 md:px-12 md:py-32">
      <SectionHead index="02" label="The studio" title="An independent studio in Lebanon" />
      <Reveal>
        <p className="mt-10 max-w-3xl font-wide font-display text-2xl font-medium leading-snug tracking-tight text-white sm:text-3xl">
          QVO is an independent web design studio in Lebanon, focused on web design,
          development and digital strategy.
        </p>
      </Reveal>
      <Reveal delay={120}>
        <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <a
            href="mailto:hello@qvo.tech"
            className="w-max text-sm text-white/70 hover:text-white"
          >
            hello@qvo.tech
          </a>
          <a
            href="https://github.com/hanibrahim130-boop/qvo.tech"
            target="_blank"
            rel="noreferrer"
            className="w-max text-sm text-white/70 hover:text-white"
          >
            GitHub
          </a>
        </div>
      </Reveal>
    </section>
  )
}
