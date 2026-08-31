import { useMemo, useState } from "react";
import { Search } from "lucide-react";

const items = [
  { name: "React", type: "Library" },
  { name: "Vite", type: "Tooling" },
  { name: "PostgreSQL", type: "Database" },
  { name: "Node.js", type: "Runtime" },
];

export default function FilterDemo() {
  const [query, setQuery] = useState("");
  const results = useMemo(
    () => items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <section className="embedded-demo" aria-label="Exemplo interativo de filtro">
      <div className="embedded-demo-header"><span>Demo interativo</span><span>{results.length} resultados</span></div>
      <label className="demo-search"><Search aria-hidden="true" size={17} /><span className="sr-only">Filtrar tecnologias</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filtre uma tecnologia" /></label>
      <div className="demo-results">{results.map((item) => <div key={item.name}><strong>{item.name}</strong><span>{item.type}</span></div>)}</div>
    </section>
  );
}
