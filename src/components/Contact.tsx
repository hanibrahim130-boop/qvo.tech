import Reveal from './Reveal'

export default function Contact() {
  return (
    <section
      id="contact"
      className="border-t border-white/10 px-5 py-32 text-center sm:px-8 md:px-12 md:py-40"
    >
      <Reveal>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">
          Have a project in mind?
        </p>
      </Reveal>
      <Reveal delay={120}>
        <h2 className="mx-auto mt-8 max-w-4xl font-wide font-display text-[clamp(2.75rem,8vw,6rem)] font-semibold leading-[0.98] tracking-tight text-white">
          Let&rsquo;s build your website.
        </h2>
      </Reveal>
      <Reveal delay={200}>
        <div className="mt-12 flex flex-col items-center gap-6">
          <a
            href="mailto:hello@qvo.tech"
            className="inline-flex items-center rounded-full bg-accent px-9 py-4 text-base font-semibold text-black hover:bg-white"
          >
            Start a project
          </a>
          <a
            href="mailto:hello@qvo.tech"
            className="text-sm text-white/55 hover:text-white"
          >
            hello@qvo.tech
          </a>
        </div>
      </Reveal>
    </section>
  )
}
