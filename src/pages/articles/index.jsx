import ArticleCard from '../../components/content/ArticleCard.jsx';
import { articles } from '@content/registry';

export default function Articles() {
  return (
    <div className="page-shell">
      <header className="page-intro">
        <h1>
          Notas para pensar,
          <br />
          <em>fazer e seguir.</em>
        </h1>
        <p>
          Leituras curtas sobre interfaces, full stack e as decisões que deixam um produto mais
          claro.
        </p>
      </header>
      <ul className="content-grid archive-grid">
        {articles.map((article, index) => (
          <li key={article.slug}>
            <ArticleCard article={article} featured={index === 0} headingLevel={2} />
          </li>
        ))}
      </ul>
    </div>
  );
}
