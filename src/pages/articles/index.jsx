import { Link } from 'react-router';

import ArticleCard from '../../components/content/ArticleCard.jsx';
import { filterContentByTopic, getTopicOptions } from '../../content/discovery.js';
import { useHydratedSearchParams } from '../../utils/useHydratedSearchParams.js';
import { articles } from '@content/registry';
import TopicFilterBar from './TopicFilterBar.jsx';

const allTopicOptions = getTopicOptions(articles);
const recurringTopicMinimum = 2;
const recurringTopicOptions = getTopicOptions(articles, { minCount: recurringTopicMinimum });
const showTopicFilters = recurringTopicOptions.length >= 2;

export default function Articles() {
  const [searchParams] = useHydratedSearchParams();
  const activeTopic = searchParams.get('topic')?.trim() || undefined;
  const activeTopicOption = allTopicOptions.find(({ topic }) => topic === activeTopic);
  const topicOptions =
    activeTopicOption && activeTopicOption.count < recurringTopicMinimum
      ? [...recurringTopicOptions, activeTopicOption]
      : recurringTopicOptions;
  const visibleArticles = filterContentByTopic(articles, activeTopic);
  const resultLabel = visibleArticles.length === 1 ? 'artigo encontrado' : 'artigos encontrados';

  return (
    <div className="container page-shell">
      <header className="page-intro">
        <h1>
          Notas para pensar,
          <br />
          <em>fazer e seguir.</em>
        </h1>
        <p>
          Leituras curtas sobre interfaces, full stack e as decisões que deixam um produto mais
          claro.
        </p>
      </header>
      {showTopicFilters && (
        <TopicFilterBar options={topicOptions} activeTopic={activeTopic} total={articles.length} />
      )}
      <p className="article-result-count" role="status">
        {activeTopic
          ? `${visibleArticles.length} ${resultLabel} para “${activeTopic}”.`
          : `${visibleArticles.length} artigos publicados.`}
      </p>
      {visibleArticles.length > 0 ? (
        <ul className="archive-grid">
          {visibleArticles.map((article, index) => (
            <li key={article.slug}>
              <ArticleCard article={article} featured={index === 0} headingLevel={2} />
            </li>
          ))}
        </ul>
      ) : (
        <section className="article-filter-empty" aria-labelledby="article-filter-empty-title">
          <h2 id="article-filter-empty-title">Nenhum artigo encontrado</h2>
          <p>Não há artigos publicados com o assunto “{activeTopic}”.</p>
          <Link className="btn btn-primary" preventScrollReset to="/articles">
            Ver todos os artigos
          </Link>
        </section>
      )}
    </div>
  );
}
