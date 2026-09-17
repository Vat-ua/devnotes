import { Suspense } from 'react';

import Callout from '../../components/content/Callout.jsx';
import { MdxCodeBlock } from '../../components/content/CodeBlock.jsx';
import ContentBody from '../../components/content/ContentBody.jsx';
import ContentHeader from '../../components/content/ContentHeader.jsx';
import ContentTable from '../../components/content/ContentTable.jsx';
import { getContentVisualPair } from '../../utils/contentVisuals.js';

export default function Article({ article, Content }) {
  const [primaryColor, secondaryColor] = getContentVisualPair(article.slug);

  return (
    <div className="container page-shell">
      <article className="content-page article-page">
        <ContentHeader content={article} collectionLabel="Artigos" collectionPath="/articles" />
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
        <ContentBody>
          <Suspense fallback={<p className="content-loading">Carregando artigo…</p>}>
            <Content components={{ Callout, pre: MdxCodeBlock, table: ContentTable }} />
          </Suspense>
        </ContentBody>
      </article>
    </div>
  );
}
