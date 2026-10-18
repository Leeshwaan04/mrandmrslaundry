import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// This admin app builds into the main site's dist/admin/ so a single
// GitHub Pages deployment serves both. See ../.github/workflows/deploy.yml —
// the main site MUST build first, since its own build empties ./dist.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '../dist/admin',
    emptyOutDir: true,
  },
})
