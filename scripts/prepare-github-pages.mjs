import { copyFile, cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function prepareGitHubPagesArtifact({ basename, clientDirectory, routes }) {
  const clientPath = path.resolve(clientDirectory);
  const basenamePath = basename.replace(/^\/+|\/+$/g, '');

  if (basenamePath) {
    const prerenderPath = path.join(clientPath, basenamePath);
    const entries = await readdir(prerenderPath, { withFileTypes: true });

    for (const entry of entries) {
      await cp(path.join(prerenderPath, entry.name), path.join(clientPath, entry.name), {
        recursive: entry.isDirectory(),
        force: true,
      });
    }

    await rm(prerenderPath, { recursive: true, force: true });
  }

  await copyFile(path.join(clientPath, '404', 'index.html'), path.join(clientPath, '404.html'));
  await writeSitemap(
    clientPath,
    routes.filter((route) => route !== '/404'),
  );
}

async function writeSitemap(clientPath, routes) {
  const locations = await Promise.all(
    routes.map(async (route) => {
      const filename = route === '/' ? 'index.html' : path.join(route.slice(1), 'index.html');
      const html = await readFile(path.join(clientPath, filename), 'utf8');
      const canonical = html.match(/<link rel="canonical" href="([^"]+)"\s*\/?>(?:<\/link>)?/)?.[1];

      if (!canonical) {
        throw new Error(`Canonical ausente na página prerenderizada "${route}".`);
      }

      return `  <url><loc>${escapeXml(canonical)}</loc></url>`;
    }),
  );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locations.join('\n')}\n</urlset>\n`;
  await mkdir(clientPath, { recursive: true });
  await writeFile(path.join(clientPath, 'sitemap.xml'), sitemap);
}

function escapeXml(value) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character],
  );
}
