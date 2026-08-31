import { Link } from "react-router";

export default function About() {
  return <main className="page-shell about-page"><header className="page-intro"><span className="eyebrow">Sobre o DevNotes</span><h1>Um lugar para manter<br /><em>boas perguntas por perto.</em></h1><p>DevNotes reúne notas diretas e pequenos laboratórios sobre o trabalho de construir experiências digitais.</p></header><section className="about-grid"><div><span className="section-kicker">O formato</span><h2>Menos ruído. Mais coisas para testar.</h2></div><div><p>Nem toda ideia precisa virar um curso longo. Algumas ficam melhores como uma leitura de cinco minutos; outras só fazem sentido quando você pode mexer nelas.</p><p>Por isso, Articles organizam contexto e Labs dão espaço para experimentar. Os dois lados se encontram no mesmo objetivo: criar com mais intenção.</p><Link className="btn btn-primary" to="/articles">Começar pelos articles <span aria-hidden="true">↗</span></Link></div></section></main>;
}
