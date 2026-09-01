import { Link, useParams } from "react-router";
import { formatContentDate, getArticleBySlug } from "../../content/registry.js";

export default function Article() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);

  if (!article) return <MissingContent label="artigo" />;

  const Content = article.Component;

  return (
    <main className="reading-shell">
      <nav className="content-breadcrumb" aria-label="Navegação estrutural">
        <Link to="/articles">Artigos</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{article.category}</span>
      </nav>

      <article className="reading-article">
        <header>
          <h1>{article.title}</h1>
          <p className="content-publish-details">
            <time dateTime={article.date}>{formatContentDate(article.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}</span>
          </p>
          <p className="article-deck">{article.excerpt}</p>
        </header>
        <div className={`article-art accent-${article.accent}`} aria-hidden="true"><span /><span /><span /></div>
        <div className="article-body"><Content /></div>
      </article>
    </main>
  );
}

function MissingContent({ label }) { return <main className="page-shell empty-state"><span className="eyebrow">404</span><h1>Este {label} não existe.</h1><Link className="btn btn-primary" to="/articles">Voltar</Link></main>; }
