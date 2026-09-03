import LabCard from '../../components/content/LabCard.jsx';
import { labs } from '@content/registry';

export default function Labs() {
  return (
    <div className="page-shell">
      <header className="page-intro">
        <h1>
          Ideias que pedem
          <br />
          <em>para ser tocadas.</em>
        </h1>
        <p>
          Experimentos pequenos para observar comportamento, testar decisões e aprender fazendo.
        </p>
      </header>
      <section className="content-grid archive-grid lab-grid">
        {labs.map((lab, index) => (
          <LabCard key={lab.slug} lab={lab} featured={index === 0} headingLevel={2} />
        ))}
      </section>
    </div>
  );
}
