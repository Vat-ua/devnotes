import { tools } from '../data.js';
import ToolCard from './ToolCard.jsx';
import ToolGrid from './ToolGrid.jsx';

const flow = [
  { label: 'Dados', value: 'tools[]' },
  { label: 'Transformação', value: '.map()' },
  { label: 'Componentes', value: 'ToolCard + props' },
  { label: 'Interface', value: `${tools.length} cards` },
];

export default function ToolGallery() {
  return (
    <div className="tool-gallery">
      <header className="gallery-intro">
        <div>
          <span className="gallery-kicker">Uma estrutura, conteúdos diferentes</span>
          <h3>Do array para a interface.</h3>
          <p>
            Cada objeto fornece os dados. O React percorre a lista e configura o mesmo componente
            com props diferentes.
          </p>
        </div>
        <p className="gallery-count">
          <strong>{tools.length}</strong>
          objetos viraram cards
        </p>
      </header>

      <ol className="gallery-flow" aria-label="Fluxo dos dados até a interface">
        {flow.map((step, index) => (
          <li key={step.label}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{step.label}</strong>
            <code>{step.value}</code>
          </li>
        ))}
      </ol>

      <ToolGrid>
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            name={tool.name}
            category={tool.category}
            description={tool.description}
            tags={tool.tags}
            useCases={tool.useCases}
            featured={tool.featured}
          />
        ))}
      </ToolGrid>
    </div>
  );
}
