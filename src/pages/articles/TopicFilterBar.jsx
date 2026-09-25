import { Link } from 'react-router';

export default function TopicFilterBar({ options, activeTopic, total }) {
  return (
    <nav className="article-topic-filter" aria-label="Filtrar artigos por assunto">
      <ul>
        <li>
          <TopicLink count={total} current={!activeTopic} label="Todos" />
        </li>
        {options.map(({ topic, count }) => (
          <li key={topic}>
            <TopicLink count={count} current={activeTopic === topic} label={topic} topic={topic} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function TopicLink({ count, current, label, topic }) {
  const params = topic ? new URLSearchParams({ topic }) : undefined;
  const to = params ? `/articles?${params}` : '/articles';
  const articleLabel = count === 1 ? 'artigo' : 'artigos';

  return (
    <Link
      aria-current={current ? 'page' : undefined}
      aria-label={`${label}: ${count} ${articleLabel}`}
      className="article-topic-filter-link"
      preventScrollReset
      to={to}
    >
      <span>{label}</span>
      <span className="article-topic-filter-count" aria-hidden="true">
        {count}
      </span>
    </Link>
  );
}
