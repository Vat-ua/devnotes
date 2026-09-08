import { Link } from 'react-router';

import { formatContentDate } from '@content/registry';

export default function ContentHeader({ content, collectionLabel, collectionPath }) {
  return (
    <>
      <nav className="content-breadcrumb" aria-label="Navegação estrutural">
        <Link to={collectionPath}>{collectionLabel}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{content.topics.join(' · ')}</span>
      </nav>
      <header className="content-heading">
        <h1 className="content-title">{content.title}</h1>
        <p className="content-publish-details">
          <time dateTime={content.publishedAt}>{formatContentDate(content.publishedAt)}</time>
        </p>
        <p className="content-deck">{content.description}</p>
      </header>
    </>
  );
}
