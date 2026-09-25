import { lazy } from 'react';

import { getArticleSeriesNavigation as createArticleSeriesNavigation } from '../src/content/discovery.js';
import { createContentEntries } from '../src/content/metadata.js';

const articleMetadataModules = import.meta.glob('../content/articles/*/meta.js', { eager: true });
const articleModules = import.meta.glob('../content/articles/*/index.mdx');
const labMetadataModules = import.meta.glob('../content/labs/*/meta.js', { eager: true });
const labDemoModules = import.meta.glob('../content/labs/*/Demo.jsx');
const labBodyModules = import.meta.glob('../content/labs/*/index.mdx');
const labCodeFileModules = import.meta.glob('../content/labs/*/code-files.js');

export const articles = createContentEntries(articleMetadataModules, 'article');
export const labs = createContentEntries(labMetadataModules, 'lab');

const articlesBySlug = new Map(articles.map((article) => [article.slug, article]));
const labsBySlug = new Map(labs.map((lab) => [lab.slug, lab]));
const lazyArticles = createLazyModules(articleModules, 'index.mdx');
const lazyLabDemos = createLazyModules(labDemoModules, 'Demo.jsx');
const lazyLabBodies = createLazyModules(labBodyModules, 'index.mdx');
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

export function getArticleSeriesNavigation(article) {
  return createArticleSeriesNavigation(articles, article);
}

export function getLazyLabDemo(slug) {
  return lazyLabDemos.get(slug);
}

export function getLazyLabBody(slug) {
  return lazyLabBodies.get(slug);
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
