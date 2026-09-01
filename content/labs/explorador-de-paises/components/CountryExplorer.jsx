import { useMemo, useState } from "react";
import { countries } from "../data.js";
import CountryCard from "./CountryCard.jsx";
import FilterBar from "./FilterBar.jsx";

function matchesSearch(country, query) {
  const searchableText = `${country.name} ${country.capital}`.toLowerCase();

  return searchableText.includes(query.toLowerCase());
}

function sortCountries(first, second, sortBy) {
  if (sortBy === "population") {
    return second.population - first.population;
  }

  return first.name.localeCompare(second.name, "pt-BR");
}

export default function CountryExplorer() {
  const [query, setQuery] = useState("");
  const [continent, setContinent] = useState("Todos");
  const [sortBy, setSortBy] = useState("name");
  const filteredCountries = useMemo(() => {
    return countries
      .filter((country) => matchesSearch(country, query))
      .filter((country) => continent === "Todos" || country.continent === continent)
      .toSorted((first, second) => sortCountries(first, second, sortBy));
  }, [query, continent, sortBy]);

  const resultLabel = filteredCountries.length === 1 ? "país encontrado" : "países encontrados";

  return (
    <div className="country-explorer">
      <FilterBar
        query={query}
        continent={continent}
        sortBy={sortBy}
        onQueryChange={setQuery}
        onContinentChange={setContinent}
        onSortChange={setSortBy}
      />

      <p className="country-result-count">
        {filteredCountries.length} {resultLabel}
      </p>

      <div className="country-grid">
        {filteredCountries.map((country) => (
          <CountryCard key={country.name} country={country} />
        ))}
      </div>

      {filteredCountries.length === 0 && (
        <p className="country-empty">
          Nenhum país corresponde a essa busca. Tente outro termo ou filtro.
        </p>
      )}
    </div>
  );
}
