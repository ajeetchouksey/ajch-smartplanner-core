import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: './shared/ui-library',
  server: {
    port: 3002,
    open: '/landing-page-dev.html'
  },
  resolve: {
    alias: {
      '@': './src'
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: './shared/ui-library/index.html',
        dev: './shared/ui-library/landing-page-dev.html',
        oauth: './shared/ui-library/oauth-only.html',
        smartplanner: './shared/ui-library/smartplanner.html'
      }
    }
  }
})
