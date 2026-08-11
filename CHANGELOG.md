# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Replaced the previous template-style presentation with a client-first portfolio: the site now leads with six real client screenshots (`public/work/`) in a GSAP ScrollTrigger + Lenis scroll sequence on desktop and a smooth stacked layout on mobile.
- Removed the generative WebGL hero, the external scroll-scrubbed showreel video, the preloader, the marquee, the custom cursor, the placeholder case-study content, stats, client quotes, invented dates and booking-quarter claims.
- Reworked the lower page into a restrained, factual set of sections: web design / development / strategy services, an independent-studio line, `hello@qvo.tech` contact, and GitHub.
- Switched typography to the Archivo variable font (`@fontsource-variable/archivo@5.3.0`) self-hosted with a `format('woff2')` `@font-face`; removed Google Fonts links and preconnects.
- Removed the `scroll-scrub-video` workspace package and its wiring (workspaces, Vite alias, tsconfig paths, CI package build step).
- Removed the Three.js hero, the showreel and related dead assets (`hero-poster.jpg`, `studio-portrait.webp`) and dependencies (`three`, `@types/three`, `lucide-react`).
- Added a `prefers-reduced-motion` React branch that renders a single plain stacked work list with no pinning; no animation branch is hidden with CSS.

### Fixed

- Regenerated `package-lock.json` for the trimmed dependency set so `npm ci` and `npm run build` resolve cleanly on fresh checkouts.
