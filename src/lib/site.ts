export const SITE = {
  email: 'hello@qvo.tech',
  github: 'https://github.com/hanibrahim130-boop/qvo.tech',
} as const

export const SERVICES = ['DESIGN', 'DEVELOPMENT', 'DIRECTION'] as const

export const CLIENTS = [
  'WHITE Real Estate Group',
  'brandi intl',
  'FERRI',
  'City University',
  'Mofa Boutique',
  'Mouttahed Basketball Academy',
] as const

/**
 * Scroll-progress windows for the cinematic scene, in `0…1` timeline space.
 * Monotonic, with small overlaps so beats hand over instead of cutting. Every
 * scroll-linked beat is positioned from these numbers, never from literals.
 */
export const SCENES = {
  mark: [0, 0.16],
  opening: [0.12, 0.42],
  services: [0.36, 0.68],
  clients: [0.62, 0.9],
  resolve: [0.86, 1],
} as const

/**
 * Per-device scene media, prepared from the approved 10s masters. Exactly one
 * variant is ever mounted, so a visit fetches one MP4 and one poster.
 */
export const SCENE_MEDIA = {
  desktop: {
    src: '/assets/scene/desktop.mp4',
    poster: '/assets/scene/poster-desktop.webp',
    width: 1280,
    height: 720,
  },
  mobile: {
    src: '/assets/scene/mobile.mp4',
    poster: '/assets/scene/poster-mobile.webp',
    width: 720,
    height: 1280,
  },
} as const

/** Both scene masters are 30fps, so one frame lasts 1/30s. */
export const SCENE_FRAME_SECONDS = 1 / 30

export type ClientName = (typeof CLIENTS)[number]
export type ServiceName = (typeof SERVICES)[number]
export type SceneName = keyof typeof SCENES
export type SceneVariant = keyof typeof SCENE_MEDIA
