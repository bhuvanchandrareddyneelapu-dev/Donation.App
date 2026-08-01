/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#ff6b00',
          600: '#ea580c',
          700: '#c2410c',
        },
        maroon: {
          800: '#5c0000',
          900: '#3d0000',
          950: '#260000',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        }
      },
    },
  },
  plugins: [],
}
