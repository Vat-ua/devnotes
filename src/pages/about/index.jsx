const principles = [
  {
    number: "01",
    title: "Contexto antes do padrão",
    text: "Uma decisão fica mais útil quando o problema e os limites aparecem antes da solução.",
  },
  {
    number: "02",
    title: "Código para abrir",
    text: "Exemplos existem para serem lidos, adaptados e usados como ponto de partida.",
  },
  {
    number: "03",
    title: "Espaço para testar",
    text: "Algumas ideias só ficam claras quando você pode mudar algo e observar o que acontece.",
  },
];

export default function About() {
  return (
    <main className="about-page">
      <section className="about-hero container">
        <h1>Sobre o <em>DevNotes.</em></h1>
        <p>
          DevNotes é um lugar para pensar melhor antes de construir mais — com notas,
          exemplos e experimentos sobre as decisões pequenas que definem uma experiência digital.
        </p>
      </section>

      <section className="about-manifesto">
        <div className="container about-manifesto-inner">
          <h2>Entender antes<br />de acumular.</h2>
          <div>
            <p>
              Boa parte do trabalho em desenvolvimento não pede uma ferramenta nova. Pede tempo
              para enxergar melhor o problema, nomear as escolhas e testar uma ideia antes de
              transformá-la em padrão.
            </p>
            <p>
              DevNotes guarda esse tipo de aprendizado em formatos curtos, diretos e reutilizáveis.
            </p>
          </div>
        </div>
      </section>

      <section className="about-principles container" aria-label="Princípios do DevNotes">
        {principles.map((principle) => (
          <article key={principle.number}>
            <span>{principle.number}</span>
            <h2>{principle.title}</h2>
            <p>{principle.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
