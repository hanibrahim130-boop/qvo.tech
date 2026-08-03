import { useEffect, useRef } from 'react'
import { Hexagon, ChevronRight } from 'lucide-react'

interface RevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
  key?: string | number
}

function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              element.classList.remove('translate-y-8', 'opacity-0')
              element.classList.add('translate-y-0', 'opacity-100')
            }, delay)
            observer.unobserve(element)
          }
        })
      },
      { threshold: 0.15 }
    )
    
    observer.observe(element)
    
    return () => observer.disconnect()
  }, [delay])
  
  return (
    <div
      ref={ref}
      className={`translate-y-8 opacity-0 transition-all duration-700 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  )
}

export default function App() {
  const scrollRef = useRef<HTMLDivElement>(null)
  
  return (
    <div ref={scrollRef} className="relative h-screen overflow-y-auto bg-page">
      {/* Scroll Video Background */}
      <ScrollVideo scrollRef={scrollRef} />
      
      {/* Content Wrapper */}
      <div className="relative z-10">
        {/* Navbar */}
        <Navbar />
        
        <main>
          {/* Section One - Hero */}
          <SectionOne />
          
          {/* Spacer for scroll video length */}
          <div className="h-[80vh]" aria-hidden="true" />
          
          {/* Section Two - Capability */}
          <SectionTwo />
        </main>
      </div>
    </div>
  )
}

// Import ScrollVideo at the top level
import ScrollVideo from './ScrollVideo'

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/15 px-5 sm:px-8 md:px-12 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Reveal delay={0}>
          <div className="flex items-center gap-2">
            <Hexagon size={24} strokeWidth={1.5} className="text-white" />
            <span className="text-lg sm:text-xl font-medium tracking-tight text-white">qvo.tech</span>
          </div>
        </Reveal>
        
        {/* Center Links (md+) */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          <Reveal delay={100}>
            <a href="#" className="text-sm text-white/85 hover:text-white transition-colors duration-300">
              Work <sup className="font-mono text-[10px] text-white/60">6</sup>
            </a>
          </Reveal>
          <Reveal delay={200}>
            <a href="#" className="text-sm text-white/85 hover:text-white transition-colors duration-300">Services</a>
          </Reveal>
          <Reveal delay={300}>
            <a href="#" className="text-sm text-white/85 hover:text-white transition-colors duration-300">Studio</a>
          </Reveal>
          <Reveal delay={400}>
            <a href="#" className="text-sm text-white/85 hover:text-white transition-colors duration-300">Contact</a>
          </Reveal>
        </div>
        
        {/* CTA */}
        <Reveal delay={500}>
          <button className="rounded-md border border-white/20 bg-white/15 backdrop-blur-md px-4 py-2 text-xs sm:px-5 sm:text-sm hover:bg-white/25 transition-colors duration-300">
            Start a project
          </button>
        </Reveal>
      </div>
    </nav>
  )
}

const STUDIO_PORTRAIT_URL = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260728_050334_5b076e26-0ce7-4898-b432-d764190e448f.png&w=1280&q=85'

function SectionOne() {
  const services = [
    '/ WEB DESIGN',
    '/ WEB DEVELOPMENT',
    '/ DIGITAL STRATEGY',
  ]
  
  return (
    <section className="min-h-screen supports-[height:100svh]:min-h-[100svh] flex flex-col justify-between px-5 sm:px-8 md:px-12 pt-24 sm:pt-28 pb-12 md:pb-16">
      {/* Top Row */}
      <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
        {/* Left - Service List */}
        <div className="flex flex-col gap-2">
          {services.map((service, i) => (
            <Reveal key={service} delay={150 + i * 120}>
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-white/90 drop-shadow-md">
                {service}
              </span>
            </Reveal>
          ))}
        </div>
        
        {/* Right - Intro */}
        <Reveal delay={300} className="max-w-xs sm:text-right">
          <p className="text-lg sm:text-xl leading-relaxed text-white drop-shadow-md">
            We create considered digital experiences that make ambitious brands clear, credible, and impossible to ignore.
          </p>
        </Reveal>
      </div>
      
      {/* Bottom Row */}
      <div className="flex flex-col gap-8 md:flex-row items-end justify-between">
        {/* Left */}
        <div>
          <Reveal delay={150}>
            <div className="border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md mb-5">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/90">
                Websites built to perform
              </span>
            </div>
          </Reveal>
          
          <Reveal delay={280}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight text-white drop-shadow-lg">
              Design that<br />drives growth.
            </h1>
          </Reveal>
        </div>
        
        {/* Right - Glass Contact Card */}
        <Reveal delay={420}>
          <div className="flex items-center gap-4 rounded-xl bg-white/15 p-3 backdrop-blur-md">
            <img
              src={STUDIO_PORTRAIT_URL}
              alt="Qvo.tech studio consultation"
              className="h-24 w-20 rounded-lg object-cover"
            />
            <div className="flex flex-col gap-1.5 pr-2">
              <span className="text-sm font-medium text-white">Talk with Qvo</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/60">
                Start your next project
              </span>
              <button className="rounded-full bg-white px-4 py-2 text-xs font-medium text-black hover:bg-white/85 transition-colors duration-300 mt-1.5 flex items-center gap-1">
                Book a call
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function SectionTwo() {
  const capabilities = [
    {
      index: '01',
      title: 'Strategic design',
      body: 'Turns business goals into a clear, compelling direction for your digital presence.',
    },
    {
      index: '02',
      title: 'Distinctive identity',
      body: 'Builds visual systems that make the right people recognise and remember your brand.',
    },
    {
      index: '03',
      title: 'Built to scale',
      body: 'Creates flexible, high-performing websites that grow with the next chapter of your business.',
    },
  ]
  
  return (
    <section className="min-h-screen supports-[height:100svh]:min-h-[100svh] flex flex-col justify-between px-5 sm:px-8 md:px-12 pt-24 sm:pt-28 pb-12 md:pb-16">
      {/* Top Row */}
      <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
        {/* Left Badge */}
        <Reveal delay={120}>
          <div className="border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md">
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/90">
              Design with purpose
            </span>
          </div>
        </Reveal>
        
        {/* Right Copy */}
        <Reveal delay={220} className="max-w-sm sm:text-right">
          <p className="text-lg sm:text-xl leading-relaxed text-white drop-shadow-md">
            We pair bold creative direction with thoughtful technology, so every interaction moves your brand forward.
          </p>
        </Reveal>
      </div>
      
      {/* Bottom Area */}
      <div className="flex-1 justify-end flex flex-col gap-12 md:flex-row items-end justify-between gap-16">
        {/* Left Column */}
        <div className="max-w-xl">
          <Reveal delay={180}>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight text-white drop-shadow-lg">
              Make your brand<br />matter.
            </h2>
          </Reveal>
          
          <Reveal delay={320}>
            <p className="mt-6 max-w-md text-sm sm:text-base text-white/80 drop-shadow-md">
              From the first sketch to the final launch, Qvo turns raw ambition into a digital presence your audience can trust and remember.
            </p>
          </Reveal>
          
          <Reveal delay={420}>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-full bg-white px-5 py-2.5 text-xs sm:text-sm font-medium text-black hover:bg-white/85 transition-colors duration-300 flex items-center gap-1">
                See our work
                <ChevronRight size={14} />
              </button>
              <button className="rounded-full border border-white/25 bg-white/10 backdrop-blur-md px-5 py-2.5 text-xs sm:text-sm hover:bg-white/20 transition-colors duration-300">
                Start a project
              </button>
            </div>
          </Reveal>
        </div>
        
        {/* Right - Frosted Capability Panel */}
        <Reveal delay={300}>
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md px-5 sm:px-6">
            {capabilities.map((cap, i) => (
              <Reveal key={cap.index} delay={300 + i * 110}>
                <div className={`flex gap-5 py-5 ${i < capabilities.length - 1 ? 'border-b border-white/15' : ''}`}>
                  <span className="font-mono text-[11px] tracking-[0.15em] text-white/55">{cap.index}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 group cursor-pointer">
                      <span className="text-base sm:text-lg font-medium text-white">{cap.title}</span>
                      <ChevronRight size={16} className="text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/70">{cap.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
