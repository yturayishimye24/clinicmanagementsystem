
import flowbite from "flowbite-react/tailwind";
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      fonts: {
        poppins: ["Poppins", "sans-serif"],
      },
      
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },

      boxShadow: {
        cozy: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        "cozy-lg":
          "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
      },

      transitionTimingFunction: {
        cozy: "ease-in-out",
      },
      transitionDuration: {
        cozy: "200ms",
      },
        keyframes: {
        formEnter: {
          '0%': {
            opacity: '0',
            transform: 'translateY(40px) scale(0.98)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
      },
      animation: {
        formEnter: 'formEnter 0.5s ease-out forwards',
      },
    },
    
  },
  darkMode: "class",
  plugins: [flowbite.plugin()],
};
