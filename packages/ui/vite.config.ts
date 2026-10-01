import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      '@senik/i18n': resolve(__dirname, '../../packages/i18n/src')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SenikUI',
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'clsx', 'tailwind-merge', 'lucide-react'],
      output: {
        globals: { react: 'React', 'react-dom': 'ReactDOM' }
      }
    },
    cssCodeSplit: false
  }
});