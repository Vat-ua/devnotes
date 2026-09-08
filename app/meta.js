import { getPageMeta } from '../src/content/siteMeta.js';

export function pageMeta(path) {
  return toFrameworkMeta(getPageMeta(path, [], []));
}

export function contentMeta(content, type) {
  const path = type === 'article' ? `/articles/${content.slug}` : `/labs/${content.slug}`;
  const articles = type === 'article' ? [content] : [];
  const labs = type === 'lab' ? [content] : [];

  return toFrameworkMeta(getPageMeta(path, articles, labs));
}

function toFrameworkMeta(meta) {
  const descriptors = [
    { title: meta.title },
    { name: 'description', content: meta.description },
    { tagName: 'link', rel: 'canonical', href: meta.canonical },
    { property: 'og:locale', content: 'pt_BR' },
    { property: 'og:type', content: meta.type },
    { property: 'og:site_name', content: 'DevNotes' },
    { property: 'og:title', content: meta.title },
    { property: 'og:description', content: meta.description },
    { property: 'og:url', content: meta.canonical },
    { property: 'og:image', content: meta.image },
    { property: 'og:image:alt', content: meta.imageAlt },
    { property: 'og:image:width', content: String(meta.imageWidth) },
    { property: 'og:image:height', content: String(meta.imageHeight) },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: meta.title },
    { name: 'twitter:description', content: meta.description },
    { name: 'twitter:image', content: meta.image },
    { name: 'twitter:image:alt', content: meta.imageAlt },
  ];

  if (meta.publishedTime) {
    descriptors.push({ property: 'article:published_time', content: meta.publishedTime });
  }

  for (const tag of meta.tags ?? []) {
    descriptors.push({ property: 'article:tag', content: tag });
  }

  return descriptors;
}
