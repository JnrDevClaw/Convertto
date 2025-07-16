/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./Views/**/*.html", // This tells Tailwind to scan all HTML files in the 'Views' directory and its subdirectories
    "./Views/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Public Sans"', '"Noto Sans"', 'sans-serif'],
        work: ['"Work Sans"', '"Noto Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}