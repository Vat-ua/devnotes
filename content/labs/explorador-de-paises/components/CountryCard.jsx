import { ChevronDown } from 'lucide-react';

export default function CountryCard({ country }) {
  const formattedPopulation = new Intl.NumberFormat('pt-BR').format(country.population);

  return (
    <article className="country-card">
      <div className="country-card-main">
        <span className="country-flag">{country.flag}</span>
        <div>
          <h3>{country.name}</h3>
          <p>
            {country.capital} · {country.continent}
          </p>
        </div>
      </div>

      <details>
        <summary>
          Ver detalhes <ChevronDown aria-hidden="true" size={16} />
        </summary>
        <dl>
          <div>
            <dt>População</dt>
            <dd>{formattedPopulation}</dd>
          </div>
          <div>
            <dt>Idioma</dt>
            <dd>{country.language}</dd>
          </div>
        </dl>
      </details>
    </article>
  );
}
