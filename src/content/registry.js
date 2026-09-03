const articleMetadataModules = import.meta.glob('../../content/articles/*/meta.js', {
  eager: true,
});
const articleModules = import.meta.glob('../../content/articles/*/index.mdx');
const labMetadataModules = import.meta.glob('../../content/labs/*/meta.js', { eager: true });
const labModules = import.meta.glob('../../content/labs/*/Lab.jsx');
const labGuideModules = import.meta.glob('../../content/labs/*/guide.mdx');

function byDate(first, second) {
  return new Date(second.date) - new Date(first.date);
}

export const articles = Object.values(articleMetadataModules)
  .map(({ meta }) => meta)
  .sort(byDate);

export const labs = Object.values(labMetadataModules)
  .map(({ meta }) => meta)
  .sort(byDate);

export function getArticleBySlug(slug) {
  return articles.find((article) => article.slug === slug);
}

export function getLabBySlug(slug) {
  return labs.find((lab) => lab.slug === slug);
}

function findModule(modules, slug, filename) {
  const module = Object.entries(modules).find(([path]) =>
    path.endsWith(`/${slug}/${filename}`),
  )?.[1];
  return module;
}

export function loadLab(slug) {
  return findModule(labModules, slug, 'Lab.jsx');
}

export function loadArticle(slug) {
  return findModule(articleModules, slug, 'index.mdx');
}

export function loadLabGuide(slug) {
  return findModule(labGuideModules, slug, 'guide.mdx');
}

export function formatContentDate(date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}

export function formatCardDate(date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(`${date}T00:00:00`));
}
