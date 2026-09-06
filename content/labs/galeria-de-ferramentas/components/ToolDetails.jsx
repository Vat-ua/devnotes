import { ChevronDown } from 'lucide-react';

export default function ToolDetails({ name, useCases }) {
  return (
    <details className="gallery-details">
      <summary>
        Ver onde usar
        <ChevronDown aria-hidden="true" size={16} />
      </summary>
      <ul aria-label={`Onde usar ${name}`}>
        {useCases.map((useCase) => (
          <li key={useCase}>{useCase}</li>
        ))}
      </ul>
    </details>
  );
}
