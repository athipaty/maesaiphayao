import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/abt': {
        target: 'https://center-kitchen-backend.onrender.com',
        changeOrigin: true,
      },
      '/auth': {
        target: 'https://center-kitchen-backend.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
