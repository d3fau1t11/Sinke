import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import alias from '@rollup/plugin-alias';

export default defineConfig({
  plugins: [
    react(),
    alias({
      entries: [
        { find: '@senik/i18n', replacement: resolve(__dirname, '../../packages/i18n/src') },
        { find: '@senik/api', replacement: resolve(__dirname, '../../packages/api/src') },
        { find: '@senik/utils', replacement: resolve(__dirname, '../../packages/utils/src') },
        { find: '@senik/types', replacement: resolve(__dirname, '../../packages/types/src') },
        { find: '@', replacement: resolve(__dirname, 'src') }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@senik/i18n': resolve(__dirname, '../../packages/i18n/src'),
      '@senik/api': resolve(__dirname, '../../packages/api/src'),
      '@senik/utils': resolve(__dirname, '../../packages/utils/src'),
      '@senik/types': resolve(__dirname, '../../packages/types/src')
    }
  },
  optimizeDeps: {
    include: ['@senik/i18n', '@senik/api', '@senik/utils', '@senik/ui', '@senik/types']
  },
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query']
        }
      }
    }
  }
});