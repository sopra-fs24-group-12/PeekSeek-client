/** @type {import('tailwindcss').Config} */
/**
 * Initiate nextUI:
 */
const {nextui} = require("@nextui-org/react");

module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,tsx,ts}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
          'background': "url('/public/backgroundimage.jpg')",
      },
   },
  },
    "compilerOptions": {
      "esModuleInterop": true,
    },
  darkMode: "class",
  plugins: [nextui()],
}
