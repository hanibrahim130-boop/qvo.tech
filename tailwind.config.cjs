/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Two families, both variable, both OFL, both self-hosted through
      // Fontsource. Bricolage carries a width axis (75-100) and an optical
      // size axis (12-96), so display type is genuinely compressed rather
      // than just scaled up. Fraunces carries WONK and SOFT.
      fontFamily: {
        sans: ['"Bricolage Grotesque Variable"', '"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque Variable"', '"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        serif: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      // Two inks on paper. Nothing here is a gradient and nothing is violet.
      colors: {
        page: '#EDE9E1',
        panel: '#E2DCD0',
        ink: '#141210',
        accent: '#C0301A',
        brand: '#8C8375',
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
