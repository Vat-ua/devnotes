import assert from 'node:assert/strict';
import test from 'node:test';

import { getArticleSeriesNavigation } from '../src/content/discovery.js';

const articles = [
  {
    slug: 'terceiro',
    title: 'Terceiro artigo',
    series: 'Uma série',
    seriesOrder: 3,
  },
  {
    slug: 'fora-da-serie',
    title: 'Fora da série',
  },
  {
    slug: 'primeiro',
    title: 'Primeiro artigo',
    series: 'Uma série',
    seriesOrder: 1,
  },
  {
    slug: 'segundo',
    title: 'Segundo artigo',
    series: 'Uma série',
    seriesOrder: 2,
  },
];

test('encontra os artigos anterior e próximo pela ordem da série', () => {
  const navigation = getArticleSeriesNavigation(articles, articles.at(-1));

  assert.deepEqual(navigation, {
    name: 'Uma série',
    position: 2,
    total: 3,
    previous: articles[2],
    next: articles[0],
  });
});

test('trata as extremidades e artigos sem série', () => {
  assert.equal(getArticleSeriesNavigation(articles, articles[1]), undefined);
  assert.equal(getArticleSeriesNavigation(articles, articles[2]).previous, undefined);
  assert.equal(getArticleSeriesNavigation(articles, articles[0]).next, undefined);
});
