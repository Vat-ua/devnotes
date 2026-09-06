import { access, readdir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const contentDir = getContentDirectory(process.argv.slice(2));
const projectDir = resolve(contentDir, '..');
const issues = [];

await validateContentType({
  type: 'articles',
  requiredFiles: ['meta.js', 'index.mdx'],
  requiredStrings: ['title', 'description', 'category', 'publishedAt'],
  optionalStrings: ['ogImage'],
});
await validateContentType({
  type: 'labs',
  requiredFiles: ['meta.js', 'Lab.jsx', 'guide.mdx'],
  requiredStrings: ['title', 'description', 'demoInstruction', 'publishedAt'],
  optionalStrings: ['ogImage'],
  requiredStringArrays: ['topics'],
});

if (issues.length > 0) {
  console.error('Validação de conteúdo falhou:\n');
  issues.forEach((issue) => console.error(`- ${issue}`));
  process.exitCode = 1;
} else {
  console.log('Validação de conteúdo concluída sem erros.');
}

async function validateContentType({
  type,
  requiredFiles,
  requiredStrings,
  optionalStrings,
  requiredStringArrays = [],
}) {
  const typeDir = join(contentDir, type);
  const entries = await getDirectories(typeDir, type);

  for (const entry of entries) {
    const entryDir = join(typeDir, entry.name);
    const metaPath = join(entryDir, 'meta.js');
    const missingFiles = await findMissingFiles(entryDir, requiredFiles);

    missingFiles.forEach((filename) => {
      addIssue(type, entryDir, `arquivo obrigatório ausente: ${filename}`);
    });

    if (missingFiles.includes('meta.js')) continue;

    const meta = await loadMetadata(metaPath, type, entryDir);
    if (!meta) continue;

    validateMetadata({
      type,
      entryDir,
      meta,
      requiredStrings,
      optionalStrings,
      requiredStringArrays,
    });

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.name)) {
      addIssue(type, entryDir, 'o nome da pasta deve ser um slug válido em kebab-case');
    }
  }
}

function validateMetadata({
  type,
  entryDir,
  meta,
  requiredStrings,
  optionalStrings,
  requiredStringArrays,
}) {
  const allowedFields = new Set([...requiredStrings, ...optionalStrings, ...requiredStringArrays]);

  for (const field of Object.keys(meta)) {
    if (!allowedFields.has(field)) {
      addIssue(type, entryDir, `metadata desconhecido: meta.${field}`);
    }
  }

  for (const field of requiredStrings) {
    if (!isNonEmptyString(meta[field])) {
      addIssue(type, entryDir, `metadata obrigatório inválido ou ausente: meta.${field}`);
    }
  }

  for (const field of optionalStrings) {
    if (meta[field] !== undefined && !isNonEmptyString(meta[field])) {
      addIssue(type, entryDir, `metadata opcional inválido: meta.${field}`);
    }
  }

  for (const field of requiredStringArrays) {
    if (
      !Array.isArray(meta[field]) ||
      meta[field].length === 0 ||
      meta[field].some((value) => !isNonEmptyString(value))
    ) {
      addIssue(type, entryDir, `metadata obrigatório inválido ou ausente: meta.${field}`);
    }
  }

  if (isNonEmptyString(meta.publishedAt) && !isIsoDate(meta.publishedAt)) {
    addIssue(type, entryDir, 'meta.publishedAt deve ser uma data válida no formato YYYY-MM-DD');
  }
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

async function getDirectories(typeDir, type) {
  try {
    const entries = await readdir(typeDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .sort((first, second) => first.name.localeCompare(second.name));
  } catch (error) {
    if (error.code === 'ENOENT') {
      addIssue(type, typeDir, 'diretório de conteúdo ausente');
      return [];
    }
    throw error;
  }
}

async function findMissingFiles(entryDir, filenames) {
  const checks = await Promise.all(
    filenames.map(async (filename) => ({
      filename,
      exists: await exists(join(entryDir, filename)),
    })),
  );
  return checks.filter(({ exists: fileExists }) => !fileExists).map(({ filename }) => filename);
}

async function loadMetadata(metaPath, type, entryDir) {
  try {
    const module = await import(`${pathToFileURL(metaPath).href}?content-validation`);
    if (!module.meta || typeof module.meta !== 'object' || Array.isArray(module.meta)) {
      addIssue(type, entryDir, 'meta.js deve exportar um objeto chamado meta');
      return null;
    }
    return module.meta;
  } catch (error) {
    addIssue(type, entryDir, `não foi possível carregar meta.js: ${error.message}`);
    return null;
  }
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

function addIssue(type, path, reason) {
  issues.push(`[${type}] ${displayPath(path)}: ${reason}`);
}

function displayPath(path) {
  return relative(projectDir, path) || '.';
}

function getContentDirectory(args) {
  if (args.length === 0) return resolve('content');
  if (args.length === 2 && args[0] === '--content-dir') return resolve(args[1]);

  console.error('Uso: node scripts/validate-content.mjs [--content-dir <caminho>]');
  process.exit(1);
}
