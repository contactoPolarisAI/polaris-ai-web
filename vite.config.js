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
        cookies: resolve(__dirname, 'politica-cookies.html'),
        terminos: resolve(__dirname, 'terminos.html'),
        gestorias: resolve(__dirname, 'sector-gestorias.html'),
        clinicas: resolve(__dirname, 'sector-clinicas.html'),
        despachos: resolve(__dirname, 'sector-despachos.html'),
        logistica: resolve(__dirname, 'sector-logistica.html'),
        solucionesFacturas: resolve(__dirname, 'soluciones-facturas.html'),
        solucionesRag: resolve(__dirname, 'soluciones-rag.html'),
        solucionesWhatsapp: resolve(__dirname, 'soluciones-whatsapp.html'),
        solucionesInformes: resolve(__dirname, 'soluciones-informes.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
