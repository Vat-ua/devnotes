const API_URL = 'https://rickandmortyapi.com/api/character';

function toCharacter(apiCharacter) {
  return {
    id: apiCharacter.id,
    name: apiCharacter.name,
    status: apiCharacter.status,
    species: apiCharacter.species,
    origin: apiCharacter.origin.name,
    episodeCount: apiCharacter.episode.length,
    image: apiCharacter.image,
  };
}

export async function fetchCharacters({ query, status, page = 1, signal }) {
  const params = new URLSearchParams({ page: String(page) });

  if (query) params.set('name', query);
  if (status !== 'Todos') params.set('status', status);

  const response = await fetch(`${API_URL}?${params}`, { signal });

  if (response.status === 404) {
    return { characters: [], nextPage: null };
  }

  if (!response.ok) {
    throw new Error('Não foi possível carregar os personagens agora.');
  }

  const data = await response.json();
  const nextPage = data.info.next ? new URL(data.info.next).searchParams.get('page') : null;

  return {
    characters: data.results.map(toCharacter),
    nextPage: nextPage ? Number(nextPage) : null,
  };
}
