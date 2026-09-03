import { useEffect, useState } from 'react';

export default function AsyncModule({ children, errorFallback, fallback, loader }) {
  const [module, setModule] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    Promise.resolve(loader())
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
