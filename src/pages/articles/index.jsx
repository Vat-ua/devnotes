import ArticleCard from "../../components/content/ArticleCard.jsx";
import { articles } from "../../content/registry.js";

export default function Articles() {
  return <main className="page-shell"><header className="page-intro"><h1>Notas para pensar,<br /><em>fazer e seguir.</em></h1><p>Leituras curtas sobre interfaces, full stack e as decisões que deixam um produto mais claro.</p></header><section className="content-grid archive-grid article-grid">{articles.map((article, index) => <ArticleCard key={article.slug} article={article} featured={index === 0} />)}</section></main>;
}
