import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import rehypeShiki from '@shikijs/rehype'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        rehypePlugins: [[rehypeShiki, {
          themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
        }]],
      }),
    },
    react({ include: /\.(jsx|js|mdx|md)$/ }),
  ],
})
