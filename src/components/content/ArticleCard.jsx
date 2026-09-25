import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { formatCardDate } from '@content/registry';

export default function ArticleCard({
  article,
  featured = false,
  headingLevel = 3,
  variant = 'default',
}) {
  const Title = headingLevel === 2 ? 'h2' : 'h3';
  const className = [
    'content-card',
    'article-card',
    featured && 'is-featured',
    variant === 'compact' && 'is-compact',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Link className={className} to={`/articles/${article.slug}`}>
      <div className="card-meta">
        <span>{article.topics.join(' · ')}</span>
        <time dateTime={article.publishedAt}>{formatCardDate(article.publishedAt)}</time>
      </div>
      <div>
        <Title>{article.title}</Title>
        <p>{article.description}</p>
      </div>
      <span className="card-link">
        Ler artigo <ArrowUpRight aria-hidden="true" size={18} />
      </span>
    </Link>
  );
}
