import { useState } from "react";
import { Link, useParams } from "react-router";
import { labs } from "../../content/content.js";

export default function Lab() {
  const { slug } = useParams();
  const lab = labs.find((item) => item.slug === slug);
  const [active, setActive] = useState("Dados");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  if (!lab) return <main className="page-shell empty-state"><h1>Este lab não existe.</h1><Link className="btn btn-primary" to="/labs">Ver labs</Link></main>;
  const isForm = lab.slug === "formulario-com-feedback";
  return <main className="lab-shell"><Link className="back-link" to="/labs">← Voltar para labs</Link><header className="lab-heading"><span className="eyebrow">Lab {lab.number} · {lab.type}</span><h1>{lab.title}</h1><p>{lab.excerpt}</p></header><section className={`lab-canvas accent-${lab.accent}`}><div className="canvas-top"><span className="live-dot">Ao vivo</span><span>{lab.prompt}</span></div>{isForm ? <form className="lab-form" onSubmit={(event) => event.preventDefault()}><label htmlFor="lab-name">Seu nome</label><div><input id="lab-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Digite pelo menos 3 letras" /><button type="submit">Enviar</button></div><p className={name.length >= 3 ? "feedback success" : "feedback"}>{name.length >= 3 ? `Tudo certo, ${name}. O feedback chegou no momento certo.` : "A interface vai orientar o próximo passo."}</p></form> : <div className="lab-demo"><div className="demo-tabs">{["Dados", "Filtro", "Feedback"].map((item) => <button className={active === item ? "active" : ""} type="button" onClick={() => setActive(item)} key={item}>{item}</button>)}</div><div className="demo-panel"><span className="panel-kicker">Estado atual</span><strong>{loading ? "Carregando…" : active}</strong><p>{loading ? "Uma transição curta também comunica progresso." : `Você está explorando a camada ${active.toLowerCase()} desta interface.`}</p><button type="button" onClick={() => { setLoading(true); window.setTimeout(() => setLoading(false), 900); }}>{loading ? "Aguarde" : "Simular resposta"}</button></div></div>}</section><section className="lab-notes"><div><span className="eyebrow">O que observar</span><h2>Uma interface é uma conversa em tempo real.</h2></div><p>Este laboratório não é uma receita pronta. Mude os estados, observe o feedback e leve a ideia que fizer sentido para o seu contexto.</p></section></main>;
}
