const articleModules = import.meta.glob("../../content/articles/*/index.mdx", { eager: true });
const labMetadataModules = import.meta.glob("../../content/labs/*/meta.js", { eager: true });
const labModules = import.meta.glob("../../content/labs/*/Lab.jsx");
const labGuideModules = import.meta.glob("../../content/labs/*/guide.mdx");

function byDate(first, second) {
  return new Date(second.date) - new Date(first.date);
}

export const articles = Object.values(articleModules)
  .map(({ default: Component, meta }) => ({ ...meta, Component }))
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
  return Object.entries(modules).find(([path]) => path.endsWith(`/${slug}/${filename}`))?.[1];
}

export function loadLab(slug) {
  return findModule(labModules, slug, "Lab.jsx");
}

export function loadLabGuide(slug) {
  return findModule(labGuideModules, slug, "guide.mdx");
}

export function formatContentDate(date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}
