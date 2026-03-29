/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./DevRoot.tsx",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./design/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:    "#8B5CF6",
        secondary:  "#10B981",
        accent:     "#FBBF24",
        background: "#F3F4F6",
        surface:    "#FFFFFF",
      },
      fontFamily: {
        heading: ['"Fredoka"', 'cursive', 'sans-serif'],
        body:    ['"Quicksand"', 'sans-serif'],
      },
      boxShadow: {
        clay: '8px 8px 16px 0px rgba(0,0,0,0.1), -4px -4px 12px 0px rgba(255,255,255,0.8)',
        toy:  '0px 10px 0px 0px rgba(109,40,217,0.3)',
      },
    },
  },
  plugins: [],
}
