import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: true,
    watch: {
      ignored: [
        '**/server/temp_renders/**',
        '**/media/**',
        '**/media_test/**',
        '**/*.mp4',
        '**/*.webm',
        '**/*.gif',
        '**/*.png',
        '**/*.tex',
      ],
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        timeout: 300000,
      },
    },
  },
})
