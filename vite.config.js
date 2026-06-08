import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => ({
  plugins: [react()],
  server: {
    port: 5173,
    // proxy API requests to demo server running on 4000
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    target: 'es2018'
  }
}))
