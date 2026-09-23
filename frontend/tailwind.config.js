/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#12151C",
          50: "#f4f5f7", 100: "#e3e5ea", 200: "#c7cbd4", 300: "#a3aab7",
          400: "#7a8496", 500: "#5a6478", 600: "#454d5e", 700: "#363c4a",
          800: "#2a2f3a", 900: "#12151C",
        },
        brand: {
          DEFAULT: "#0077F5",
          50: "#e6f2ff", 100: "#cce5ff", 200: "#99cbff", 300: "#66b0ff",
          400: "#3396ff", 500: "#0077F5", 600: "#005fc4", 700: "#004793",
          800: "#002f62", 900: "#001831",
        },
      },
      fontFamily: {
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        poppins: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
