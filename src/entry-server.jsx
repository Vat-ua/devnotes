import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App.jsx';
import { articles, labs } from '@content/registry';
import { getPageMeta } from './content/siteMeta.js';

export function render(pathname) {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  const location = `${basePath}${pathname}`;

  return {
    html: renderToString(
      <StaticRouter basename={basePath} location={location}>
        <App />
      </StaticRouter>,
    ),
    meta: getPageMeta(pathname, articles, labs),
  };
}

export const routes = [
  '/',
  '/articles',
  '/labs',
  '/sobre',
  ...articles.map((article) => `/articles/${article.slug}`),
  ...labs.map((lab) => `/labs/${lab.slug}`),
];
