import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: './shared/ui-library',
  server: {
    port: 3001,
    open: true
  },
  resolve: {
    alias: {
      '@': './src'
    }
  }
})
