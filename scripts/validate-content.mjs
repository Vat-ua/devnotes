import { access, readdir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { CONTENT_FILES, getContentEntryIssues } from '../src/content/metadata.js';

const contentDir = getContentDirectory(process.argv.slice(2));
const projectDir = resolve(contentDir, '..');
const issues = [];

await validateContentType({
  type: 'articles',
  kind: 'article',
});
await validateContentType({
  type: 'labs',
  kind: 'lab',
});

if (issues.length > 0) {
  console.error('Validação de conteúdo falhou:\n');
  issues.forEach((issue) => console.error(`- ${issue}`));
  process.exitCode = 1;
} else {
  console.log('Validação de conteúdo concluída sem erros.');
}

async function validateContentType({ type, kind }) {
  const typeDir = join(contentDir, type);
  const entries = await getDirectories(typeDir, type);
  const requiredFiles = CONTENT_FILES[kind].required;

  for (const entry of entries) {
    const entryDir = join(typeDir, entry.name);
    const metaPath = join(entryDir, 'meta.js');
    const missingFiles = await findMissingFiles(entryDir, requiredFiles);

    missingFiles.forEach((filename) => {
      addIssue(type, entryDir, `arquivo obrigatório ausente: ${filename}`);
    });

    if (missingFiles.includes('meta.js')) continue;

    const metadataModule = await loadMetadata(metaPath, type, entryDir);
    if (!metadataModule) continue;

    getContentEntryIssues({ kind, slug: entry.name, meta: metadataModule.meta }).forEach((issue) =>
      addIssue(type, entryDir, issue),
    );
  }
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
    return module;
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
