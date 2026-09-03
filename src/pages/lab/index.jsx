import { Link, useParams } from 'react-router';
import AsyncModule from '../../components/content/AsyncModule.jsx';
import { MdxCodeBlock } from '../../components/content/CodeBlock.jsx';
import CodeExplorer from '../../components/content/CodeExplorer.jsx';
import { formatContentDate, getLabBySlug, loadLab, loadLabGuide } from '@content/registry';

export default function Lab() {
  const { slug } = useParams();
  const lab = getLabBySlug(slug);
  const labLoader = loadLab(slug);
  const guideLoader = loadLabGuide(slug);

  if (!lab || !labLoader) {
    return (
      <main className="page-shell empty-state">
        <h1>Este lab não existe.</h1>
        <Link className="btn btn-primary" to="/labs">
          Ver labs
        </Link>
      </main>
    );
  }

  return (
    <main className="lab-shell">
      <nav className="content-breadcrumb" aria-label="Navegação estrutural">
        <Link to="/labs">Labs</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{lab.type}</span>
      </nav>
      <header className="lab-heading">
        <h1>{lab.title}</h1>
        <p className="content-publish-details">
          <time dateTime={lab.date}>{formatContentDate(lab.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{lab.readTime}</span>
        </p>
        <p>{lab.excerpt}</p>
      </header>
      <AsyncModule
        key={`lab-${slug}`}
        loader={labLoader}
        fallback={<p className="lab-loading">Carregando experimento…</p>}
        errorFallback={
          <p className="content-error" role="alert">
            Não foi possível carregar este experimento. Atualize a página e tente novamente.
          </p>
        }
      >
        {(module) => <LabContent module={module} lab={lab} />}
      </AsyncModule>
      {guideLoader && (
        <section className="lab-notes">
          <AsyncModule
            key={`guide-${slug}`}
            loader={guideLoader}
            fallback={null}
            errorFallback={
              <p className="content-error" role="alert">
                Não foi possível carregar o guia deste Lab.
              </p>
            }
          >
            {(module) => <LabGuide module={module} />}
          </AsyncModule>
        </section>
      )}
    </main>
  );
}

function LabContent({ module, lab }) {
  const Component = module.default;
  return (
    <>
      <section className={`lab-canvas accent-${lab.accent}`}>
        <div className="canvas-top">
          <span className="lab-preview-label">Demonstração interativa</span>
          <span>{lab.prompt}</span>
        </div>
        <Component />
      </section>
      {Component.codeFiles && (
        <section className="lab-code-section">
          <header>
            <h2>Veja como foi feito.</h2>
            <p>Estes são os arquivos reais que fazem a demonstração funcionar.</p>
          </header>
          <CodeExplorer files={Component.codeFiles} />
        </section>
      )}
    </>
  );
}

function LabGuide({ module }) {
  const Guide = module.default;
  return (
    <>
      <span className="eyebrow">Por trás do exemplo</span>
      <Guide components={{ pre: MdxCodeBlock }} />
    </>
  );
}
