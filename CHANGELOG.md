# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Extracted the reusable scroll-driven video and reveal primitives into the `scroll-scrub-video` workspace package.
- Added workspace wiring so the QVO site consumes `ScrollScrubVideo` and `Reveal` from that package.
- Added npm publishing metadata, ESM/CJS builds, and TypeScript declarations for `scroll-scrub-video`.
- Added CI, issue templates, and a pull request checklist for reliable contributions and releases.
- Added an SEO layer: meta description, canonical URL, Open Graph and Twitter card tags, JSON-LD structured data, `robots.txt`, and `sitemap.xml`.

### Changed

- Self-hosted the studio consultation image as an optimized WebP asset instead of hotlinking the image CDN.

### Fixed

- Replaced the broken `/vite.svg` favicon reference with a self-hosted hexagon `favicon.svg` that matches the navbar logo.
- Regenerated `package-lock.json` so TypeScript's per-platform native compiler binaries resolve on every OS, fixing `npm ci && npm run build` on fresh checkouts.
