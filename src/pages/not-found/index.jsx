import { Link } from 'react-router';
export default function NotFound() {
  return (
    <main className="page-shell empty-state">
      <span className="eyebrow">404</span>
      <h1>Esta página escapou do mapa.</h1>
      <p>Vamos voltar para uma ideia que ainda está por aqui.</p>
      <Link className="btn btn-primary" to="/">
        Ir para o início
      </Link>
    </main>
  );
}
