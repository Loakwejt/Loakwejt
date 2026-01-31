import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom', 'zustand'],
  },
  optimizeDeps: {
    include: [
      '@builderly/ui',
      '@builderly/core',
      'zustand',
      '@dnd-kit/core',
      '@dnd-kit/sortable',
    ],
  },
  server: {
    port: 5173,
    cors: true,
    hmr: {
      overlay: true,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
});
