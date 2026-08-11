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

export const SCENES = {
  mark: [0, 0.16],
  opening: [0.12, 0.42],
  services: [0.36, 0.68],
  clients: [0.62, 0.9],
  resolve: [0.86, 1],
} as const

export type ClientName = (typeof CLIENTS)[number]
export type ServiceName = (typeof SERVICES)[number]
export type SceneName = keyof typeof SCENES
