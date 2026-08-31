import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";

export default function LabCard({ lab, featured = false }) {
  return (
    <Link className={`content-card lab-card accent-${lab.accent} ${featured ? "is-featured" : ""}`} to={`/labs/${lab.slug}`}>
      <div className="card-meta"><span>Lab {lab.number}</span><span>{lab.type}</span></div>
      <div className="lab-card-orb" aria-hidden="true"><span /><span /><span /></div>
      <div>
        <h3>{lab.title}</h3>
        <p>{lab.excerpt}</p>
      </div>
      <span className="card-link">Abrir lab <ArrowUpRight aria-hidden="true" size={18} /></span>
    </Link>
  );
}
