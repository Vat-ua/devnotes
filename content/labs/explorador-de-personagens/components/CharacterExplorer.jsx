import { useEffect, useState } from 'react';
import { AlertCircle, LoaderCircle } from 'lucide-react';
import { fetchCharacters } from '../api.js';
import CharacterCard from './CharacterCard.jsx';
import FilterBar from './FilterBar.jsx';

export default function CharacterExplorer() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Todos');
  const [characters, setCharacters] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [state, setState] = useState('loading');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const delay = window.setTimeout(() => {
      setState('loading');

      fetchCharacters({ query: query.trim(), status, signal: controller.signal })
        .then(({ characters: nextCharacters, nextPage: next }) => {
          setCharacters(nextCharacters);
          setNextPage(next);
          setState(nextCharacters.length === 0 ? 'empty' : 'ready');
        })
        .catch((error) => {
          if (error.name !== 'AbortError') setState('error');
        });
    }, 350);

    return () => {
      window.clearTimeout(delay);
      controller.abort();
    };
  }, [query, status, requestKey]);

  async function loadMore() {
    if (!nextPage) return;

    setIsLoadingMore(true);

    try {
      const { characters: moreCharacters, nextPage: next } = await fetchCharacters({
        query: query.trim(),
        status,
        page: nextPage,
      });

      setCharacters((currentCharacters) => [...currentCharacters, ...moreCharacters]);
      setNextPage(next);
    } catch {
      setState('error');
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <div className="character-explorer">
      <FilterBar
        query={query}
        status={status}
        onQueryChange={setQuery}
        onStatusChange={setStatus}
      />

      {state === 'loading' && (
        <p className="character-feedback">
          <LoaderCircle aria-hidden="true" size={18} /> Buscando personagens…
        </p>
      )}

      {state === 'empty' && (
        <p className="character-feedback">
          Nenhum personagem corresponde a essa busca. Tente outro nome ou status.
        </p>
      )}

      {state === 'error' && (
        <p className="character-feedback is-error">
          <AlertCircle aria-hidden="true" size={18} /> Não foi possível falar com a API.
          <button type="button" onClick={() => setRequestKey((currentKey) => currentKey + 1)}>
            Tentar novamente
          </button>
        </p>
      )}

      {state === 'ready' && (
        <>
          <p className="character-result-count">{characters.length} personagens carregados</p>
          <div className="character-grid">
            {characters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
          {nextPage && (
            <button
              className="character-more"
              type="button"
              onClick={loadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? 'Carregando…' : 'Carregar mais'}
            </button>
          )}
        </>
      )}
    </div>
  );
}
