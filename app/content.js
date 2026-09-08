import { lazy } from 'react';

import { createContentEntries } from '../src/content/metadata.js';

const articleMetadataModules = import.meta.glob('../content/articles/*/meta.js', { eager: true });
const articleModules = import.meta.glob('../content/articles/*/index.mdx');
const labMetadataModules = import.meta.glob('../content/labs/*/meta.js', { eager: true });
const labModules = import.meta.glob('../content/labs/*/Lab.jsx');
const labGuideModules = import.meta.glob('../content/labs/*/guide.mdx');
const labCodeFileModules = import.meta.glob('../content/labs/*/code-files.js');

export const articles = createContentEntries(articleMetadataModules);
export const labs = createContentEntries(labMetadataModules);

const articlesBySlug = new Map(articles.map((article) => [article.slug, article]));
const labsBySlug = new Map(labs.map((lab) => [lab.slug, lab]));
const lazyArticles = createLazyModules(articleModules, 'index.mdx');
const lazyLabs = createLazyModules(labModules, 'Lab.jsx');
const lazyGuides = createLazyModules(labGuideModules, 'guide.mdx');
const labCodeFileLoaders = createModuleLoaders(labCodeFileModules, 'code-files.js');

export function getArticleBySlug(slug) {
  return articlesBySlug.get(slug);
}

export function getLabBySlug(slug) {
  return labsBySlug.get(slug);
}

export function getLazyArticle(slug) {
  return lazyArticles.get(slug);
}

export function getLazyLab(slug) {
  return lazyLabs.get(slug);
}

export function getLazyLabGuide(slug) {
  return lazyGuides.get(slug);
}

export function loadLabCodeFiles(slug) {
  return labCodeFileLoaders.get(slug)?.();
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

function createLazyModules(modules, filename) {
  return new Map(
    [...createModuleLoaders(modules, filename)].map(([slug, load]) => [slug, lazy(load)]),
  );
}

function createModuleLoaders(modules, filename) {
  const suffix = `/${filename}`;

  return new Map(
    Object.entries(modules).map(([modulePath, load]) => {
      const slug = modulePath.slice(0, -suffix.length).split('/').at(-1);
      return [slug, load];
    }),
  );
}
