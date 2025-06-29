import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 9000,
    open: false,
    host: true, // Allow external connections for testing
    strictPort: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  // Enable ES modules
  esbuild: {
    target: 'es2020'
  },
  // Optimize for WebGL and heavy JavaScript
  optimizeDeps: {
    include: ['index.html']
  }
})