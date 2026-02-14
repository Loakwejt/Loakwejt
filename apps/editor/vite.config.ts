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
    host: true, // Listen on all addresses for Cloudflare tunnel
    cors: true,
    hmr: {
      overlay: true,
      // Only use tunnel settings if running through tunnel
      // For local development, use defaults (comment out below lines if having issues)
      // clientPort: 443,
      // protocol: 'wss',
    },
    allowedHosts: [
      'localhost',
      '.trycloudflare.com',
    ],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
});
