# Global backdrop

One video sits behind the whole site and is scrubbed by scroll position, so
the page reads as a single continuous shot instead of a stack of unrelated
section backgrounds.

`src/components/GlobalBackdrop.tsx` is the only implementation. There is no
canvas, no procedural drawing and no image-sequence player.

## How it works

- A `<video>` is fixed at `inset-0 z-0`, `object-cover`, muted, never played.
- One master `ScrollTrigger` spans `document.documentElement` and reports
  progress from 0 to 1.
- A `requestAnimationFrame` loop eases a rendered value toward that progress
  (`EASE = 0.1`) and maps it onto `video.currentTime`. The easing is why the
  film feels heavy instead of glued to the wheel.
- Seeks are throttled to one per ~33ms and sub-frame seeks are dropped, so a
  fast flick does not queue up hundreds of decodes.
- Progress is published through `src/lib/backdropProgress.ts` so anything else
  can read the film's position without adding a second scroll listener.
  Lenis already drives `ScrollTrigger.update()`, and two scroll systems fight.
- `prefers-reduced-motion: reduce` paints one still frame and never starts the
  loop.

## The clip

Source: Pexels video 33357978, "Abstract Purple and Blue Fluid Motion
<br>Background" — 1920x1080, 30fps, 10s.

Licence: the Pexels Licence. Free for commercial use, no attribution
required, no permission needed. Redistributing the clip as stock footage is
not allowed, which is one reason we re-encode and host our own copy instead
of hotlinking the Pexels CDN.

Hosting is deliberately off-repo: a 10MB binary does not belong in git
history, and Vercel should not serve it from the app bundle.

## Re-encoding, and why it is mandatory

Stock clips carry a keyframe every few seconds. Setting `currentTime` forces
the browser to decode forward from the nearest preceding keyframe, so with
sparse keyframes every scroll tick costs a multi-frame decode and the scrub
visibly stutters. Making every frame a keyframe turns each seek into a single
decode. The file gets bigger, so resolution and frame rate come down to pay
for it.

```bash
ffmpeg -y -i src.mp4 -an \
  -vf "scale=1600:-2:flags=lanczos,fps=24,\
eq=saturation=0.82:contrast=1.05:brightness=-0.05,\
colorbalance=rs=-0.06:gs=-0.07:bs=0.10:rm=0.05:gm=-0.04:bm=0.07:rh=0.07:gh=-0.02:bh=0.06,\
curves=all='0/0 0.5/0.46 1/0.96'" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -g 1 -keyint_min 1 -sc_threshold 0 \
  -crf 27 -preset medium -movflags +faststart \
  scrub.mp4
```

Result: 1600x900, 24fps, 240 frames, 240 keyframes, 10.8MB, `faststart` so
playback can begin before the whole file arrives.

The grade is not decoration. The source leans blue, and the palette has no
blue in it, so the filter chain pushes hue toward violet, drops saturation,
and crushes blacks toward `#0C0C0C` so the clip sits inside the palette
instead of fighting it. Grading in ffmpeg rather than with a CSS blend keeps
the cost at zero on the client.

## Requirements for any replacement clip

The host must answer with `accept-ranges: bytes`. Without range requests the
browser cannot seek and the scrub cannot work at all. Verify before shipping:

```bash
curl -sIL "$URL" | grep -iE '^(HTTP/|content-length:|accept-ranges:)'
curl -sS -r 0-1023 -o /dev/null -w '%{http_code}\n' "$URL"   # expect 206
```

Other constraints worth keeping:

- 8 to 16 seconds. Long clips waste bytes, because the whole page maps onto
  the whole clip either way.
- Landscape. A portrait source gets cropped to nothing by `object-cover`.
- Modest bitrate at the source. A 105Mbps 4K clip is 131MB before you start.
- Abstract and slow. Anything with a recognisable subject or a hard cut reads
  as a stock video playing behind the text.

## Swapping the clip

Re-encode with the recipe above, upload to off-repo hosting, and change
`BACKDROP_VIDEO_URL` in `src/components/GlobalBackdrop.tsx`. That is the only
code change.
