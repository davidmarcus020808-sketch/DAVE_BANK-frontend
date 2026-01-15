// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <-- include all JS/TS/React files
  ],
  darkMode: "class", // ✅ Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: "#FFD700", // optional gold color
        secondary: "#111",   // optional dark color
      },
    },
  },
  plugins: [],
};
