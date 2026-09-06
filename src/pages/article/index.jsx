import { Link, useParams } from 'react-router';
import AsyncModule from '../../components/content/AsyncModule.jsx';
import { MdxCodeBlock } from '../../components/content/CodeBlock.jsx';
import { formatContentDate, getArticleBySlug, loadArticle } from '@content/registry';
import { getContentVisualPair } from '../../utils/contentVisuals.js';

export default function Article() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);
  const articleLoader = loadArticle(slug);

  if (!article || !articleLoader) return <MissingContent label="artigo" />;

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
          <AsyncModule
            key={`article-${slug}`}
            loader={articleLoader}
            fallback={<p className="content-loading">Carregando artigo…</p>}
            errorFallback={
              <p className="content-error" role="alert">
                Não foi possível carregar este artigo. Atualize a página e tente novamente.
              </p>
            }
          >
            {(module) => {
              const Content = module.default;
              return (
                <Content components={{ pre: MdxCodeBlock }} />
              );
            }}
          </AsyncModule>
        </div>
      </article>
    </div>
  );
}

function MissingContent({ label }) {
  return (
    <div className="container page-shell empty-state">
      <span className="eyebrow">404</span>
      <h1>Este {label} não existe.</h1>
      <Link className="btn btn-primary" to="/articles">
        Voltar
      </Link>
    </div>
  );
}
