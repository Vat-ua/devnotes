import toolsSource from "./data.js?raw";
import filterBarSource from "./components/FilterBar.jsx?raw";
import toolCardSource from "./components/ToolCard.jsx?raw";
import catalogSource from "./components/ToolCatalog.jsx?raw";
import stylesSource from "./styles.css?raw";

export const codeFiles = [
  { name: "data.js", description: "Dados locais para renderizar o catálogo.", source: toolsSource },
  { name: "FilterBar.jsx", description: "Controles que escrevem busca, categoria e ordem na URL.", source: filterBarSource },
  { name: "ToolCard.jsx", description: "Card de apresentação para uma ferramenta.", source: toolCardSource },
  { name: "ToolCatalog.jsx", description: "Parâmetros da URL, lista derivada e atualização dos filtros.", source: catalogSource },
  { name: "styles.css", description: "Estilos isolados da interface do catálogo.", source: stylesSource },
];
