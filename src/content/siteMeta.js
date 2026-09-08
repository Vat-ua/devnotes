const siteUrl = (import.meta.env.VITE_SITE_URL ?? 'http://localhost:5173').replace(/\/$/, '');

export const site = {
  name: 'DevNotes',
  description: 'Notas, ideias e laboratórios para quem constrói na web.',
  url: siteUrl,
  image: `${siteUrl}/devnotes-social.png`,
  imageAlt: 'DevNotes — ideias para construir na web',
  imageWidth: 1729,
  imageHeight: 910,
};

export function getPageMeta(pathname, articles, labs) {
  const path = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  const article = articles.find((item) => path === `/articles/${item.slug}`);
  const lab = labs.find((item) => path === `/labs/${item.slug}`);

  if (article) {
    return contentMeta(article, path, 'article');
  }

  if (lab) {
    return contentMeta(lab, path, 'website');
  }

  const pages = {
    '/': { title: 'DevNotes — ideias para construir na web', description: site.description },
    '/articles': {
      title: 'Artigos — DevNotes',
      description: 'Leituras curtas sobre interfaces, full stack e decisões de produto.',
    },
    '/labs': {
      title: 'Labs — DevNotes',
      description: 'Experimentos interativos para observar comportamentos e testar ideias.',
    },
    '/sobre': {
      title: 'Sobre — DevNotes',
      description: 'Conheça os princípios e a proposta editorial do DevNotes.',
    },
  };

  const page = pages[path] ?? {
    title: 'Página não encontrada — DevNotes',
    description: site.description,
  };
  return {
    ...page,
    canonical: absoluteUrl(path),
    image: site.image,
    imageAlt: site.imageAlt,
    imageWidth: site.imageWidth,
    imageHeight: site.imageHeight,
    type: 'website',
  };
}

function contentMeta(content, path, type) {
  return {
    title: `${content.title} — DevNotes`,
    description: content.description,
    canonical: absoluteUrl(path),
    image: absoluteAssetUrl(`/social${path}.png`),
    imageAlt: `${content.title} — ${type === 'article' ? 'artigo' : 'Lab'} do DevNotes`,
    imageWidth: 1200,
    imageHeight: 630,
    type,
    publishedTime: type === 'article' ? content.publishedAt : undefined,
    section: type === 'article' ? content.topics[0] : undefined,
  };
}

function absoluteUrl(path) {
  return `${siteUrl}${path === '/' ? '/' : `${path}/`}`;
}

function absoluteAssetUrl(path) {
  return `${siteUrl}${path}`;
}
