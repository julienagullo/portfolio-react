import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import browserslist from 'browserslist'
import { browserslistToTargets } from 'lightningcss'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      // Cibles explicites : sans ça, Lightning CSS dédoublonne mal
      // `backdrop-filter` / `-webkit-backdrop-filter` et ne garde que
      // la forme préfixée (obsolète sur les navigateurs récents) au build.
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
}))
