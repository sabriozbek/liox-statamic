import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist/client',
    sourcemap: true,
    rollupOptions: {
      output: isSsrBuild
        ? undefined
        : {
            manualChunks: {
              vendor: ['react', 'react-dom', 'react-router'],
              forms: ['react-hook-form', 'zod', '@hookform/resolvers'],
            },
          },
    },
  },
  ssr: {
    noExternal: ['react-router', 'react-router-dom'],
  },
}))
