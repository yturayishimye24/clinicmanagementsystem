import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import flowbiteReact from "flowbite-react/plugin/vite"
import path from "path"
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(), 
    flowbiteReact(),
    tailwindcss()
  ],
  server:{port : 5173},
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})