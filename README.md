# QVO — qvo.tech

Public, MIT-licensed source for [qvo.tech](https://qvo.tech), the website of an independent digital studio in Lebanon.

The site is an ultra-minimal cinematic scroll experience built with React, TypeScript, Vite, GSAP ScrollTrigger, Motion, and hand-authored CSS. It contains no project screenshots, fabricated results, testimonials, awards, or placeholder clients. The visible roster is limited to six verified client names.

## Experience

- A five-scene sticky sequence opens an architectural QVO frame, introduces `DESIGN`, `DEVELOPMENT`, and `DIRECTION`, and resolves six client names into a final grid.
- The scene is composed from CSS geometry rather than video, WebGL, or generated imagery.
- GSAP owns scroll-linked transforms. Motion owns the header and contact micro-interactions.
- `prefers-reduced-motion` renders a separate, unpinned document branch.
- Archivo is self-hosted through the pinned OFL-1.1 Fontsource variable package.

## Development

Requires Node.js 18+ and npm 10.

```bash
npm ci
npm run dev
```

Quality gates:

```bash
npx tsc --noEmit
npm run build
npm run build -w scroll-scrub-video
```

The static production build is written to `dist/`.

## Content

Site copy, service labels, contact details, scene ranges, and the client roster are centralized in `src/lib/site.ts`. The visual system and responsive choreography live in `src/index.css` and `src/components/CinematicExperience.tsx`.

## Reusable package

The repository also contains [`packages/scroll-scrub-video`](packages/scroll-scrub-video), a separately buildable React package exposing:

- `ScrollScrubVideo`
- `Reveal`
- `useScrollProgress`

The package API is independent from the current QVO site and remains documented in its own [README](packages/scroll-scrub-video/README.md).

## License

MIT — see [LICENSE](LICENSE). Archivo is distributed under SIL Open Font License 1.1 through `@fontsource-variable/archivo`.

## Contact

- [qvo.tech](https://qvo.tech)
- [hello@qvo.tech](mailto:hello@qvo.tech)
