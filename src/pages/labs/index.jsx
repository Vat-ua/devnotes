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
      <ul className="content-grid archive-grid">
        {labs.map((lab, index) => (
          <li key={lab.slug}>
            <LabCard lab={lab} featured={index === 0} headingLevel={2} />
          </li>
        ))}
      </ul>
    </div>
  );
}
