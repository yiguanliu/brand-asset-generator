import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  worker: {
    format: 'es',
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor splits — change rarely, can be cached forever
          react: ['react', 'react-dom'],
          konva: ['konva', 'react-konva', 'use-image'],
          framer: ['framer-motion'],
          // Misc utilities together
          utils: ['zustand', 'idb-keyval', 'nanoid', 'clsx', 'react-dropzone'],
        },
      },
    },
  },
});
