import flowbite from "flowbite-react/tailwind";
import daisyui from "daisyui";
import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  safelist: [
    '!duration-[0ms]',
    '!delay-[0ms]',
    'html.js :where([class*="taos:"]:not(.taos-init))',
  ],
  theme: {
    extend: {
      fonts: {
        poppins: ["Poppins", "sans-serif"],
      },
      fontFamily: {
        // 1. Added Plus Jakarta Sans as the primary sans font
        sans: ['"Plus Jakarta Sans"', "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      boxShadow: {
        // 2. Updated the cozy shadow to your new values
        cozy: "0px 4px 20px rgba(0, 0, 0, 0.03)",
        "cozy-lg": "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
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
  plugins: [
    flowbite.plugin(),
    daisyui,
    require('taos/plugin'),
    // 3. Added Tailwind plugin to inject your custom CSS classes
    plugin(function ({ addComponents }) {
      addComponents({
        '.cozy-transition': {
          transition: 'all 0.2s ease-in-out',
        },
        '.sidebar-item': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px 20px',
          borderRadius: '24px',
          gap: '8px',
          transition: 'background-color 0.2s ease-in-out',
          cursor: 'pointer',
          width: 'fit-content',
          '&:hover': {
            backgroundColor: '#f4f5f7',
          },
          '&:hover .menu-text': {
            background: 'linear-gradient(to right, #65a30d, #06b6d4)',
            '-webkit-background-clip': 'text',
            '-webkit-text-fill-color': 'transparent',
            'background-clip': 'text',
            fontWeight: '500',
          },
          '&:hover .icon': {
            fill: '#65a30d',
          },
        },
        '.modal-backdrop-blur': {
          backdropFilter: 'blur(8px)',
          '-webkit-backdrop-filter': 'blur(8px)',
        },
      });
    }),
  ],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ],
    darkMode: "class",
  },
};