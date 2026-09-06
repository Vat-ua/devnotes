export function createContentEntries(metadataModules) {
  return Object.entries(metadataModules)
    .map(([path, { meta }]) => ({ ...meta, slug: getSlugFromMetadataPath(path) }))
    .sort(byPublishedAt);
}

export function getSlugFromMetadataPath(path) {
  const match = path.match(/\/([^/]+)\/meta\.js$/);
  if (!match) throw new Error(`Não foi possível obter o slug a partir de "${path}".`);
  return match[1];
}

function byPublishedAt(first, second) {
  return (
    second.publishedAt.localeCompare(first.publishedAt) ||
    first.slug.localeCompare(second.slug, 'pt-BR')
  );
}
