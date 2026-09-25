import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createContentEntries,
  getContentCollectionIssues,
  getContentEntryIssues,
  normalizeContentMetadata,
} from '../src/content/metadata.js';

const articleMeta = {
  title: ' Um artigo ',
  description: ' Uma descrição. ',
  publishedAt: '2026-09-08',
  topics: [' React ', 'Interfaces'],
};

test('normaliza campos comuns e deriva kind e slug', () => {
  assert.deepEqual(
    normalizeContentMetadata({ kind: 'article', slug: 'um-artigo', meta: articleMeta }),
    {
      title: 'Um artigo',
      description: 'Uma descrição.',
      publishedAt: '2026-09-08',
      topics: ['React', 'Interfaces'],
      kind: 'article',
      slug: 'um-artigo',
    },
  );
});

test('aplica regras específicas sem misturar os tipos de conteúdo', () => {
  assert.deepEqual(getContentEntryIssues({ kind: 'lab', slug: 'um-lab', meta: articleMeta }), [
    'metadata obrigatório inválido ou ausente: meta.demoInstruction',
  ]);
  assert.deepEqual(
    getContentEntryIssues({
      kind: 'article',
      slug: 'um-artigo',
      meta: { ...articleMeta, demoInstruction: 'Teste a demonstração.' },
    }),
    ['metadata desconhecido: meta.demoInstruction'],
  );
});

test('rejeita metadata e slugs que causariam registros inconsistentes', () => {
  const issues = getContentEntryIssues({
    kind: 'article',
    slug: 'Slug Inválido',
    meta: { ...articleMeta, publishedAt: '2026-02-30', topics: [] },
  });

  assert.deepEqual(issues, [
    'metadata obrigatório inválido ou ausente: meta.topics',
    'meta.publishedAt deve ser uma data válida no formato YYYY-MM-DD',
    'o nome da pasta deve ser um slug válido em kebab-case',
  ]);
});

test('rejeita publicationOrder que não seja um inteiro positivo', () => {
  assert.deepEqual(
    getContentEntryIssues({
      kind: 'article',
      slug: 'um-artigo',
      meta: { ...articleMeta, publicationOrder: 0 },
    }),
    ['meta.publicationOrder deve ser um número inteiro positivo'],
  );
});

test('ordena registros por data e pela ordem de publicação dentro do dia', () => {
  const entries = createContentEntries(
    {
      '/content/articles/primeiro-do-dia/meta.js': {
        meta: { ...articleMeta, publicationOrder: 1 },
      },
      '/content/articles/segundo-do-dia/meta.js': {
        meta: { ...articleMeta, publicationOrder: 2 },
      },
      '/content/articles/mais-recente/meta.js': {
        meta: { ...articleMeta, publishedAt: '2026-09-09' },
      },
    },
    'article',
  );

  assert.deepEqual(
    entries.map(({ slug }) => slug),
    ['mais-recente', 'segundo-do-dia', 'primeiro-do-dia'],
  );
});

test('exige publicationOrder em todos os conteúdos que compartilham uma data', () => {
  const issues = getContentCollectionIssues(
    [
      { slug: 'primeiro', publishedAt: '2026-09-08', publicationOrder: 1 },
      { slug: 'segundo', publishedAt: '2026-09-08' },
    ],
    'article',
  );

  assert.deepEqual(issues, [
    'meta.publicationOrder é obrigatório para todos os conteúdos publicados em 2026-09-08: segundo',
  ]);
});

test('rejeita publicationOrder duplicado ou com lacunas na mesma data', () => {
  const issues = getContentCollectionIssues(
    [
      { slug: 'primeiro', publishedAt: '2026-09-08', publicationOrder: 1 },
      { slug: 'segundo', publishedAt: '2026-09-08', publicationOrder: 1 },
    ],
    'article',
  );

  assert.deepEqual(issues, [
    'meta.publicationOrder 1 está duplicado em 2026-09-08: primeiro, segundo',
    'meta.publicationOrder deve formar uma sequência contínua de 1 a 2 em 2026-09-08',
  ]);
});
