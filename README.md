# QVO — qvo.tech

**Web design for ambitious brands.** QVO is an open-source, scroll-driven marketing website built with React 19, TypeScript, Vite and Tailwind CSS. The repository holds the full front-end codebase for [qvo.tech](https://qvo.tech): a dark, cinematic single-page experience where a background video scrubs in sync with page scroll while content sections reveal on entry.

It doubles as a reference implementation for high-end motion web design — the scroll-linked video component, reveal-on-scroll primitive, and dark design-token setup are meant to be read, copied, and reused in other projects.

---

## Highlights

- **Scroll-synced background video** — `ScrollVideo` maps scroll progress onto video playback time for a continuous, film-like backdrop, with a poster image fallback.
- **`Reveal` animation primitive** — a small `IntersectionObserver` wrapper that fades and lifts any child element into view with a configurable delay, used to choreograph whole sections.
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
| `npm run preview` | Serve the built `dist/` folder locally to sanity-check the production build |

### Deploying

`npm run build` outputs a static site to `dist/`. Any static host works — Vercel, Netlify, Cloudflare Pages, GitHub Pages, or plain object storage behind a CDN.

- Build command: `npm run build`
- Output directory: `dist`

---

## Project structure

```
.
├── index.html              # HTML shell: meta tags, page title, Inter font preconnect
├── public/
│   └── hero-poster.jpg     # Poster frame shown before the scroll video is ready
├── src/
│   ├── main.tsx            # React entry point, mounts <App /> into #root
│   ├── App.tsx             # Page composition: Navbar, SectionOne, SectionTwo, Reveal primitive
│   ├── ScrollVideo.tsx     # Scroll-progress-driven background video layer
│   ├── index.css           # Tailwind directives and global base styles
│   └── vite-env.d.ts       # Vite ambient type declarations
├── tailwind.config.cjs     # Design tokens: fonts and the `page` color
├── postcss.config.cjs      # Tailwind + Autoprefixer pipeline
├── vite.config.ts          # Vite + React plugin configuration
├── tsconfig.json           # TypeScript compiler options
└── package.json
```

---

## How it works

### Scroll-driven video

`App` owns a scrollable container ref and passes it to `ScrollVideo`, which renders a fixed, full-viewport `<video>` behind the content. As the container scrolls, scroll progress is normalised to `0…1` and mapped onto the video's `currentTime`, so scrolling scrubs the footage instead of merely playing it. `public/hero-poster.jpg` is used as the poster so the first paint is never blank.

### Reveal on scroll

`Reveal` wraps any node, starts it at `translate-y-8 opacity-0`, and swaps in `translate-y-0 opacity-100` once an `IntersectionObserver` reports at least 15% visibility. Each instance takes a `delay` prop, which is how the nav links, service labels, headings, and capability rows stagger into place instead of appearing all at once.

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
- **Contact address** — the `mailto:` links in `src/App.tsx` point at `hello@qvo.tech`.
- **Metadata** — page title, favicon, and font loading are in `index.html`.

---

## Roadmap

- Extract `Reveal` and `ScrollVideo` into a standalone, publishable motion-primitives package
- Real work/case-study section with project detail routes
- A dedicated Studio section to match the existing nav anchor
- Accessibility pass, including `prefers-reduced-motion` handling for the scroll video and reveals
- Performance budget: adaptive video quality and lazy-loaded media
- SEO layer: Open Graph and Twitter cards, JSON-LD structured data, sitemap generation

---

## Contributing

Issues and pull requests are welcome.

1. Fork the repository and create a branch: `git checkout -b feat/your-change`
2. Run `npm run dev` and verify your change visually at mobile, tablet, and desktop widths
3. Run `npm run build` to confirm the project type-checks and builds cleanly
4. Open a pull request describing what changed and why, with before/after screenshots or a short screen recording for anything visual

Please keep changes focused, prefer Tailwind utilities over new CSS files, and avoid adding runtime dependencies unless there is no reasonable alternative.

---

## License

MIT — see `LICENSE` for details.

---

## Contact

Maintained as the public codebase of the QVO web design studio.

- Site: [qvo.tech](https://qvo.tech)
- Email: hello@qvo.tech
