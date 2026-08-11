# Contributing to QVO

Thanks for taking the time to contribute. This repository contains the public website for
[qvo.tech](https://qvo.tech).

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

## Ways to help

- **Bugs** — open an issue with the browser, device, and steps to reproduce. Scroll behaviour is platform-dependent, so please say whether you saw it on iOS Safari, Android Chrome, or desktop.
- **Accessibility** — reduced-motion handling, focus order, contrast, and screen-reader behaviour are all fair game.
- **Performance** — smoother scrubbing on low-end devices, smaller media payloads, faster first paint.
- **Documentation** — clearer setup steps, better examples, or a demo others can point at.

## Pull requests

1. Create a branch: `git checkout -b feat/your-change`
2. Keep the change focused. One concern per pull request is much easier to review than a sweep.
3. Verify visually at mobile, tablet, and desktop widths. Include before/after screenshots or a short screen recording for anything visual.
4. Confirm `npm run build` passes.
5. Describe what changed and why in the pull request body.

## Code style

- TypeScript with `strict` mode. Avoid `any`; prefer narrowing.
- **Site code**: Tailwind utility classes. Avoid adding new CSS files.
- Avoid new runtime dependencies unless there is no reasonable alternative.
- Clean up event listeners, observers, timers, and animation frames in every `useEffect` teardown.
- Respect `prefers-reduced-motion` in anything that animates.

## Commit messages

Conventional Commits are preferred, for example:

```
feat: add a project detail route
fix: preserve the first work panel on iOS
docs: clarify screenshot requirements
```

## License

By contributing you agree that your contributions are licensed under the [MIT License](LICENSE).
