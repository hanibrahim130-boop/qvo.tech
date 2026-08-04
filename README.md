# QVO — qvo.tech

**Web design for ambitious brands.** QVO is an open-source, scroll-driven marketing website built with React 19, TypeScript, Vite and Tailwind CSS. The repository holds the full front-end codebase for [qvo.tech](https://qvo.tech): a dark, cinematic single-page experience with a generative WebGL hero, a scroll-scrubbed showreel, smooth scrolling, and GSAP-driven scroll choreography from the preloader to the footer.

The motion primitives behind that experience are published from this repository as a standalone, reusable package — see [`packages/scroll-scrub-video`](packages/scroll-scrub-video).

---

## Reusable package: `scroll-scrub-video`

The scroll-scrubbed video layer and the reveal-on-scroll wrapper are framework-agnostic and useful well beyond this site, so they live on their own in [`packages/scroll-scrub-video`](packages/scroll-scrub-video). No Tailwind, no CSS import, no runtime dependency beyond React.

| Export | What it does |
| --- | --- |
| `ScrollScrubVideo` | Maps scroll progress onto `video.currentTime` so scrolling seeks the footage instead of playing it. Throttled seeking, poster fallback, iOS decoder priming. |
| `Reveal` | `IntersectionObserver` wrapper that fades and lifts children into view with a configurable delay, distance, duration and threshold. |
| `useScrollProgress` | The underlying hook: normalised `0…1` scroll progress with per-frame smoothing, for any element or the window. |

All three honour `prefers-reduced-motion`. Full API reference, usage examples and video-encoding tips are in the [package README](packages/scroll-scrub-video/README.md).

---

## Highlights

- **Generative 3D hero** — a noise-displaced, faceted Three.js orb with an electric rim light, particle field and wireframe shell; it reacts to the pointer and the first viewport of scroll, pauses off-screen, and is lazy-loaded in its own chunk.
- **Scroll-scrubbed showreel** — a pinned, full-viewport video whose playhead is driven by scroll, the technique extracted into the `scroll-scrub-video` package.
- **Scroll choreography throughout** — masked split-text headlines, a word-by-word brightening studio statement, animated stat counters, thumbnail parallax and a horizontally-scrolling process section, all on GSAP ScrollTrigger + Lenis smooth scroll.
- **Micro-interactions** — branded preloader, custom blend-mode cursor, magnetic buttons, hide-on-scroll navbar with a full-screen staggered mobile menu, infinite marquee.
- **Dark design-token base** — the `page` color (`#0a0a0a`) and `accent` (`#D9FF3F`) tokens, Space Grotesk display type with Instrument Serif italic accents over an Inter body.
- **Accessible by default** — every effect degrades under `prefers-reduced-motion`: no smooth scroll or pinning, a static 3D frame, final counter values, and full content with no JS-gated visibility.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | React 19 |
| Language | TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS 3 + PostCSS / Autoprefixer |
| 3D | Three.js (vanilla, lazy-loaded) |
| Animation | GSAP 3 + ScrollTrigger |
| Smooth scroll | Lenis |
| Icons | lucide-react |
| Fonts | Space Grotesk, Instrument Serif, Inter (Google Fonts) |

---

## Getting started

### Prerequisites

- Node.js 18 or newer
- npm (or pnpm / yarn / bun)

### Install and run

```bash
git clone https://github.com/hanibrahim130-boop/qvo.tech.git
cd qvo.tech
npm install
npm run dev
```

Vite prints a local URL (usually `http://localhost:5173`). Open it in your browser.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with hot module replacement |
| `npm run build` | Type-check with `tsc`, then produce a production bundle in `dist/` |
| `npm run build -w scroll-scrub-video` | Build the package's ESM, CJS, and declaration files into `packages/scroll-scrub-video/dist/` |
| `npm run preview` | Serve the built `dist/` folder locally to sanity-check the production build |

### Deploying

`npm run build` outputs a static site to `dist/`. Any static host works — Vercel, Netlify, Cloudflare Pages, GitHub Pages, or plain object storage behind a CDN.

- Build command: `npm run build`
- Output directory: `dist`

---

## Project structure

```
.
├── index.html                       # HTML shell: SEO/social meta tags, JSON-LD, Inter font preconnect
├── public/
│   ├── favicon.svg                  # Hexagon favicon matching the navbar logo
│   ├── hero-poster.jpg              # Poster frame shown before the scroll video is ready
│   ├── robots.txt                   # Crawler policy, points at the sitemap
│   ├── sitemap.xml                  # Single-URL sitemap for qvo.tech
│   └── studio-portrait.webp         # Self-hosted studio consultation image
├── src/
│   ├── main.tsx                     # React entry point, mounts <App /> into #root
│   ├── App.tsx                      # Page composition, preloader gate, Lenis boot
│   ├── index.css                    # Tailwind layers, tokens, split-text/cursor/noise utilities
│   ├── vite-env.d.ts                # Vite ambient type declarations
│   ├── lib/
│   │   ├── gsap.ts                  # GSAP + ScrollTrigger registration, context hook
│   │   ├── useLenis.ts              # Lenis ↔ GSAP ticker wiring, scrollTo helper
│   │   ├── splitText.ts             # Dependency-free word/line splitter for masked reveals
│   │   ├── anchors.ts               # Smooth same-page anchor navigation
│   │   └── usePrefersReducedMotion.ts
│   └── components/
│       ├── Preloader.tsx            # Branded counter intro that gates the hero
│       ├── Cursor.tsx               # Custom blend-mode cursor (fine pointers only)
│       ├── Navbar.tsx               # Hide-on-scroll nav + full-screen mobile menu
│       ├── Hero.tsx                 # Split-line headline intro, CTAs, scroll dim
│       ├── Hero3D.tsx               # Lazy Three.js scene (orb, particles, shaders)
│       ├── Marquee.tsx              # Infinite service marquee
│       ├── Showreel.tsx             # Pinned scroll-scrubbed video section
│       ├── Work.tsx                 # Case studies (placeholder content, gradient art)
│       ├── Services.tsx             # Sticky intro + capability rows
│       ├── Process.tsx              # Horizontal-scroll process (stacks on mobile)
│       ├── Studio.tsx               # Statement scrub, stat counters, testimonials
│       ├── Contact.tsx              # Giant split-reveal CTA
│       ├── Footer.tsx               # Nav, package credit, back-to-top
│       ├── Magnetic.tsx             # Pointer-gravity wrapper for buttons
│       └── SectionHead.tsx          # Shared section opener
├── packages/
│   └── scroll-scrub-video/          # Standalone, publishable motion primitives
│       ├── src/
│       │   ├── ScrollScrubVideo.tsx # Scroll-position-driven video seeking
│       │   ├── Reveal.tsx           # IntersectionObserver fade-and-lift wrapper
│       │   ├── useScrollProgress.ts # Smoothed 0…1 scroll progress hook
│       │   └── index.ts             # Public exports
│       ├── README.md                # API reference and usage guide
│       └── CHANGELOG.md
├── tailwind.config.cjs              # Design tokens: fonts and the `page` color
├── postcss.config.cjs               # Tailwind + Autoprefixer pipeline
├── vite.config.ts                   # Vite + React plugin configuration
├── tsconfig.json                    # TypeScript compiler options
├── CONTRIBUTING.md                  # How to set up, what to work on, code style
└── package.json
```

---

## How it works

### The motion system

Lenis animates the window's real scroll position from the GSAP ticker, so native scroll events, CSS `sticky` and ScrollTrigger all stay in sync. Every scroll effect is a ScrollTrigger — scrubbed (showreel seek, statement brighten, parallax, horizontal process) or one-shot (split-text reveals, counters). `src/lib/gsap.ts` exposes a `useGsapContext` hook that scopes and reverts animations per component.

### The 3D hero

`Hero3D.tsx` is a vanilla Three.js scene in a `React.lazy` chunk: an icosahedron displaced by simplex noise in the vertex shader, shaded flat with screen-space derivative normals, a fresnel rim in the accent color, plus particle dust and a slow wireframe shell. It lerps toward the pointer, scales with the first viewport of scroll, clamps device-pixel ratio, pauses when off-screen or the tab is hidden, and renders a single static frame under reduced motion. A CSS radial gradient sits underneath as the loading and no-WebGL fallback.

### The showreel

A `280vh` section with a `position: sticky` viewport. A ScrollTrigger maps section progress onto the video's `currentTime` with the same throttle/min-delta/tail-trim tuning as the `scroll-scrub-video` package, including the iOS decoder-priming trick. Under reduced motion the video is replaced by the poster still.

### Reveal on scroll

Simple entrances still use the package's `Reveal` (`IntersectionObserver` fade-and-lift). The fancier text work — masked line reveals and the word-by-word statement — uses `src/lib/splitText.ts`, a dependency-free splitter that restores the original markup once each animation completes.

### Page sections

- **Preloader** — branded counter; the hero intro starts as the curtain lifts.
- **Hero** — WebGL orb, split-line `Design that drives growth.` headline, magnetic CTAs.
- **Showreel** — pinned scroll-scrubbed film.
- **Work (`#work`)** — four case studies (placeholder copy, generated gradient art) with hover states and thumbnail parallax.
- **Services (`#services`)** — sticky intro column beside three capability rows with deliverable tags.
- **Process** — horizontal scroll through Discover / Design / Build / Launch on desktop; a vertical stack on mobile and under reduced motion.
- **Studio (`#studio`)** — brightening statement, animated stats, portrait card, testimonials.
- **Contact (`#contact`)** — giant split-reveal CTA with a magnetic “Book a call” button.
- **Footer** — sitemap, package credit, outline watermark, back-to-top.

---

## Customising

- **Colors and type** — edit `theme.extend` in `tailwind.config.cjs`: the `page` and `accent` colors plus the display/serif/body font stacks set the whole mood.
- **Copy and sections** — each section owns its content as plain arrays/strings at the top of its file: case studies in `src/components/Work.tsx`, services in `Services.tsx`, process steps in `Process.tsx`, stats/quotes/statement in `Studio.tsx`, marquee items in `App.tsx`. The case studies and testimonials ship as clearly-marked placeholders — swap them for real work.
- **Showreel footage** — swap `VIDEO_URL` in `src/components/Showreel.tsx` and replace `public/hero-poster.jpg` with a matching first frame.
- **3D scene** — tune `uAmp`/`uFreq` (displacement), colors, particle counts and rotation speeds in `src/components/Hero3D.tsx`.
- **Motion feel** — Lenis `duration`/easing in `src/lib/useLenis.ts`; per-effect ScrollTrigger ranges live beside each component.
- **Contact address** — the `mailto:` links point at `hello@qvo.tech`.
- **Metadata** — page title, meta description, favicon, Open Graph/Twitter cards, JSON-LD structured data, and font loading are all in `index.html`. The crawler policy and sitemap live in `public/robots.txt` and `public/sitemap.xml`.

---

## Roadmap

- Publish `scroll-scrub-video` to npm
- Hosted demo page for the package, independent of the QVO site
- Replace placeholder case studies with real work and add project detail routes
- Self-host all media in `public/` instead of referencing external CDNs
- Performance budget: adaptive video quality and lazy-loaded media

---

## Contributing

Issues and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, the kinds of help that are most useful, code style, and pull request expectations.

Good first areas: accessibility passes, mobile browser quirks, performance on low-end devices, documentation, and features from the package roadmap.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Contact

Maintained as the public codebase of the QVO web design studio.

- Site: [qvo.tech](https://qvo.tech)
- Email: hello@qvo.tech
