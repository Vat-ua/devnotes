const commonFields = ['title', 'description', 'publishedAt', 'topics'];
const fieldsByKind = {
  article: commonFields,
  lab: [...commonFields, 'demoInstruction'],
};

export const CONTENT_FILES = {
  article: { required: ['meta.js', 'index.mdx'] },
  lab: { required: ['meta.js', 'Demo.jsx', 'index.mdx'] },
};

export function createContentEntries(metadataModules, kind) {
  assertContentKind(kind);

  return Object.entries(metadataModules)
    .map(([path, module]) => {
      const slug = getSlugFromMetadataPath(path);
      return normalizeContentMetadata({ kind, slug, meta: module.meta, source: path });
    })
    .sort(byPublishedAt);
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

  return issues;
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

function byPublishedAt(first, second) {
  return (
    second.publishedAt.localeCompare(first.publishedAt) ||
    first.slug.localeCompare(second.slug, 'pt-BR')
  );
}
