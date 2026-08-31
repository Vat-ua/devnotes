import { useMemo, useState } from "react";
import { countries } from "../data.js";
import CountryCard from "./CountryCard.jsx";
import FilterBar from "./FilterBar.jsx";

export default function CountryExplorer() {
  const [query, setQuery] = useState("");
  const [continent, setContinent] = useState("Todos");
  const [sortBy, setSortBy] = useState("name");
  const filteredCountries = useMemo(() => countries.filter((country) => `${country.name} ${country.capital}`.toLowerCase().includes(query.toLowerCase())).filter((country) => continent === "Todos" || country.continent === continent).toSorted((first, second) => sortBy === "name" ? first.name.localeCompare(second.name, "pt-BR") : second.population - first.population), [query, continent, sortBy]);
  return <div className="country-explorer"><FilterBar query={query} continent={continent} sortBy={sortBy} onQueryChange={setQuery} onContinentChange={setContinent} onSortChange={setSortBy} /><p className="country-result-count">{filteredCountries.length} {filteredCountries.length === 1 ? "país encontrado" : "países encontrados"}</p><div className="country-grid">{filteredCountries.map((country) => <CountryCard key={country.name} country={country} />)}</div>{filteredCountries.length === 0 && <p className="country-empty">Nenhum país corresponde a essa busca. Tente outro termo ou filtro.</p>}</div>;
}
