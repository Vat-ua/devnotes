import LabCard from './LabCard.jsx';

export default function ContinueExploring({ labs }) {
  if (labs.length === 0) return null;

  return (
    <section className="content-recommendations" aria-labelledby="continue-exploring-title">
      <header className="content-recommendations-header">
        <span className="eyebrow">Outros Labs</span>
        <h2 id="continue-exploring-title">Continue explorando</h2>
      </header>
      <ul className="content-recommendations-grid">
        {labs.map((lab) => (
          <li key={lab.slug}>
            <LabCard lab={lab} variant="compact" headingLevel={3} />
          </li>
        ))}
      </ul>
    </section>
  );
}
