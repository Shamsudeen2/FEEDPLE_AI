import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: "**/*.svg",
    }),
  ],
  server: {
    proxy: {
      '/api/py/api/v1': {
        target: 'https://feedple-ai.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
})
