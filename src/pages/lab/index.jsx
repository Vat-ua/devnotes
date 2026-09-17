import { Suspense } from 'react';

import Callout from '../../components/content/Callout.jsx';
import { MdxCodeBlock } from '../../components/content/CodeBlock.jsx';
import ContentBody from '../../components/content/ContentBody.jsx';
import ContentHeader from '../../components/content/ContentHeader.jsx';
import ContentTable from '../../components/content/ContentTable.jsx';

export default function Lab({ lab, Demo, Content, LabCodeExplorer }) {
  return (
    <div className="container page-shell">
      <article className="content-page lab-page">
        <ContentHeader content={lab} collectionLabel="Labs" collectionPath="/labs" />
        <section className="lab-canvas">
          <div className="canvas-top">
            <h2 className="lab-preview-label">Demonstração interativa</h2>
            <span>{lab.demoInstruction}</span>
          </div>
          <Suspense fallback={<p className="lab-loading">Carregando experimento…</p>}>
            <Demo />
          </Suspense>
        </section>
        {LabCodeExplorer && (
          <section className="lab-code-section">
            <header>
              <h2>Veja como foi feito.</h2>
              <p>Estes são os arquivos reais que fazem a demonstração funcionar.</p>
            </header>
            <Suspense fallback={<p className="content-loading">Carregando arquivos…</p>}>
              <LabCodeExplorer />
            </Suspense>
          </section>
        )}
        <ContentBody className="lab-notes" label="Por trás do exemplo">
          <Suspense fallback={null}>
            <Content components={{ Callout, pre: MdxCodeBlock, table: ContentTable }} />
          </Suspense>
        </ContentBody>
      </article>
    </div>
  );
}
