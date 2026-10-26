/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        evergreen: '#214A3A',
        brass: '#C3A45F',
        paper: '#F2EDDF',
        observatory: '#53746B',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
};