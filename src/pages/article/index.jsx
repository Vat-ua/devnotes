import { Link, useParams } from "react-router";
import { articles } from "../../content/content.js";

export default function Article() {
  const { slug } = useParams();
  const article = articles.find((item) => item.slug === slug);
  if (!article) return <MissingContent label="article" />;
  return <main className="reading-shell"><Link className="back-link" to="/articles">← Voltar para articles</Link><article className="reading-article"><header><div className="article-meta"><span>{article.category}</span><span>{article.date}</span><span>{article.readTime}</span></div><h1>{article.title}</h1><p className="article-deck">{article.excerpt}</p></header><div className={`article-art accent-${article.accent}`} aria-hidden="true"><span /><span /><span /></div><div className="article-body">{article.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<aside className="note-callout"><span>Nota de campo</span><p>Clareza não é simplificar o problema. É revelar o próximo passo sem esconder as escolhas importantes.</p></aside></div></article></main>;
}

function MissingContent({ label }) { return <main className="page-shell empty-state"><span className="eyebrow">404</span><h1>Este {label} não existe.</h1><Link className="btn btn-primary" to={`/${label}s`}>Voltar</Link></main>; }
