/* oxlint-disable react/only-export-components -- Framework route modules co-locate route exports. */
/* oxlint-disable react/static-components -- Content components are cached at module scope by slug. */
import { Link } from 'react-router';

import ArticlePage from '../../src/pages/article/index.jsx';
import { getArticleBySlug, getArticleSeriesNavigation, getLazyArticle } from '../content.js';
import { contentMeta, pageMeta } from '../meta.js';

export function meta({ params }) {
  const article = getArticleBySlug(params.slug);
  return article ? contentMeta(article, 'article') : pageMeta('/404');
}

export default function Article({ params }) {
  const article = getArticleBySlug(params.slug);
  const Content = getLazyArticle(params.slug);

  if (!article || !Content) return <MissingArticle />;

  const seriesNavigation = getArticleSeriesNavigation(article);

  return <ArticlePage article={article} Content={Content} seriesNavigation={seriesNavigation} />;
}

export function ErrorBoundary() {
  return (
    <div className="container page-shell empty-state">
      <span className="eyebrow">Erro</span>
      <h1>Não foi possível abrir o artigo.</h1>
      <Link className="btn btn-primary" to="/articles">
        Ver artigos
      </Link>
    </div>
  );
}

function MissingArticle() {
  return (
    <div className="container page-shell empty-state">
      <span className="eyebrow">404</span>
      <h1>Este artigo não existe.</h1>
      <Link className="btn btn-primary" to="/articles">
        Ver artigos
      </Link>
    </div>
  );
}
