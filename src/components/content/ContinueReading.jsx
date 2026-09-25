import ArticleCard from './ArticleCard.jsx';

export default function ContinueReading({ articles }) {
  if (articles.length === 0) return null;

  return (
    <section className="content-recommendations" aria-labelledby="continue-reading-title">
      <header className="content-recommendations-header">
        <span className="eyebrow">Próximas leituras</span>
        <h2 id="continue-reading-title">Continue lendo</h2>
      </header>
      <ul className="content-recommendations-grid">
        {articles.map((article) => (
          <li key={article.slug}>
            <ArticleCard article={article} variant="compact" headingLevel={3} />
          </li>
        ))}
      </ul>
    </section>
  );
}
