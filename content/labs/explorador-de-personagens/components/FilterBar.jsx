import { Search } from "lucide-react";

export default function FilterBar({ query, status, onQueryChange, onStatusChange }) {
  return (
    <div className="character-controls">
      <label className="character-search">
        <Search aria-hidden="true" size={17} />
        <span className="sr-only">Buscar personagem</span>
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar personagem"
        />
      </label>

      <label>
        <span>Status</span>
        <select value={status} onChange={(event) => onStatusChange(event.target.value)}>
          <option value="Todos">Todos</option>
          <option value="alive">Vivo</option>
          <option value="dead">Morto</option>
          <option value="unknown">Desconhecido</option>
        </select>
      </label>
    </div>
  );
}
