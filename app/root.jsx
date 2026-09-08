/* oxlint-disable react/only-export-components -- Framework root co-locates route exports. */
import { useEffect } from 'react';
import {
  Links,
  Link,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLocation,
} from 'react-router';

import Footer from '../src/components/Footer.jsx';
import Header from '../src/components/Header.jsx';
import { syncCodeBlockTabStops } from '../src/utils/codeBlockTabStops.js';
import '../src/styles/index.css';

const initializeTheme = `
  (() => {
    const savedTheme = localStorage.getItem('devnotes-theme');
    const theme =
      savedTheme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  })();
`;

export function links() {
  return [{ rel: 'icon', type: 'image/svg+xml', href: `${import.meta.env.BASE_URL}favicon.svg` }];
}

export function Layout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="DevNotes" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#f5f3ed" />
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: initializeTheme }} />
        <Meta />
        <Links />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@200..800&family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  useCodeBlockTabStops();

  return (
    <div className="app-shell">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export function ErrorBoundary({ error }) {
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="app-shell">
      <Header />
      <main>
        <div className="container page-shell empty-state">
          <span className="eyebrow">{notFound ? '404' : 'Erro'}</span>
          <h1>{notFound ? 'Esta página não existe.' : 'Algo deu errado.'}</h1>
          <Link className="btn btn-primary" to="/">
            Voltar ao início
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function useCodeBlockTabStops() {
  const { pathname } = useLocation();

  useEffect(() => {
    const main = document.querySelector('.app-shell main');
    if (!main) return undefined;

    let frameId;
    const sync = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => syncCodeBlockTabStops(main));
    };
    const mutations = new MutationObserver(sync);
    const resizeObserver = new ResizeObserver(sync);

    mutations.observe(main, { childList: true, subtree: true });
    resizeObserver.observe(main);
    window.addEventListener('resize', sync);
    document.fonts?.ready.then(sync);
    sync();

    return () => {
      window.cancelAnimationFrame(frameId);
      mutations.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, [pathname]);
}
