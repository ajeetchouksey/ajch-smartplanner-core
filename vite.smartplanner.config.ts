import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: './shared/ui-library',
  server: {
    port: 3003,
    open: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './shared/ui-library/src')
    }
  },
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, './shared/ui-library/src/smartplanner.html')
    }
  }
})
