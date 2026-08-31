import countriesSource from "./data.js?raw";
import filterBarSource from "./components/FilterBar.jsx?raw";
import cardSource from "./components/CountryCard.jsx?raw";
import explorerSource from "./components/CountryExplorer.jsx?raw";

export const codeFiles = [
  { name: "data.js", description: "Os dados locais que alimentam os cards.", source: countriesSource },
  { name: "FilterBar.jsx", description: "Inputs controlados para busca, filtro e ordenação.", source: filterBarSource },
  { name: "CountryCard.jsx", description: "Um card reutilizável com accordion nativo.", source: cardSource },
  { name: "CountryExplorer.jsx", description: "Estado local e dados derivados com filter() e toSorted().", source: explorerSource },
];
