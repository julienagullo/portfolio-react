import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import browserslist from 'browserslist'
import { browserslistToTargets } from 'lightningcss'

export default defineConfig(({ mode, command }) => ({
  plugins: [react()],
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist('defaults, not IE 11')),
    },
  },
  build: {
    rollupOptions: {
      output: {
        inlineDynamicImports: mode === 'compile',
      },
    },
  },
  server:
    command === 'serve'
      ? {
          proxy: {
            '/api.php': {
              target: 'http://localhost/portfolio',
              changeOrigin: true,
            },
          },
        }
      : undefined,
}))
