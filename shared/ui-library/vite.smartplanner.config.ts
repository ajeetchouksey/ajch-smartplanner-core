import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: './src',
  build: {
    outDir: '../dist-smartplanner',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/smartplanner.html'),
        travel: resolve(__dirname, 'src/travel.html'),
        finance: resolve(__dirname, 'src/finance.html'),
        day: resolve(__dirname, 'src/day.html'),
      },
    },
  },
  server: {
    port: 3001,
    host: true,
  },
});
