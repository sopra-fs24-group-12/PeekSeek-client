/** @type {import('tailwindcss').Config} */
/**
 * Initiate nextUI:
 */
const {nextui} = require("@nextui-org/react");
const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,tsx,ts}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",

  ],
  theme: {
    colors: {
      gold: colors.yellow,
    },
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],
}

