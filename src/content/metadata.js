const commonFields = ['title', 'description', 'publishedAt', 'publicationOrder', 'topics'];
const fieldsByKind = {
  article: [...commonFields, 'series', 'seriesOrder'],
  lab: [...commonFields, 'demoInstruction'],
};

export const CONTENT_FILES = {
  article: { required: ['meta.js', 'index.mdx'] },
  lab: { required: ['meta.js', 'Demo.jsx', 'index.mdx'] },
};

export function createContentEntries(metadataModules, kind) {
  assertContentKind(kind);

  const entries = Object.entries(metadataModules).map(([path, module]) => {
    const slug = getSlugFromMetadataPath(path);
    return normalizeContentMetadata({ kind, slug, meta: module.meta, source: path });
  });
  const issues = getContentCollectionIssues(entries, kind);

  if (issues.length > 0) {
    throw new Error(
      `Metadata inválido na coleção de ${kindLabel(kind)}:\n- ${issues.join('\n- ')}`,
    );
  }

  return entries.sort(compareContentPublication);
}

export function normalizeContentMetadata({ kind, slug, meta, source = slug }) {
  const issues = getContentEntryIssues({ kind, slug, meta });

  if (issues.length > 0) {
    throw new Error(`Metadata inválido em "${source}":\n- ${issues.join('\n- ')}`);
  }

  return {
    ...meta,
    title: meta.title.trim(),
    description: meta.description.trim(),
    publishedAt: meta.publishedAt.trim(),
    topics: meta.topics.map((topic) => topic.trim()),
    ...(kind === 'article' && meta.series !== undefined ? { series: meta.series.trim() } : {}),
    ...(kind === 'lab' ? { demoInstruction: meta.demoInstruction.trim() } : {}),
    kind,
    slug,
  };
}

export function getContentEntryIssues({ kind, slug, meta }) {
  const issues = getContentMetadataIssues({ kind, meta });

  if (!isContentSlug(slug)) {
    issues.push('o nome da pasta deve ser um slug válido em kebab-case');
  }

  return issues;
}

export function getContentMetadataIssues({ kind, meta }) {
  assertContentKind(kind);

  if (!isPlainObject(meta)) {
    return ['meta.js deve exportar um objeto chamado meta'];
  }

  const issues = [];
  const allowedFields = new Set(fieldsByKind[kind]);

  for (const field of Object.keys(meta)) {
    if (!allowedFields.has(field)) issues.push(`metadata desconhecido: meta.${field}`);
  }

  for (const field of ['title', 'description', 'publishedAt']) {
    if (!isNonEmptyString(meta[field])) {
      issues.push(`metadata obrigatório inválido ou ausente: meta.${field}`);
    }
  }

  if (
    !Array.isArray(meta.topics) ||
    meta.topics.length === 0 ||
    meta.topics.some((topic) => !isNonEmptyString(topic))
  ) {
    issues.push('metadata obrigatório inválido ou ausente: meta.topics');
  }

  if (kind === 'lab' && !isNonEmptyString(meta.demoInstruction)) {
    issues.push('metadata obrigatório inválido ou ausente: meta.demoInstruction');
  }

  if (isNonEmptyString(meta.publishedAt) && !isIsoDate(meta.publishedAt)) {
    issues.push('meta.publishedAt deve ser uma data válida no formato YYYY-MM-DD');
  }

  if (
    meta.publicationOrder !== undefined &&
    (!Number.isInteger(meta.publicationOrder) || meta.publicationOrder < 1)
  ) {
    issues.push('meta.publicationOrder deve ser um número inteiro positivo');
  }

  if (kind === 'article') {
    const hasSeries = meta.series !== undefined;
    const hasSeriesOrder = meta.seriesOrder !== undefined;

    if (hasSeries !== hasSeriesOrder) {
      issues.push('meta.series e meta.seriesOrder devem ser informados juntos');
    }

    if (hasSeries && !isNonEmptyString(meta.series)) {
      issues.push('meta.series deve ser um texto não vazio');
    }

    if (hasSeriesOrder && (!Number.isInteger(meta.seriesOrder) || meta.seriesOrder < 1)) {
      issues.push('meta.seriesOrder deve ser um número inteiro positivo');
    }
  }

  return issues;
}

export function getContentCollectionIssues(entries, kind) {
  assertContentKind(kind);

  const issues = [];
  const entriesByDate = groupBy(entries, (entry) => entry.publishedAt);

  for (const [publishedAt, dateEntries] of entriesByDate) {
    const hasSameDate = dateEntries.length > 1;
    const hasPublicationOrder = dateEntries.some((entry) => entry.publicationOrder !== undefined);

    if (!hasSameDate && !hasPublicationOrder) continue;

    const entriesWithoutOrder = dateEntries.filter((entry) => entry.publicationOrder === undefined);

    if (entriesWithoutOrder.length > 0) {
      issues.push(
        `meta.publicationOrder é obrigatório para todos os conteúdos publicados em ${publishedAt}: ${formatSlugs(entriesWithoutOrder)}`,
      );
      continue;
    }

    const entriesByOrder = groupBy(dateEntries, (entry) => entry.publicationOrder);

    for (const [publicationOrder, orderEntries] of entriesByOrder) {
      if (orderEntries.length > 1) {
        issues.push(
          `meta.publicationOrder ${publicationOrder} está duplicado em ${publishedAt}: ${formatSlugs(orderEntries)}`,
        );
      }
    }

    const actualOrders = [...entriesByOrder.keys()].toSorted((first, second) => first - second);
    const expectedOrders = Array.from({ length: dateEntries.length }, (_, index) => index + 1);

    if (
      actualOrders.length !== expectedOrders.length ||
      actualOrders.some((order, index) => order !== expectedOrders[index])
    ) {
      issues.push(
        `meta.publicationOrder deve formar uma sequência contínua de 1 a ${dateEntries.length} em ${publishedAt}`,
      );
    }
  }

  if (kind === 'article') {
    const entriesBySeries = groupBy(
      entries.filter((entry) => entry.series !== undefined),
      (entry) => entry.series,
    );

    for (const [series, seriesEntries] of entriesBySeries) {
      const entriesByOrder = groupBy(seriesEntries, (entry) => entry.seriesOrder);

      for (const [seriesOrder, orderEntries] of entriesByOrder) {
        if (orderEntries.length > 1) {
          issues.push(
            `meta.seriesOrder ${seriesOrder} está duplicado na série "${series}": ${formatSlugs(orderEntries)}`,
          );
        }
      }

      const actualOrders = [...entriesByOrder.keys()].toSorted((first, second) => first - second);
      const expectedOrders = Array.from({ length: seriesEntries.length }, (_, index) => index + 1);

      if (
        actualOrders.length !== expectedOrders.length ||
        actualOrders.some((order, index) => order !== expectedOrders[index])
      ) {
        issues.push(
          `meta.seriesOrder deve formar uma sequência contínua de 1 a ${seriesEntries.length} na série "${series}"`,
        );
      }
    }
  }

  return issues;
}

export function compareContentPublication(first, second) {
  return (
    second.publishedAt.localeCompare(first.publishedAt) ||
    (second.publicationOrder ?? 0) - (first.publicationOrder ?? 0) ||
    first.slug.localeCompare(second.slug, 'pt-BR')
  );
}

export function getSlugFromMetadataPath(path) {
  const match = path.match(/\/([^/]+)\/meta\.js$/);
  if (!match) throw new Error(`Não foi possível obter o slug a partir de "${path}".`);
  return match[1];
}

export function isContentSlug(value) {
  return typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function assertContentKind(kind) {
  if (!fieldsByKind[kind]) throw new Error(`Tipo de conteúdo desconhecido: "${kind}".`);
}

function kindLabel(kind) {
  return kind === 'article' ? 'artigos' : 'Labs';
}

function formatSlugs(entries) {
  return entries.map((entry) => entry.slug).join(', ');
}

function groupBy(values, getKey) {
  const groups = new Map();

  for (const value of values) {
    const key = getKey(value);
    const group = groups.get(key) ?? [];
    group.push(value);
    groups.set(key, group);
  }

  return groups;
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function isIsoDate(value) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;

  const [, year, month, day] = match;
  const date = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(date.valueOf()) &&
    date.getUTCFullYear() === Number(year) &&
    date.getUTCMonth() + 1 === Number(month) &&
    date.getUTCDate() === Number(day)
  );
}
