import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // For GitHub Pages, set BASE_PATH (example: /my-repo/) during build.
    // Use relative URLs by default so the build works even when the repo name
    // (and thus the Pages subpath) differs from `package.json`.
    base: env.BASE_PATH || './',
  }
})
