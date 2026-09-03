import { Outlet, useLocation } from 'react-router';
import { useEffect } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import PageMeta from '../components/PageMeta.jsx';
import { syncCodeBlockTabStops } from '../utils/codeBlockTabStops.js';

export default function AppLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

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

  return (
    <div className="app-shell">
      <PageMeta />
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
