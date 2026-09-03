const articleMetadataModules = import.meta.glob('../../content/articles/*/meta.js', {
  eager: true,
});
const articleModules = import.meta.glob('../../content/articles/*/index.mdx', { eager: true });
const labMetadataModules = import.meta.glob('../../content/labs/*/meta.js', { eager: true });
const labModules = import.meta.glob('../../content/labs/*/Lab.jsx', { eager: true });
const labGuideModules = import.meta.glob('../../content/labs/*/guide.mdx', { eager: true });

export const articles = Object.values(articleMetadataModules)
  .map(({ meta }) => meta)
  .sort(byDate);
export const labs = Object.values(labMetadataModules)
  .map(({ meta }) => meta)
  .sort(byDate);
export const getArticleBySlug = (slug) => articles.find((article) => article.slug === slug);
export const getLabBySlug = (slug) => labs.find((lab) => lab.slug === slug);
export const loadArticle = (slug) => findModule(articleModules, slug, 'index.mdx');
export const loadLab = (slug) => findModule(labModules, slug, 'Lab.jsx');
export const loadLabGuide = (slug) => findModule(labGuideModules, slug, 'guide.mdx');

function byDate(first, second) {
  return (
    new Date(second.date) - new Date(first.date) || first.slug.localeCompare(second.slug, 'pt-BR')
  );
}
function findModule(modules, slug, filename) {
  const module = Object.entries(modules).find(([path]) =>
    path.endsWith(`/${slug}/${filename}`),
  )?.[1];
  return module ? () => module : undefined;
}

export function formatContentDate(date) {
  const { day, month, year } = getDateParts(date);
  return `${day} de ${month} de ${year}`;
}

export function formatCardDate(date) {
  const { day, month } = getDateParts(date);
  return `${day} de ${month}`;
}

function getDateParts(date) {
  const [year, monthNumber, day] = date.split('-');
  const month = [
    'jan.',
    'fev.',
    'mar.',
    'abr.',
    'mai.',
    'jun.',
    'jul.',
    'ago.',
    'set.',
    'out.',
    'nov.',
    'dez.',
  ][Number(monthNumber) - 1];

  return { day, month, year };
}
