import { compareContentPublication } from './metadata.js';

export function getArticleSeriesNavigation(articles, currentArticle) {
  if (!currentArticle.series) return undefined;

  const seriesArticles = articles
    .filter((article) => article.series === currentArticle.series)
    .toSorted((first, second) => first.seriesOrder - second.seriesOrder);
  const currentIndex = seriesArticles.findIndex((article) => article.slug === currentArticle.slug);

  if (currentIndex === -1) return undefined;

  return {
    name: currentArticle.series,
    position: currentIndex + 1,
    total: seriesArticles.length,
    previous: seriesArticles[currentIndex - 1],
    next: seriesArticles[currentIndex + 1],
  };
}

export function getContentRecommendations(
  entries,
  currentEntry,
  { limit = 3, excludeSlugs = [] } = {},
) {
  const currentTopics = new Set(currentEntry.topics);
  const excludedSlugs = new Set([currentEntry.slug, ...excludeSlugs]);

  return entries
    .filter((entry) => !excludedSlugs.has(entry.slug))
    .map((entry) => ({
      entry,
      sharedTopicCount: countSharedTopics(entry.topics, currentTopics),
    }))
    .toSorted(
      (first, second) =>
        second.sharedTopicCount - first.sharedTopicCount ||
        compareContentPublication(first.entry, second.entry),
    )
    .slice(0, limit)
    .map(({ entry }) => entry);
}

export function getTopicOptions(entries, { minCount = 1 } = {}) {
  const topicCounts = new Map();

  for (const entry of entries) {
    for (const topic of new Set(entry.topics)) {
      topicCounts.set(topic, (topicCounts.get(topic) ?? 0) + 1);
    }
  }

  return [...topicCounts]
    .map(([topic, count]) => ({ topic, count }))
    .filter(({ count }) => count >= minCount)
    .toSorted(
      (first, second) =>
        second.count - first.count || first.topic.localeCompare(second.topic, 'pt-BR'),
    );
}

export function filterContentByTopic(entries, topic) {
  if (!topic) return entries;
  return entries.filter((entry) => entry.topics.includes(topic));
}

function countSharedTopics(topics, currentTopics) {
  let count = 0;

  for (const topic of new Set(topics)) {
    if (currentTopics.has(topic)) count += 1;
  }

  return count;
}
