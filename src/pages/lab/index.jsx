import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getLabBySlug, loadLab, loadLabGuide } from "../../content/registry.js";

export default function Lab() {
  const { slug } = useParams();
  const lab = getLabBySlug(slug);
  const labLoader = loadLab(slug);
  const guideLoader = loadLabGuide(slug);

  if (!lab || !labLoader) return <main className="page-shell empty-state"><h1>Este lab não existe.</h1><Link className="btn btn-primary" to="/labs">Ver labs</Link></main>;

  return <main className="lab-shell"><Link className="back-link" to="/labs">← Voltar para labs</Link><header className="lab-heading"><span className="eyebrow">Lab {lab.number} · {lab.type}</span><h1>{lab.title}</h1><p>{lab.excerpt}</p></header><section className={`lab-canvas accent-${lab.accent}`}><div className="canvas-top"><span className="live-dot">Ao vivo</span><span>{lab.prompt}</span></div><AsyncModule key={`lab-${slug}`} loader={labLoader} fallback={<p className="lab-loading">Carregando experimento…</p>} /></section>{guideLoader && <section className="lab-notes"><AsyncModule key={`guide-${slug}`} loader={guideLoader} fallback={null} /></section>}</main>;
}

function AsyncModule({ loader, fallback }) {
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    let cancelled = false;
    loader().then((module) => {
      if (!cancelled) setComponent(() => module.default);
    });
    return () => { cancelled = true; };
  }, [loader]);

  return Component ? <Component /> : fallback;
}
