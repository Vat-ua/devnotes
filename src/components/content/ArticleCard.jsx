import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { formatCardDate } from '@content/registry';

export default function ArticleCard({ article, featured = false, headingLevel = 3 }) {
  const Title = headingLevel === 2 ? 'h2' : 'h3';

  return (
    <Link
      className={`content-card article-card accent-${article.accent} ${featured ? 'is-featured' : ''}`}
      to={`/articles/${article.slug}`}
    >
      <div className="card-meta">
        <span>{article.category}</span>
        <time dateTime={article.date}>{formatCardDate(article.date)}</time>
      </div>
      <div>
        <Title>{article.title}</Title>
        <p>{article.excerpt}</p>
      </div>
      <span className="card-link">
        Ler artigo <ArrowUpRight aria-hidden="true" size={18} />
      </span>
    </Link>
  );
}
