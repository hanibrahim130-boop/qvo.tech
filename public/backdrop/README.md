# public/backdrop

Optional. If `manifest.json` is present here, `GlobalBackdrop` scrubs a rendered
image sequence instead of drawing the procedural film. If it is absent, nothing
breaks and nothing is fetched twice.

## manifest.json

```json
{
  "desktop": {
    "dir": "/backdrop/desktop",
    "count": 240,
    "pad": 4,
    "ext": "avif",
    "prefix": "frame_",
    "averageColor": "#140F22"
  },
  "mobile": {
    "dir": "/backdrop/mobile",
    "count": 120,
    "pad": 4,
    "ext": "avif",
    "prefix": "frame_",
    "averageColor": "#140F22"
  }
}
```

Frame files are 1-indexed: `frame_0001.avif` ... `frame_0240.avif`.

`averageColor` is painted for the few milliseconds before a frame decodes, so
it should be the sequence's mean colour, never black.

## Extracting frames

Desktop, 240 frames at 1600px wide:

```bash
mkdir -p public/backdrop/desktop
ffmpeg -i film.mp4 -vf "fps=24,scale=1600:-1" -q:v 60 \
  public/backdrop/desktop/frame_%04d.avif
```

Mobile, 120 frames in portrait:

```bash
mkdir -p public/backdrop/mobile
ffmpeg -i film-portrait.mp4 -vf "fps=12,scale=900:-1" -q:v 60 \
  public/backdrop/mobile/frame_%04d.avif
```

## Rules

- Budget: **4 MB** for the desktop set, **1.5 MB** for mobile. Check with
  `du -sh public/backdrop/*` before committing.
- Keep the sequence loopable in tone at both ends: frame 1 and the last frame
  are on screen while the page is idle.
- No hard cuts. The film is scrubbed at arbitrary speed in both directions; a
  cut reads as a glitch, not as editing.
- Render in the brand palette (`#0C0C0C` base, `#36255C` brand, `#8B6FE8`
  accent, `#D2C3F6` lavender). A sequence in any other palette reintroduces the
  exact problem this system was built to remove.
