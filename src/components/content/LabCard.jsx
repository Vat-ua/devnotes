import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { formatCardDate } from '@content/registry';
import { getContentVisualPair } from '../../utils/contentVisuals.js';

export default function LabCard({ lab, featured = false, headingLevel = 3, variant = 'default' }) {
  const [primaryColor, secondaryColor] = getContentVisualPair(lab.slug);
  const Title = headingLevel === 2 ? 'h2' : 'h3';
  const className = [
    'content-card',
    'lab-card',
    featured && 'is-featured',
    variant === 'compact' && 'is-compact',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Link
      className={className}
      style={{
        '--lab-orb-primary': `var(--${primaryColor})`,
        '--lab-orb-secondary': `var(--${secondaryColor})`,
      }}
      to={`/labs/${lab.slug}`}
    >
      <div className="card-meta">
        <span>{lab.topics.join(' · ')}</span>
        <time dateTime={lab.publishedAt}>{formatCardDate(lab.publishedAt)}</time>
      </div>
      <div className="lab-card-orb" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div>
        <Title>{lab.title}</Title>
        <p>{lab.description}</p>
      </div>
      <span className="card-link">
        Abrir lab <ArrowUpRight aria-hidden="true" size={18} />
      </span>
    </Link>
  );
}
