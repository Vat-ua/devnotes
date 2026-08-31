import { useState } from "react";

export default function PerceivedLatencyLab() {
  const [status, setStatus] = useState("Pronto para buscar");
  function simulate() { setStatus("Buscando dados…"); window.setTimeout(() => setStatus("Dados atualizados agora"), 1100); }
  return <div className="lab-demo"><div className="demo-panel"><span className="panel-kicker">Resposta da rede</span><strong>{status}</strong><p>Uma mensagem curta confirma que a ação foi recebida antes que o conteúdo esteja pronto.</p><button type="button" onClick={simulate}>Simular resposta</button></div></div>;
}
