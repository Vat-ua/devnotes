import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { tools } from "../data.js";
import FilterBar from "./FilterBar.jsx";
import ToolCard from "./ToolCard.jsx";

function matchesQuery(tool, query) {
  const searchableText = `${tool.name} ${tool.description} ${tool.tags.join(" ")}`.toLowerCase();

  return searchableText.includes(query);
}

function matchesCategory(tool, category) {
  return category === "Todos" || tool.category === category;
}

function sortTools(first, second, sortBy) {
  if (sortBy === "popularity") {
    return second.popularity - first.popularity;
  }

  return first.name.localeCompare(second.name, "pt-BR");
}

export default function ToolCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "Todos";
  const sortBy = searchParams.get("sort") ?? "name";

  const visibleTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return tools
      .filter((tool) => matchesQuery(tool, normalizedQuery))
      .filter((tool) => matchesCategory(tool, category))
      .toSorted((first, second) => sortTools(first, second, sortBy));
  }, [query, category, sortBy]);

  const resultLabel = visibleTools.length === 1 ? "ferramenta encontrada" : "ferramentas encontradas";

  function updateParam(name, value) {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      const isDefault = (name === "category" && value === "Todos") || (name === "sort" && value === "name");

      if (!value || isDefault) {
        nextParams.delete(name);
      } else {
        nextParams.set(name, value);
      }

      return nextParams;
    }, { replace: true });
  }

  function resetFilters() {
    setSearchParams({}, { replace: true });
  }

  return (
    <div className="tool-catalog">
      <FilterBar
        query={query}
        category={category}
        sortBy={sortBy}
        onChange={updateParam}
        onReset={resetFilters}
      />

      <p className="tool-result-count">
        {visibleTools.length} {resultLabel}
      </p>

      <div className="tool-grid">
        {visibleTools.map((tool) => (
          <ToolCard key={tool.name} tool={tool} />
        ))}
      </div>

      {visibleTools.length === 0 && (
        <p className="tool-empty">Nenhuma ferramenta corresponde a essa busca. Tente outro termo ou limpe os filtros.</p>
      )}
    </div>
  );
}
