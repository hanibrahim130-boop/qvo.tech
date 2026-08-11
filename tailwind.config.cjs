/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        display: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['Archivo', 'system-ui', 'sans-serif'],
      },
      colors: {
        page: '#0a0a0a',
        panel: '#111113',
        accent: '#D9FF3F',
      },
    },
  },
  plugins: [],
}
