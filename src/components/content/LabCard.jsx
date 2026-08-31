import { Link } from "react-router";

export default function LabCard({ lab, featured = false }) {
  return (
    <article className={`content-card lab-card accent-${lab.accent} ${featured ? "is-featured" : ""}`}>
      <div className="card-meta"><span>Lab {lab.number}</span><span>{lab.type}</span></div>
      <div className="lab-card-orb" aria-hidden="true"><span /><span /><span /></div>
      <div>
        <h3><Link to={`/labs/${lab.slug}`}>{lab.title}</Link></h3>
        <p>{lab.excerpt}</p>
      </div>
      <Link className="card-link" to={`/labs/${lab.slug}`}>Abrir lab <span aria-hidden="true">↗</span></Link>
    </article>
  );
}
