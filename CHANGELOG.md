# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Redesigned the site as a premium single-page experience: branded preloader, generative Three.js hero (noise-displaced orb, particles, shaders), pinned scroll-scrubbed showreel, case-study section, capability rows, horizontal-scroll process, studio section with animated stats and testimonials, giant CTA and a full footer.
- Added GSAP 3 + ScrollTrigger scroll choreography (split-text reveals, word-by-word statement brighten, counters, parallax) and Lenis smooth scrolling wired to the GSAP ticker.
- Added micro-interactions: custom blend-mode cursor, magnetic buttons, hide-on-scroll navbar with a full-screen staggered mobile menu, and an infinite service marquee.
- Added Space Grotesk display and Instrument Serif accent typography plus the `#D9FF3F` accent design token.
- Extracted the reusable scroll-driven video and reveal primitives into the `scroll-scrub-video` workspace package.
- Added workspace wiring so the QVO site consumes `ScrollScrubVideo` and `Reveal` from that package.
- Added npm publishing metadata, ESM/CJS builds, and TypeScript declarations for `scroll-scrub-video`.
- Added CI, issue templates, and a pull request checklist for reliable contributions and releases.
- Added an SEO layer: meta description, canonical URL, Open Graph and Twitter card tags, JSON-LD structured data, `robots.txt`, and `sitemap.xml`.

### Changed

- Replaced the whole-page background video scrub with a dedicated pinned showreel section; the package's `Reveal` still powers section entrances, and every effect honours `prefers-reduced-motion`.
- The Three.js scene ships in a lazy-loaded chunk so the initial bundle stays lean.
- Self-hosted the studio consultation image as an optimized WebP asset instead of hotlinking the image CDN.

### Fixed

- Replaced the broken `/vite.svg` favicon reference with a self-hosted hexagon `favicon.svg` that matches the navbar logo.
- Regenerated `package-lock.json` so TypeScript's per-platform native compiler binaries resolve on every OS, fixing `npm ci && npm run build` on fresh checkouts.
