import { useEffect, useState } from 'react';
import {
  getContentModuleError,
  getPreloadedContentModule,
  preloadContentModule,
} from '../../content/moduleCache.js';

export default function AsyncModule({ children, errorFallback, fallback, loader }) {
  const [module, setModule] = useState(() => getPreloadedContentModule(loader));
  const [error, setError] = useState(() => getContentModuleError(loader));

  useEffect(() => {
    let cancelled = false;

    preloadContentModule(loader)
      .then((loadedModule) => {
        if (!cancelled) setModule(loadedModule);
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError);
      });

    return () => {
      cancelled = true;
    };
  }, [loader]);

  if (import.meta.env.SSR) return children(loader());
  if (error) return errorFallback;
  return module ? children(module) : fallback;
}
