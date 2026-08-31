import { Link } from "react-router";

export default function ArticleCard({ article, featured = false }) {
  return (
    <article className={`content-card article-card accent-${article.accent} ${featured ? "is-featured" : ""}`}>
      <div className="card-meta"><span>{article.category}</span><span>{article.readTime}</span></div>
      <div>
        <h3><Link to={`/articles/${article.slug}`}>{article.title}</Link></h3>
        <p>{article.excerpt}</p>
      </div>
      <Link className="card-link" to={`/articles/${article.slug}`}>Ler nota <span aria-hidden="true">↗</span></Link>
    </article>
  );
}
