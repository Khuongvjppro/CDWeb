/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: "#faf7f2",
          100: "#f3eadf",
          200: "#e7d2b8",
          300: "#d5b089",
          400: "#c08a56",
          500: "#a96935",
          600: "#8b4513",
          700: "#6b3410",
          800: "#4d250c",
          900: "#321807",
        },
      },
      boxShadow: {
        soft: "0 20px 60px rgba(49, 24, 7, 0.12)",
      },
    },
  },
  plugins: [],
};
