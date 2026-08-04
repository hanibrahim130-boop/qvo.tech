# Changelog

All notable changes to `scroll-scrub-video` are documented here. This project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-08-04

### Added

- Initial extraction of the scroll-driven motion primitives from the QVO website.
- `ScrollScrubVideo`: scroll-position-driven video seeking with throttled seeks, poster fallback, and an iOS decoder priming workaround.
- `Reveal`: `IntersectionObserver`-based fade-and-lift wrapper with configurable delay, distance, duration, threshold, and repeat behaviour.
- `useScrollProgress`: normalised `0…1` scroll progress with per-frame smoothing, for a container element or the window.
- `prefers-reduced-motion` support across all three primitives.
- Framework-agnostic styling: inline styles only, no Tailwind or CSS import required.
