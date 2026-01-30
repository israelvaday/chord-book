import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitHub Pages - update 'tab-viewer' to your repo name
  base: process.env.GITHUB_ACTIONS ? '/tab-viewer/' : '/',
})
