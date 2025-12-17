const { heroui } = require("@heroui/react");
const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // HeroUI
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    // Flowbite
    flowbite.content(),
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui(),
    flowbite.plugin(),
  ],
};
