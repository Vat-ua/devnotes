import { useState } from "react";

export default function StateLayersLab() {
  const [active, setActive] = useState("Dados");
  const [loading, setLoading] = useState(false);
  return <div className="lab-demo"><div className="demo-tabs">{["Dados", "Filtro", "Feedback"].map((item) => <button className={active === item ? "active" : ""} type="button" onClick={() => setActive(item)} key={item}>{item}</button>)}</div><div className="demo-panel"><span className="panel-kicker">Estado atual</span><strong>{loading ? "Carregando…" : active}</strong><p>{loading ? "Uma transição curta também comunica progresso." : `Você está explorando a camada ${active.toLowerCase()} desta interface.`}</p><button type="button" onClick={() => { setLoading(true); window.setTimeout(() => setLoading(false), 900); }}>{loading ? "Aguarde" : "Simular resposta"}</button></div></div>;
}
