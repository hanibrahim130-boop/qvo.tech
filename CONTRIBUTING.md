# Contributing to QVO

Thanks for taking the time to contribute. This repository contains two things:

- the **website** for [qvo.tech](https://qvo.tech), at the repository root, and
- **`packages/scroll-scrub-video`**, the reusable scroll-driven motion primitives extracted from it.

Contributions to either are welcome.

## Getting set up

```bash
git clone https://github.com/hanibrahim130-boop/qvo.tech.git
cd qvo.tech
npm install
npm run dev
```

Before opening a pull request:

```bash
npm run build   # type-checks the site and produces a production bundle
```

For package work, build and type-check it from the workspace root:

```bash
npm run build -w scroll-scrub-video
```

## Ways to help

- **Bugs** — open an issue with the browser, device, and steps to reproduce. Scroll and video behaviour is very platform-dependent, so please say whether you saw it on iOS Safari, Android Chrome, or desktop.
- **Accessibility** — reduced-motion handling, focus order, contrast, and screen-reader behaviour are all fair game.
- **Performance** — smoother scrubbing on low-end devices, smaller media payloads, faster first paint.
- **Documentation** — clearer setup steps, better examples, or a demo others can point at.
- **Package features** — see the roadmap in `packages/scroll-scrub-video/README.md`.

## Pull requests

1. Create a branch: `git checkout -b feat/your-change`
2. Keep the change focused. One concern per pull request is much easier to review than a sweep.
3. Verify visually at mobile, tablet, and desktop widths. Include before/after screenshots or a short screen recording for anything visual.
4. Confirm `npm run build` passes.
5. Describe what changed and why in the pull request body.

## Code style

- TypeScript with `strict` mode. Avoid `any`; prefer narrowing.
- **Site code**: Tailwind utility classes. Avoid adding new CSS files.
- **Package code**: no Tailwind and no CSS imports. The primitives must stay usable in any React project, so styling belongs in inline styles or consumer-supplied `className`/`style` props.
- Avoid new runtime dependencies unless there is no reasonable alternative. The package's only peer dependency is React.
- Clean up event listeners, observers, timers, and animation frames in every `useEffect` teardown.
- Respect `prefers-reduced-motion` in anything that animates.

## Commit messages

Conventional Commits are preferred, for example:

```
feat(scroll-scrub-video): add image-sequence source
fix: hold the first video frame on iOS when autoplay is blocked
docs: clarify keyframe encoding guidance
```

## License

By contributing you agree that your contributions are licensed under the [MIT License](LICENSE).
