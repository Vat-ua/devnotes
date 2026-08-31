import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import CodeExplorer from "../../components/content/CodeExplorer.jsx";
import { getLabBySlug, loadLab, loadLabGuide } from "../../content/registry.js";

export default function Lab() {
  const { slug } = useParams();
  const lab = getLabBySlug(slug);
  const labLoader = loadLab(slug);
  const guideLoader = loadLabGuide(slug);

  if (!lab || !labLoader) return <main className="page-shell empty-state"><h1>Este lab não existe.</h1><Link className="btn btn-primary" to="/labs">Ver labs</Link></main>;

  return <main className="lab-shell"><Link className="back-link" to="/labs">← Voltar para labs</Link><header className="lab-heading"><span className="eyebrow">Lab {lab.number} · {lab.type}</span><h1>{lab.title}</h1><p>{lab.excerpt}</p></header><section className={`lab-canvas accent-${lab.accent}`}><div className="canvas-top"><span className="live-dot">Ao vivo</span><span>{lab.prompt}</span></div><AsyncModule key={`lab-${slug}`} loader={labLoader} fallback={<p className="lab-loading">Carregando experimento…</p>}>{(module) => <LabPreview module={module} />}</AsyncModule></section>{guideLoader && <section className="lab-notes"><AsyncModule key={`guide-${slug}`} loader={guideLoader} fallback={null}>{(module) => <LabGuide module={module} />}</AsyncModule></section>}</main>;
}

function LabPreview({ module }) {
  const Component = module.default;
  return <><Component />{Component.codeFiles && <CodeExplorer files={Component.codeFiles} />}</>;
}

function LabGuide({ module }) {
  const Guide = module.default;
  return <Guide />;
}

function AsyncModule({ loader, fallback, children }) {
  const [module, setModule] = useState(null);

  useEffect(() => {
    let cancelled = false;
    loader().then((module) => {
      if (!cancelled) setModule(module);
    });
    return () => { cancelled = true; };
  }, [loader]);

  return module ? children(module) : fallback;
}
