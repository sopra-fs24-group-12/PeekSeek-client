/** @type {import('tailwindcss').Config} */
/**
 * Initiate nextUI:
 */
const {nextui} = require("@nextui-org/react");
<<<<<<< HEAD

=======
const colors = require('tailwindcss/colors')
>>>>>>> ebdeb8fda43ed305682c4617c11a3ec0c2ffe1b7
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,tsx,ts}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
<<<<<<< HEAD
  ],
  theme: {
    extend: {
      backgroundImage: {
          'background': "url('/public/images/background_image.jpg')",
      },
   },
=======

  ],
  theme: {
    colors: {
      gold: colors.yellow,
    },
    extend: {},
>>>>>>> ebdeb8fda43ed305682c4617c11a3ec0c2ffe1b7
  },
  darkMode: "class",
  plugins: [nextui()],
}
<<<<<<< HEAD
=======

>>>>>>> ebdeb8fda43ed305682c4617c11a3ec0c2ffe1b7
