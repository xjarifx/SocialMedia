/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        primary: {
          50: "#fff5ed",
          100: "#ffe8d6",
          200: "#ffceac",
          300: "#ffab77",
          400: "#ff8540",
          500: "#ff6b1a", // Brighter, more vibrant orange
          600: "#f05a0a",
          700: "#c7450b",
          800: "#9e3810",
          900: "#7f3010",
          950: "#451607",
        },
        // Orange accent variations
        accent: {
          orange: "#ff6b1a",
          "orange-light": "#ff8540",
          "orange-dark": "#f05a0a",
          glow: "rgba(255, 107, 26, 0.15)",
        },
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
      },
      boxShadow: {
        soft: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "soft-lg":
          "0 10px 15px -3px rgb(0 0 0 / 0.15), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        "orange-glow":
          "0 0 20px rgba(255, 107, 26, 0.3), 0 0 40px rgba(255, 107, 26, 0.1)",
        "orange-glow-sm": "0 0 10px rgba(255, 107, 26, 0.2)",
      },
      borderRadius: {
        soft: "8px",
        "soft-lg": "12px",
      },
    },
  },
  plugins: [],
};
