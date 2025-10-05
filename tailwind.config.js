/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#193752',
        'cream': '#F2E8C3',
        'warm-yellow': '#F5A219',
        'orange': '#F27612',
        'red-brown': '#B5291D',
      },
      fontFamily: {
        'heebo': ['Heebo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

