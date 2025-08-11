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
      input: resolve(__dirname, 'src/smartplanner.html'),
    },
  },
  server: {
    port: 3001,
    host: true,
  },
});
