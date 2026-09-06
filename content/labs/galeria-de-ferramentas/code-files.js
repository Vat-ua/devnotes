import dataSource from './data.js?raw';
import toolDetailsSource from './components/ToolDetails.jsx?raw';
import toolCardSource from './components/ToolCard.jsx?raw';
import toolGridSource from './components/ToolGrid.jsx?raw';
import toolGallerySource from './components/ToolGallery.jsx?raw';
import labSource from './Lab.jsx?raw';
import stylesSource from './styles.css?raw';

export const codeFiles = [
  {
    name: 'data.js',
    description: 'O array de objetos que funciona como fonte única dos cards.',
    source: dataSource,
  },
  {
    name: 'ToolCard.jsx',
    description: 'Um componente reutilizável configurado por props.',
    source: toolCardSource,
  },
  {
    name: 'ToolDetails.jsx',
    description: 'Uma parte menor composta dentro do card, com interação nativa.',
    source: toolDetailsSource,
  },
  {
    name: 'ToolGrid.jsx',
    description: 'O contêiner de layout que recebe os cards pela prop children.',
    source: toolGridSource,
  },
  {
    name: 'ToolGallery.jsx',
    description: 'O map que transforma cada objeto em um ToolCard com key estável.',
    source: toolGallerySource,
  },
  {
    name: 'Lab.jsx',
    description: 'A entrada que conecta a demonstração ao code explorer.',
    source: labSource,
  },
  {
    name: 'styles.css',
    description: 'Os estilos locais da galeria e de suas partes compostas.',
    source: stylesSource,
  },
];
