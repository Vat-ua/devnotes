import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link className="brand" to="/">
            <span className="brand-mark">#</span>
            <span>DevNotes</span>
          </Link>
          <p>Ideias, notas e experimentos para construir na web.</p>
        </div>

        <div className="footer-links" aria-label="Links do rodapé">
          <Link to="/articles">Articles</Link>
          <Link to="/labs">Labs</Link>
          <Link to="/sobre">Sobre</Link>
        </div>

        <p className="footer-note">© 2026 DevNotes</p>
      </div>
    </footer>
  );
}
