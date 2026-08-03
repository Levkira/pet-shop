/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#fef6ed',
        sand: '#EAE0C8',
        forest: '#1F3A2E',
        mustard: '#E4B94A',
        rust: '#B5502E',
        ink: '#22221E',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        display: ['Roboto', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
