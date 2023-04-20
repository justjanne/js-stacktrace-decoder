import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/page/',
  plugins: [react()],
  build: {
    target: "esnext",
    minify: false,
    outDir: "../addon/page/",
    rollupOptions: {
      preserveEntrySignatures: true,
      output: {
        preserveModules: true,
      },
    },
  },
})
