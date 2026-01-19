/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B1120", 
        foreground: "#f8fafc",
        navy: {
          900: '#0B1120', 
          800: '#0F172A', 
          700: '#1e293b', 
        },
        teal: {
          500: '#14b8a6', 
          600: '#0d9488', 
          900: '#134e4a',
        },
        cyan: {
          400: '#22d3ee',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
