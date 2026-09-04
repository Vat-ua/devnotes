import lab from './Lab.jsx?raw';
import explorer from './components/EconomyExplorer.jsx?raw';
import chart from './components/HistoryChart.jsx?raw';
import api from './api.js?raw';
import series from './series.js?raw';
import styles from './styles.css?raw';

export const codeFiles = [
  {
    name: 'EconomyExplorer.jsx',
    description: 'Escolhas do usuário, ciclo da consulta e leitura dos indicadores.',
    source: explorer,
  },
  {
    name: 'api.js',
    description: 'Consulta oficial, validação, cancelamento e cache de cinco minutos.',
    source: api,
  },
  {
    name: 'series.js',
    description: 'Séries, unidades, janelas e cálculos derivados.',
    source: series,
  },
  {
    name: 'HistoryChart.jsx',
    description: 'Gráficos SVG, inspeção por teclado e tabela acessível.',
    source: chart,
  },
  {
    name: 'styles.css',
    description: 'Estilos locais com os tokens e a cascata do DevNotes.',
    source: styles,
  },
  {
    name: 'Lab.jsx',
    description: 'Entrada do Lab e integração com o explorador de código.',
    source: lab,
  },
];
