import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";

export default function ArticleCard({ article, featured = false }) {
  return (
    <Link className={`content-card article-card accent-${article.accent} ${featured ? "is-featured" : ""}`} to={`/articles/${article.slug}`}>
      <div className="card-meta"><span>{article.category}</span><span>{article.readTime}</span></div>
      <div>
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
      </div>
      <span className="card-link">Ler article <ArrowUpRight aria-hidden="true" size={18} /></span>
    </Link>
  );
}
