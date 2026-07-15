import { defineConfig } from 'vite';

export default defineConfig({
  base: '/hajj-umrah-3d-guide/',
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
});
