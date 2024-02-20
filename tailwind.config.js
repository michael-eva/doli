/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["false"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        raleway: "'Raleway', sans-serif",
        fira_sans: "'Fira Sans Condensed', sans-serif"
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}