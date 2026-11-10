import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const buildMode = process.env['SENIK_BUILD_MODE'] || (mode === 'development' ? 'dev' : mode);
  return {
    mode: buildMode,
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@senik/api': resolve(__dirname, '../../packages/api/src'),
        '@senik/ui': resolve(__dirname, '../../packages/ui/src'),
        '@senik/i18n': resolve(__dirname, '../../packages/i18n/src'),
        '@senik/utils': resolve(__dirname, '../../packages/utils/src'),
        '@senik/types': resolve(__dirname, '../../packages/types/src'),
      },
    },
    define: {
      'import.meta.env.VITE_APP_ENV': JSON.stringify(
        ['production', 'prod'].includes(buildMode) ? 'production' : buildMode,
      ),
    },
    server: { port: 5176, strictPort: true, host: true },
    preview: { port: 5176, strictPort: true, host: true },
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            query: ['@tanstack/react-query'],
            charts: ['recharts'],
          },
        },
      },
    },
  };
});
