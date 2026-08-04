# QVO — qvo.tech

**Web design for ambitious brands.** QVO is an open-source, scroll-driven marketing website built with React 19, TypeScript, Vite and Tailwind CSS. The repository holds the full front-end codebase for [qvo.tech](https://qvo.tech): a dark, cinematic single-page experience where a background video scrubs in sync with page scroll while content sections reveal on entry.

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

- **Scroll-synced background video** — scroll position drives video playback time for a continuous, film-like backdrop, with a poster image fallback.
- **Staggered reveal choreography** — nav links, service labels, headings and capability rows fade in on entry with increasing delays instead of appearing all at once.
- **Dark design-token base** — a single `page` color token (`#0a0a0a`) plus an Inter type scale, so the visual language stays consistent across sections.
- **Glassmorphism UI kit in-place** — translucent, backdrop-blurred cards, pills, and nav built purely with Tailwind utilities. No UI dependency.
- **Fully responsive** — mobile-first layouts using `100svh`/`100dvh` viewport units so full-height sections behave correctly on mobile browsers.
- **Tiny dependency surface** — React, React DOM and `lucide-react` icons. Nothing else at runtime.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | React 19 |
| Language | TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS 3 + PostCSS / Autoprefixer |
| Icons | lucide-react |
| Fonts | Inter (Google Fonts) |

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
├── index.html                       # HTML shell: meta tags, page title, Inter font preconnect
├── public/
│   └── hero-poster.jpg              # Poster frame shown before the scroll video is ready
├── src/
│   ├── main.tsx                     # React entry point, mounts <App /> into #root
│   ├── App.tsx                      # Page composition: Navbar, SectionOne, SectionTwo, Reveal
│   ├── ScrollVideo.tsx              # Site-specific wrapper around the scroll video layer
│   ├── index.css                    # Tailwind directives and global base styles
│   └── vite-env.d.ts                # Vite ambient type declarations
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

### Scroll-driven video

`App` owns a scrollable container ref and passes it down to the video layer, which renders a fixed, full-viewport `<video>` behind the content. As the container scrolls, scroll progress is normalised to `0…1` and mapped onto the video's `currentTime`, so scrolling scrubs the footage instead of merely playing it. Seeks are throttled and smoothed per frame, and `public/hero-poster.jpg` is used as the poster so the first paint is never blank.

iOS needs special handling: Safari will not decode a frame for a video that has never played, so a single muted play/pause cycle primes the decoder before seeking begins.

### Reveal on scroll

`Reveal` wraps any node, starts it faded out and offset downward, and animates it into place once an `IntersectionObserver` reports at least 15% visibility. Each instance takes a `delay` prop, which is how whole sections stagger into view.

### Page sections

- **Navbar** — fixed, translucent top bar with anchor links to `#work`, `#services`, `#studio`, `#contact` and a primary "Start a project" action.
- **SectionOne (`#services`)** — service list, positioning statement, the `Design that drives growth.` headline, and a contact card linking to `mailto:hello@qvo.tech`.
- **SectionTwo (`#work`)** — the `Make your brand matter.` headline plus a three-item capability list (strategic design, distinctive identity, built to scale) in a glass card.
- A tall spacer sits between the two sections to give the scroll-linked video room to play through.

---

## Customising

- **Colors and type** — edit `theme.extend` in `tailwind.config.cjs`. The `page` color and Inter font stack are the two knobs that set the overall mood.
- **Copy and sections** — all text lives inline in `src/App.tsx`. Service labels and capability entries are plain arrays near the top of their components.
- **Background footage** — swap the video source in `src/ScrollVideo.tsx` and replace `public/hero-poster.jpg` with a matching first frame.
- **Motion feel** — tune `smoothing` and `seekThrottleMs` on the video layer, and `delay`/`distance`/`duration` on `Reveal`.
- **Contact address** — the `mailto:` links in `src/App.tsx` point at `hello@qvo.tech`.
- **Metadata** — page title, favicon, and font loading are in `index.html`.

---

## Roadmap

- Publish `scroll-scrub-video` to npm
- Hosted demo page for the package, independent of the QVO site
- Real work/case-study section with project detail routes
- A dedicated Studio section to match the existing nav anchor
- Self-host all media in `public/` instead of referencing external CDNs
- Performance budget: adaptive video quality and lazy-loaded media
- SEO layer: Open Graph and Twitter cards, JSON-LD structured data, sitemap generation

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
