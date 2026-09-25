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

export function getContinueReadingArticles(
  articles,
  currentArticle,
  { limit = 3, excludeSlugs = [] } = {},
) {
  const currentTopics = new Set(currentArticle.topics);
  const excludedSlugs = new Set([currentArticle.slug, ...excludeSlugs]);

  return articles
    .filter((article) => !excludedSlugs.has(article.slug))
    .map((article) => ({
      article,
      sharedTopicCount: countSharedTopics(article.topics, currentTopics),
    }))
    .toSorted(
      (first, second) =>
        second.sharedTopicCount - first.sharedTopicCount ||
        compareContentPublication(first.article, second.article),
    )
    .slice(0, limit)
    .map(({ article }) => article);
}

function countSharedTopics(topics, currentTopics) {
  let count = 0;

  for (const topic of new Set(topics)) {
    if (currentTopics.has(topic)) count += 1;
  }

  return count;
}
