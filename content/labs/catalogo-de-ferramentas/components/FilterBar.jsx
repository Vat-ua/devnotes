import { RotateCcw, Search } from "lucide-react";

export default function FilterBar({ query, category, sortBy, onChange, onReset }) {
  return (
    <div className="tool-controls">
      <label className="tool-search">
        <Search aria-hidden="true" size={17} />
        <span className="sr-only">Buscar ferramenta</span>
        <input
          value={query}
          onChange={(event) => onChange("q", event.target.value)}
          placeholder="Buscar ferramenta"
        />
      </label>

      <label>
        <span>Categoria</span>
        <select value={category} onChange={(event) => onChange("category", event.target.value)}>
          <option value="Todos">Todos</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Qualidade">Qualidade</option>
          <option value="Infraestrutura">Infraestrutura</option>
        </select>
      </label>

      <label>
        <span>Ordenar</span>
        <select value={sortBy} onChange={(event) => onChange("sort", event.target.value)}>
          <option value="name">A–Z</option>
          <option value="popularity">Mais populares</option>
        </select>
      </label>

      <button className="tool-reset" type="button" onClick={onReset}>
        <RotateCcw aria-hidden="true" size={16} /> Limpar
      </button>
    </div>
  );
}
