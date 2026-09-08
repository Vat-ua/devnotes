import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createContentEntries,
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

test('ordena registros normalizados por data e slug', () => {
  const entries = createContentEntries(
    {
      '/content/articles/segundo/meta.js': { meta: articleMeta },
      '/content/articles/primeiro/meta.js': {
        meta: { ...articleMeta, publishedAt: '2026-09-09' },
      },
    },
    'article',
  );

  assert.deepEqual(
    entries.map(({ slug }) => slug),
    ['primeiro', 'segundo'],
  );
});
