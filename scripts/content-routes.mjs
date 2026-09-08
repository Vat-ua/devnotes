import { readdirSync } from 'node:fs';

export function getPublicRoutes() {
  return [
    '/',
    '/articles',
    '/labs',
    '/sobre',
    ...getSlugs('articles').map((slug) => `/articles/${slug}`),
    ...getSlugs('labs').map((slug) => `/labs/${slug}`),
  ];
}

export function getPrerenderRoutes() {
  return [...getPublicRoutes(), '/404'];
}

function getSlugs(type) {
  return readdirSync(new URL(`../content/${type}/`, import.meta.url), {
    withFileTypes: true,
  })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((first, second) => first.localeCompare(second, 'pt-BR'));
}
