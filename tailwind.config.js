/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen-Sans",
          "Ubuntu",
          "Cantarell",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      minWidth: {
        8.5: "2.125rem",
        10: "2.5rem",
        96: "24rem",
      },
      minHeight: {
        4: "1rem",
        5: "1.25rem",
      },
      spacing: {
        5.5: "1.375rem",
      },
    },
  },
  plugins: [],
};
