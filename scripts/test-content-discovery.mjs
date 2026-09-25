import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getContentRecommendations,
  filterContentByTopic,
  getArticleSeriesNavigation,
  getTopicOptions,
} from '../src/content/discovery.js';

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

test('prioriza topics compartilhados e usa a publicação como desempate', () => {
  const currentArticle = {
    slug: 'atual',
    publishedAt: '2026-09-10',
    topics: ['React', 'APIs'],
  };
  const candidates = [
    {
      slug: 'recente-sem-topic',
      publishedAt: '2026-09-12',
      topics: ['Node.js'],
    },
    {
      slug: 'dois-topics',
      publishedAt: '2026-09-01',
      topics: ['React', 'APIs'],
    },
    {
      slug: 'um-topic-antigo',
      publishedAt: '2026-09-02',
      topics: ['React'],
    },
    {
      slug: 'um-topic-recente',
      publishedAt: '2026-09-08',
      topics: ['APIs'],
    },
  ];

  assert.deepEqual(
    getContentRecommendations([currentArticle, ...candidates], currentArticle).map(
      ({ slug }) => slug,
    ),
    ['dois-topics', 'um-topic-recente', 'um-topic-antigo'],
  );
});

test('completa com artigos recentes e respeita limite e exclusões', () => {
  const currentArticle = {
    slug: 'atual',
    publishedAt: '2026-09-10',
    topics: ['React'],
  };
  const candidates = [
    {
      slug: 'excluido',
      publishedAt: '2026-09-12',
      topics: ['React'],
    },
    {
      slug: 'mais-recente',
      publishedAt: '2026-09-09',
      topics: ['Node.js'],
    },
    {
      slug: 'mais-antigo',
      publishedAt: '2026-09-08',
      topics: ['CSS'],
    },
  ];
  const originalOrder = candidates.map(({ slug }) => slug);
  const recommendations = getContentRecommendations(
    [...candidates, currentArticle],
    currentArticle,
    { limit: 2, excludeSlugs: ['excluido'] },
  );

  assert.deepEqual(
    recommendations.map(({ slug }) => slug),
    ['mais-recente', 'mais-antigo'],
  );
  assert.deepEqual(
    candidates.map(({ slug }) => slug),
    originalOrder,
  );
});

test('contabiliza topics por conteúdo e retorna somente opções recorrentes', () => {
  const entries = [
    { slug: 'primeiro', topics: ['React', 'APIs', 'React'] },
    { slug: 'segundo', topics: ['React', 'Node.js'] },
    { slug: 'terceiro', topics: ['APIs', 'Node.js'] },
    { slug: 'quarto', topics: ['React Router'] },
    { slug: 'quinto', topics: ['React'] },
  ];

  assert.deepEqual(getTopicOptions(entries, { minCount: 2 }), [
    { topic: 'React', count: 3 },
    { topic: 'APIs', count: 2 },
    { topic: 'Node.js', count: 2 },
  ]);
});

test('filtra conteúdo por topic exato e preserva a coleção completa sem filtro', () => {
  const entries = [
    { slug: 'react', topics: ['React'] },
    { slug: 'apis', topics: ['APIs'] },
  ];

  assert.deepEqual(filterContentByTopic(entries, 'React'), [entries[0]]);
  assert.deepEqual(filterContentByTopic(entries, 'react'), []);
  assert.equal(filterContentByTopic(entries), entries);
});
