import { Suspense } from 'react';
import { Link } from 'react-router';

import { MdxCodeBlock } from '../../components/content/CodeBlock.jsx';
import { formatContentDate } from '@content/registry';
import { getContentVisualPair } from '../../utils/contentVisuals.js';

export default function Article({ article, Content }) {
  const [primaryColor, secondaryColor] = getContentVisualPair(article.slug);

  return (
    <div className="container page-shell">
      <nav className="content-breadcrumb" aria-label="Navegação estrutural">
        <Link to="/articles">Artigos</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{article.category}</span>
      </nav>

      <article>
        <header className="content-heading">
          <h1 className="content-title">{article.title}</h1>
          <p className="content-publish-details">
            <time dateTime={article.publishedAt}>{formatContentDate(article.publishedAt)}</time>
          </p>
          <p className="content-deck">{article.description}</p>
        </header>
        <div
          className="article-art"
          style={{
            '--article-art-primary': `var(--${primaryColor})`,
            '--article-art-secondary': `var(--${secondaryColor})`,
          }}
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </div>
        <div className="prose">
          <Suspense fallback={<p className="content-loading">Carregando artigo…</p>}>
            <Content components={{ pre: MdxCodeBlock }} />
          </Suspense>
        </div>
      </article>
    </div>
  );
}
