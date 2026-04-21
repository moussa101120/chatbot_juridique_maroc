/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        brand: { 600: "#1d4ed8", 700: "#1e40af", 900: "#1e3a8a" },
        surface: { 50: "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0", 800: "#1e293b", 900: "#0f172a" },
      },
    },
  },
  plugins: [],
};

