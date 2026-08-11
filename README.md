# QVO — qvo.tech

**Independent web design studio in Lebanon.** QVO is an open-source portfolio website built with React 19, TypeScript, Vite and Tailwind CSS. The repository holds the full front-end codebase for [qvo.tech](https://qvo.tech): a dark, client-first single-page experience that leads with six real client projects in a GSAP ScrollTrigger + Lenis scroll sequence, followed by services, studio, contact and footer sections.

All animation runs on GSAP + Lenis and only ever animates `transform`, `opacity` or `clip-path`. Under `prefers-reduced-motion` a single React branch renders a plain, stacked list of the same work with no pinning.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | React 19 |
| Language | TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS 3 + PostCSS / Autoprefixer |
| Animation | GSAP 3 + ScrollTrigger |
| Smooth scroll | Lenis |
| Fonts | Archivo Variable (`@fontsource-variable/archivo`) |

---

## Getting started

### Prerequisites

- Node.js 22.12 or newer
- npm

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
├── index.html                       # HTML shell: SEO/social meta tags, JSON-LD, theme-color
├── public/
│   ├── favicon.svg                  # QVO favicon
│   ├── robots.txt                   # Crawler policy, points at the sitemap
│   ├── sitemap.xml                  # Single-URL sitemap for qvo.tech
│   └── work/                        # Six real client screenshots (WebP)
│       ├── white.webp               # WHITE Real Estate Group
│       ├── brandi.webp              # brandi intl
│       ├── ferri.webp               # FERRI — furniture house since 1959, Tripoli
│       ├── cityu.webp               # City University — Tripoli
│       ├── mofa.webp                # Mofa Boutique — Saida
│       └── mouttahed.webp           # Mouttahed Basketball Academy — Tripoli
├── src/
│   ├── main.tsx                     # React entry point, mounts <App /> into #root
│   ├── App.tsx                      # Page composition and Lenis boot
│   ├── index.css                    # Tailwind layers, tokens, Archivo @font-face, focus/scrollbar
│   ├── vite-env.d.ts                # Vite ambient type declarations
│   ├── lib/
│   │   ├── gsap.ts                  # GSAP + ScrollTrigger registration, context hook
│   │   ├── useLenis.ts              # Lenis ↔ GSAP ticker wiring, scrollTo helper
│   │   ├── anchors.ts               # Smooth same-page anchor navigation
│   │   └── usePrefersReducedMotion.ts
│   └── components/
│       ├── Work.tsx                 # Hero + six-project scroll sequence (desktop pin, mobile stack, reduced-motion list branch)
│       ├── Navbar.tsx               # Fixed solid navbar with mobile menu
│       ├── Reveal.tsx               # Transform/opacity reveal-on-scroll wrapper
│       ├── SectionHead.tsx          # Shared section opener
│       ├── Services.tsx             # Web design, development, strategy
│       ├── Studio.tsx               # Independent studio line, email, GitHub
│       ├── Contact.tsx              # Contact CTA and hello@qvo.tech
│       └── Footer.tsx               # Nav, email, GitHub, back-to-top
├── tailwind.config.cjs              # Design tokens: fonts, page/accent colours
├── postcss.config.cjs               # Tailwind + Autoprefixer pipeline
├── vite.config.ts                   # Vite + React plugin configuration
├── tsconfig.json                    # TypeScript compiler options
├── CONTRIBUTING.md                  # How to set up and contribute
└── package.json
```

---

## The motion system

Lenis animates the window's real scroll position from the GSAP ticker, so native scroll events, CSS `sticky` and ScrollTrigger all stay in sync. Every scroll effect is a ScrollTrigger and only animates `transform` or `opacity`; nothing animates layout or paint properties.

### The work sequence

`src/components/Work.tsx` renders the real client screenshots from `public/work/`:

- **Desktop**: a six-screen-tall section whose sticky viewport slides the panel track upward on a scrubbed ScrollTrigger — hero and work read as one continuous sequence.
- **Mobile**: the same panels stack naturally, full-screen, with no pinning.
- **Reduced motion**: React gates on `prefers-reduced-motion` and renders exactly one alternative branch — a plain, stacked list of the same work. The pinned branch is not in the DOM, so its images are never fetched.

Images beyond the first load lazily, and the first image carries `fetchPriority="high"` for a fast LCP.

### Section reveals

Section text uses `Reveal` (`gsap.from` with a `once` ScrollTrigger) — transform + opacity only. Under reduced motion the `Reveal` skips entirely, so content is visible without JS-gated opacity.

---

## Customising

- **Colours and type** — edit `theme.extend` in `tailwind.config.cjs` (the `page` and `accent` colours) and the Archivo `@font-face` in `src/index.css`. Font width is driven with CSS `font-stretch`, weight with `font-weight`.
- **Copy and sections** — each section owns its content as plain data at the top of its file: client roster in `src/components/Work.tsx`, services in `Services.tsx`.
- **Metadata** — page title, meta description, favicon, Open Graph/Twitter cards and JSON-LD are all in `index.html`. The crawler policy and sitemap live in `public/robots.txt` and `public/sitemap.xml`.
- **Contact address** — the `mailto:` links point at `hello@qvo.tech`.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Contact

Maintained as the public codebase of the QVO web design studio.

- Site: [qvo.tech](https://qvo.tech)
- Email: hello@qvo.tech
- GitHub: [hanibrahim130-boop/qvo.tech](https://github.com/hanibrahim130-boop/qvo.tech)
