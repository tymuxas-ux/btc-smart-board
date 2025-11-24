/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#4ade80",
          red: "#ef4444",
          blue: "#3b82f6"
        }
      }
    }
  },
  plugins: []
};
