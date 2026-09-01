import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { formatCardDate } from "../../content/registry.js";
import { getLabVisualPair } from "../../utils/labVisuals.js";

export default function LabCard({ lab, featured = false }) {
  const [primaryColor, secondaryColor] = getLabVisualPair(lab.slug);

  return (
    <Link
      className={`content-card lab-card accent-${lab.accent} ${featured ? "is-featured" : ""}`}
      style={{
        "--lab-orb-primary": `var(--${primaryColor})`,
        "--lab-orb-secondary": `var(--${secondaryColor})`,
      }}
      to={`/labs/${lab.slug}`}
    >
      <div className="card-meta">
        <span>{lab.type}</span>
        <time dateTime={lab.date}>{formatCardDate(lab.date)}</time>
      </div>
      <div className="lab-card-orb" aria-hidden="true"><span /><span /><span /></div>
      <div>
        <h3>{lab.title}</h3>
        <p>{lab.excerpt}</p>
      </div>
      <span className="card-link">Abrir lab <ArrowUpRight aria-hidden="true" size={18} /></span>
    </Link>
  );
}
