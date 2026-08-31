import { Link } from "react-router";
import ArticleCard from "../../components/content/ArticleCard.jsx";
import LabCard from "../../components/content/LabCard.jsx";
import { articles, labs } from "../../content/content.js";

export default function Home() {
  return (
    <>
      <section className="hero home-hero">
        <div className="container hero-layout">
          <div className="hero-copy">
            <div className="hero-label">
              <span />
              DevNotes · Full stack
            </div>

            <h1>
              Ideias para
              <br />
              <em>construir na web.</em>
            </h1>

            <p className="hero-lead">
              Notas práticas, explicações diretas e pequenos experimentos
              para transformar curiosidade em produto.
            </p>

            <div className="hero-actions">
              <Link className="btn btn-primary" to="/articles">
                Explorar notes
                <span aria-hidden="true">↗</span>
              </Link>

              <a className="btn btn-link" href="#labs">
                Conhecer labs
                <span aria-hidden="true">↓</span>
              </a>
            </div>

            <div className="hero-meta">
              <span>Interfaces</span><span>React</span><span>Full stack</span><span>Experimentos</span>
            </div>
          </div>

          <div className="hero-showcase">
            <div className="showcase-window">
              <div className="showcase-toolbar">
                <div className="window-dots">
                  <span />
                  <span />
                  <span />
                </div>

                <span className="window-title">devnotes.live</span>
              </div>

              <div className="showcase-content">
                <div className="showcase-heading">
                  <div>
                    <span className="mini-label">Em construção</span>
                    <h2>Uma ideia em movimento</h2>
                  </div>

                  <span className="result-count">live preview</span>
                </div>

                <div className="fake-search">
                  <span>⌕</span>
                  <span>O que você quer testar hoje?</span>
                </div>

                <div className="fake-grid">
                  <div className="fake-card">
                    <span className="fake-icon">01</span><strong>Nota</strong><small>Leitura curta</small>
                  </div>

                  <div className="fake-card fake-card-accent">
                    <span className="fake-icon">✦</span><strong>Lab</strong><small>Interativo</small>
                  </div>

                  <div className="fake-card">
                    <span className="fake-icon">&lt;/&gt;</span><strong>Código</strong><small>Na prática</small>
                  </div>

                  <div className="fake-card">
                    <span className="fake-icon">↗</span><strong>Projeto</strong><small>Próximo passo</small>
                  </div>
                </div>
              </div>
            </div>

            {/* <span className="hero-sticker sticker-one">useState()</span>
            <span className="hero-sticker sticker-two">{"<App />"}</span> */}
          </div>
        </div>
      </section>

      <section className="content-section" id="articles">
        <div className="container">
          <header className="section-header">
            <div>
              <span className="section-kicker">Notes recentes</span>
              <h2>Leituras que<br />viram decisões.</h2>
            </div>

            <p>
              Ideias enxutas para entender melhor as escolhas por trás de
              interfaces, código e produtos que funcionam no mundo real.
            </p>
          </header>

          <div className="content-grid article-grid">{articles.map((article, index) => <ArticleCard key={article.slug} article={article} featured={index === 0} />)}</div>
          <Link className="section-link" to="/articles">Ver todos os articles <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="labs-preview" id="labs"><div className="container">
        <header className="section-header"><div><span className="section-kicker">Labs</span><h2>Abra, mexa,<br />descubra.</h2></div><p>Pequenas experiências interativas para explorar comportamentos antes de levá-los ao seu próximo projeto.</p></header>
        <div className="content-grid lab-grid">{labs.map((lab, index) => <LabCard key={lab.slug} lab={lab} featured={index === 0} />)}</div>
        <Link className="section-link" to="/labs">Explorar todos os labs <span aria-hidden="true">→</span></Link>
      </div></section>

      <section className="closing-section">
        <div className="container closing-card">
          <span className="closing-label">Seu próximo ponto de partida</span>

          <h2>
            Encontre uma ideia.
            <br />
            Teste. Construa.
          </h2>

          <Link className="btn btn-dark" to="/labs">
            Abrir um lab
            <span>→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
