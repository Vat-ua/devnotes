import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { render, routes } from '../dist-ssr/entry-server.js';

const distDir = new URL('../dist/', import.meta.url).pathname;
const template = await readFile(join(distDir, 'index.html'), 'utf8');
const pages = [
  ...routes.map((route) => ({
    route,
    file: route === '/' ? 'index.html' : join(route, 'index.html'),
  })),
  { route: '/404', file: '404.html' },
];
const renderedPages = pages.map(({ route, file }) => ({ route, file, ...render(route) }));

for (const { html, meta, file, route } of renderedPages) {
  const renderMode = isAsyncContentRoute(route) ? 'client' : 'hydrate';
  const output = template
    .replace(/<!-- page-meta:start -->[\s\S]*?<!-- page-meta:end -->/, pageMeta(meta))
    .replace(
      /<div id="root"(?:\s[^>]*)?>[\s\S]*?<\/body>/,
      `<div id="root" data-render-mode="${renderMode}">${html}</div>\n</body>`,
    );
  const outputFile = join(distDir, file);
  await mkdir(dirname(outputFile), { recursive: true });
  await writeFile(outputFile, output);
}

function isAsyncContentRoute(route) {
  return /^\/(articles|labs)\/[^/]+$/.test(route);
}

const sitemap = renderedPages
  .filter(({ route }) => route !== '/404')
  .map(({ meta }) => `  <url><loc>${escapeXml(meta.canonical)}</loc></url>`)
  .join('\n');

await writeFile(
  join(distDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap}\n</urlset>\n`,
);

function pageMeta(meta) {
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}">`,
    `<link rel="canonical" href="${meta.canonical}">`,
    `<meta property="og:type" content="${meta.type}">`,
    `<meta property="og:site_name" content="DevNotes">`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}">`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}">`,
    `<meta property="og:url" content="${meta.canonical}">`,
    `<meta property="og:image" content="${meta.image}">`,
    `<meta property="og:image:alt" content="DevNotes — ideias para construir na web">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}">`,
    `<meta name="twitter:image" content="${meta.image}">`,
    '<meta name="twitter:image:alt" content="DevNotes — ideias para construir na web">',
  ];

  if (meta.publishedTime)
    tags.push(`<meta property="article:published_time" content="${meta.publishedTime}">`);
  if (meta.section)
    tags.push(`<meta property="article:section" content="${escapeHtml(meta.section)}">`);

  return `<!-- page-meta:start -->\n  ${tags.join('\n  ')}\n  <!-- page-meta:end -->`;
}

function escapeHtml(value) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character],
  );
}

function escapeXml(value) {
  return escapeHtml(value);
}
