import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import rehypeShiki from '@shikijs/rehype';
import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL } from 'node:url';

function rehypeRemoveCodeBlockTabStops() {
  return (tree) => {
    visit(tree);
  };

  function visit(node) {
    if (node.type === 'element' && node.tagName === 'pre') {
      node.properties ??= {};
      node.properties.tabIndex = -1;
    }

    node.children?.forEach(visit);
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    base: env.VITE_BASE_PATH || '/',
    resolve: {
      alias: {
        '@content/registry': fileURLToPath(
          new URL(
            isSsrBuild ? './src/content/registry.server.js' : './src/content/registry.js',
            import.meta.url,
          ),
        ),
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
      react({ include: /\.(jsx|js|mdx|md)$/ }),
    ],
  };
});
