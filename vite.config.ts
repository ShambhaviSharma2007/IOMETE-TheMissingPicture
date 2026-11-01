import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // Serve index.html for all routes (SPA routing)
  preview: {
    port: 4173,
  },
})

