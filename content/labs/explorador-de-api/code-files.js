import apiSource from './api.js?raw';
import explorerSource from './components/ApiExplorer.jsx?raw';
import stylesSource from './styles.css?raw';

export const codeFiles = [
  {
    name: 'api.js',
    description: 'Monta as requisições permitidas e preserva status, response.ok e JSON.',
    source: apiSource,
  },
  {
    name: 'ApiExplorer.jsx',
    description: 'Conecta formulário, preview do Request e snapshot da Response.',
    source: explorerSource,
  },
  {
    name: 'styles.css',
    description: 'Estilos isolados da interface do explorador.',
    source: stylesSource,
  },
];
