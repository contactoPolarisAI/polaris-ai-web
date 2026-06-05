import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacidad: resolve(__dirname, 'politica-privacidad.html'),
        cookies: resolve(__dirname, 'politica-cookies.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
