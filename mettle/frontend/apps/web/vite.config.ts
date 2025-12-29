import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:48018',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:48018',
        changeOrigin: true,
      },
      '/metrics': {
        target: 'http://localhost:48018',
        changeOrigin: true,
      },
      '/chat': {
        target: 'http://localhost:48018',
        changeOrigin: true,
      },
      '/upload_document': {
        target: 'http://localhost:48018',
        changeOrigin: true,
      },
      '/categories': {
        target: 'http://localhost:48018',
        changeOrigin: true,
      },
    }
  }
})
