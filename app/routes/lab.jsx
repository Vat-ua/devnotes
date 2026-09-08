/* oxlint-disable react/only-export-components -- Framework route modules co-locate route exports. */
/* oxlint-disable react/static-components -- Content components are cached at module scope by slug. */
import { lazy } from 'react';
import { Link } from 'react-router';

import CodeExplorer from '../../src/components/content/CodeExplorer.jsx';
import LabPage from '../../src/pages/lab/index.jsx';
import { getLabBySlug, getLazyLab, getLazyLabGuide, loadLabCodeFiles } from '../content.js';
import { contentMeta, pageMeta } from '../meta.js';

const lazyCodeExplorers = new Map();

export function meta({ params }) {
  const lab = getLabBySlug(params.slug);
  return lab ? contentMeta(lab, 'lab') : pageMeta('/404');
}

export default function Lab({ params }) {
  const lab = getLabBySlug(params.slug);
  const LabComponent = getLazyLab(params.slug);
  const Guide = getLazyLabGuide(params.slug);
  const LabCodeExplorer = getLazyCodeExplorer(params.slug);

  if (!lab || !LabComponent) return <MissingLab />;

  return (
    <LabPage
      lab={lab}
      LabComponent={LabComponent}
      Guide={Guide}
      LabCodeExplorer={LabCodeExplorer}
    />
  );
}

function getLazyCodeExplorer(slug) {
  if (lazyCodeExplorers.has(slug)) return lazyCodeExplorers.get(slug);

  const codeFilesPromise = loadLabCodeFiles(slug);
  const LazyCodeExplorer = codeFilesPromise
    ? lazy(async () => {
        const { codeFiles } = await codeFilesPromise;
        return { default: () => <CodeExplorer files={codeFiles} /> };
      })
    : undefined;

  lazyCodeExplorers.set(slug, LazyCodeExplorer);
  return LazyCodeExplorer;
}

export function ErrorBoundary() {
  return (
    <div className="container page-shell empty-state">
      <span className="eyebrow">Erro</span>
      <h1>Não foi possível abrir o Lab.</h1>
      <Link className="btn btn-primary" to="/labs">
        Ver Labs
      </Link>
    </div>
  );
}

function MissingLab() {
  return (
    <div className="container page-shell empty-state">
      <span className="eyebrow">404</span>
      <h1>Este Lab não existe.</h1>
      <Link className="btn btn-primary" to="/labs">
        Ver Labs
      </Link>
    </div>
  );
}
