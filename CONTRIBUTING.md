# Contributing to QVO

This repository contains the QVO website and the separately buildable `scroll-scrub-video` workspace package. Contributions to either are welcome.

## Setup

```bash
npm ci
npm run dev
```

Before opening a pull request, run:

```bash
npx tsc --noEmit
npm run build
npm run build -w scroll-scrub-video
```

## Pull requests

1. Keep each change focused.
2. Verify visual work at desktop and iPhone widths.
3. Include screenshots for visual changes.
4. Preserve the real client roster and avoid unverifiable claims.
5. Confirm all quality gates pass.

## Code style

- Use strict TypeScript and semantic HTML.
- Site styling is hand-authored CSS; do not reintroduce utility frameworks.
- GSAP owns scroll-linked animation. Motion is limited to non-scroll interface micro-interactions.
- Clean up every listener, animation, observer, and timer.
- Preserve the separate reduced-motion document branch.
- The workspace package must remain CSS-agnostic with React as its only peer dependency.

Contributions are licensed under the repository's MIT License.
