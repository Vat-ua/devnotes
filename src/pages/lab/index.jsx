import { Suspense } from 'react';
import { Link } from 'react-router';

import { MdxCodeBlock } from '../../components/content/CodeBlock.jsx';
import { formatContentDate } from '@content/registry';

export default function Lab({ lab, LabComponent, Guide, LabCodeExplorer }) {
  return (
    <div className="container page-shell">
      <nav className="content-breadcrumb" aria-label="Navegação estrutural">
        <Link to="/labs">Labs</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{lab.topics.join(' · ')}</span>
      </nav>
      <header className="content-heading">
        <h1 className="content-title">{lab.title}</h1>
        <p className="content-publish-details">
          <time dateTime={lab.publishedAt}>{formatContentDate(lab.publishedAt)}</time>
        </p>
        <p className="content-deck">{lab.description}</p>
      </header>
      <section className="lab-canvas">
        <div className="canvas-top">
          <h2 className="lab-preview-label">Demonstração interativa</h2>
          <span>{lab.demoInstruction}</span>
        </div>
        <Suspense fallback={<p className="lab-loading">Carregando experimento…</p>}>
          <LabComponent />
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
      {Guide && (
        <section className="lab-notes">
          <span className="eyebrow">Por trás do exemplo</span>
          <div className="prose">
            <Suspense fallback={null}>
              <Guide components={{ pre: MdxCodeBlock }} />
            </Suspense>
          </div>
        </section>
      )}
    </div>
  );
}
