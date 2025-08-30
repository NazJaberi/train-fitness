// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  // We'll use 'class' strategy for dark mode, which allows manual switching
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brandPrimary: '#00BFFF',     // The main bright blue
        brandAccent: '#00FFFF',      // The cyan/accent color
        brandDark: '#2C3E50',        // Dark grey for text
        brandLight: '#FFFFFF',       // White
        brandBgLight: '#F7F9FC',      // A very light grey for the light mode background
        brandBgDark: '#121212',       // A standard dark background
        brandTextLight: '#2C3E50',   // Dark text for light mode
        brandTextDark: '#E0E0E0',    // Light grey text for dark mode
      },
    },
  },
  plugins: [],
};