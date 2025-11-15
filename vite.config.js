import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './src/app'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  optimizeDeps: {
    include: ['recharts', 'compute-scroll-into-view', 'scroll-into-view-if-needed'],
    exclude: [],
  },
  server: {
    port: 5173,
    strictPort: true,
    fs: {
      strict: false,
    },
    proxy: {
      // Proxy para todas las peticiones a la API
      // Redirige /api/* a http://localhost:8000/api/* para evitar CORS
      '/api': {
        target: process.env.VITE_PROXY_TARGET || 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        // Mantener el /api en el path para que el backend lo reciba
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
