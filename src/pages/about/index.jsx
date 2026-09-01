export default function About() {
  return (
    <main className="page-shell about-page">
      <header className="page-intro">
        <h1>Sobre o DevNotes</h1>
        <p>DevNotes é um lugar para pensar melhor antes de construir mais.</p>
      </header>

      <section className="about-grid">
        <div>
          <h2>Entender antes de acumular.</h2>
        </div>

        <div>
          <p>
            Boa parte do trabalho em desenvolvimento não pede uma ferramenta nova.
            Pede tempo para enxergar melhor o problema, nomear as escolhas e testar uma
            ideia antes de transformá-la em padrão.
          </p>
          <p>
            DevNotes existe para guardar esse tipo de aprendizado em formatos curtos,
            diretos e reutilizáveis.
          </p>
          <p>
            Uma leitura pode organizar o contexto de uma decisão. Um Lab pode tornar o
            mesmo assunto visível no navegador, com código para abrir, adaptar e
            continuar explorando.
          </p>
          <p>O objetivo não é oferecer respostas finais. É deixar o próximo passo mais claro.</p>
        </div>
      </section>
    </main>
  );
}
