import { defineConfig } from 'vite'

export default defineConfig ({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: 'index.html'
    },
    minify: 'esbuild',
    sourcemap: false
  }
})