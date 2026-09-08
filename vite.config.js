import mdx from '@mdx-js/rollup';
import { reactRouter } from '@react-router/dev/vite';
import rehypeShiki from '@shikijs/rehype';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL } from 'node:url';

function rehypeRemoveCodeBlockTabStops() {
  return (tree) => visit(tree);

  function visit(node) {
    if (node.type === 'element' && node.tagName === 'pre') {
      node.properties ??= {};
      node.properties.tabIndex = -1;
    }

    node.children?.forEach(visit);
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const basename = process.env.DEVNOTES_BASE_PATH ?? env.VITE_BASE_PATH ?? '/devnotes/';

  return {
    base: `${basename.replace(/\/$/, '')}/`,
    resolve: {
      alias: {
        '@content/registry': fileURLToPath(new URL('./app/content.js', import.meta.url)),
      },
    },
    plugins: [
      {
        enforce: 'pre',
        ...mdx({
          rehypePlugins: [
            [
              rehypeShiki,
              {
                themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
                parseMetaString(meta) {
                  return /\bcopy\s*=\s*false\b/.test(meta) ? { copy: false } : {};
                },
                transformers: [
                  {
                    name: 'devnotes:code-block-copy-preference',
                    pre(node) {
                      if (this.options.meta.copy === false) {
                        node.properties['data-copy'] = 'false';
                      }
                    },
                  },
                ],
              },
            ],
            rehypeRemoveCodeBlockTabStops,
          ],
        }),
      },
      react(),
      reactRouter(),
    ],
  };
});
