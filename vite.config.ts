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
        codeSplitting: mode !== 'compile',
        // Router.tsx dérive l'URL de chaque page de src/pages/ depuis le nom
        // du composant (WebManager -> /web-manager) via son .name à
        // l'exécution ; keepNames empêche la minification (rolldown) de
        // renommer les fonctions et de casser ce mapping en production.
        minify: { mangle: { keepNames: true } },
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
