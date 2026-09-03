import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import App from './App.jsx';
import { preloadRouteContent } from './content/registry.js';
import './styles/index.css';

const root = document.getElementById('root');
const app = (
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

async function bootstrap() {
  if (root.hasChildNodes()) {
    try {
      await preloadRouteContent(getRoutePathname());
    } catch {
      // AsyncModule mostrará o estado de erro correspondente após a hydration.
    }
    hydrateRoot(root, app);
    return;
  }

  createRoot(root).render(app);
}

function getRoutePathname() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  const pathname = window.location.pathname;

  return basePath && pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname;
}

bootstrap();
