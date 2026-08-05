/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      // One family, four depths. `page` must match the backdrop canvas base
      // exactly, otherwise a seam shows where the canvas ends.
      colors: {
        page: '#0C0C0C',
        panel: '#141119',
        brand: '#36255C',
        accent: '#8B6FE8',
        lavender: '#D2C3F6',
      },
      keyframes: {
        marquee: {
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 26s linear infinite',
      },
    },
  },
  plugins: [],
}

