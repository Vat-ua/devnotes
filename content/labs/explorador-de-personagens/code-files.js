import apiSource from "./api.js?raw";
import filterBarSource from "./components/FilterBar.jsx?raw";
import cardSource from "./components/CharacterCard.jsx?raw";
import explorerSource from "./components/CharacterExplorer.jsx?raw";
import stylesSource from "./styles.css?raw";

export const codeFiles = [
  { name: "api.js", description: "Request à API e adaptação da resposta para o modelo da interface.", source: apiSource },
  { name: "FilterBar.jsx", description: "Controles locais para busca e status do personagem.", source: filterBarSource },
  { name: "CharacterCard.jsx", description: "Card que recebe apenas o modelo normalizado da aplicação.", source: cardSource },
  { name: "CharacterExplorer.jsx", description: "Estados de rede, cancelamento de requests e paginação.", source: explorerSource },
  { name: "styles.css", description: "Estilos isolados da interface do explorador.", source: stylesSource },
];
