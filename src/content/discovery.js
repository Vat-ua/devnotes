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
