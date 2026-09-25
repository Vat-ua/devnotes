import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export default function ArticleSeriesNavigation({ navigation }) {
  const { name, position, total, previous, next } = navigation;

  return (
    <nav className="article-series" aria-labelledby="article-series-title">
      <header className="article-series-header">
        <span className="eyebrow">Série</span>
        <h2 id="article-series-title">{name}</h2>
        <p>
          Artigo {position} de {total}
        </p>
      </header>
      <div className="article-series-links">
        {previous && (
          <Link className="article-series-link" to={`/articles/${previous.slug}`}>
            <span>
              <ArrowLeft aria-hidden="true" size={17} /> Artigo anterior
            </span>
            <strong>{previous.title}</strong>
          </Link>
        )}
        {next && (
          <Link
            className="article-series-link article-series-link-next"
            to={`/articles/${next.slug}`}
          >
            <span>
              Próximo artigo <ArrowRight aria-hidden="true" size={17} />
            </span>
            <strong>{next.title}</strong>
          </Link>
        )}
      </div>
    </nav>
  );
}
