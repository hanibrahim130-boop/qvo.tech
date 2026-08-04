import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'scroll-scrub-video': fileURLToPath(
        new URL('./packages/scroll-scrub-video/src/index.ts', import.meta.url),
      ),
    },
  },
  server: {
    port: 5199,
    host: true
  }
})
