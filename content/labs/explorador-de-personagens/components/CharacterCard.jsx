export default function CharacterCard({ character }) {
  return (
    <article className="character-card">
      <img src={character.image} alt={`Retrato de ${character.name}`} />
      <div className="character-card-content">
        <span className={`character-status is-${character.status.toLowerCase()}`}>
          {character.status}
        </span>
        <h3>{character.name}</h3>
        <p>{character.species} · {character.origin}</p>
        <small>{character.episodeCount} episódios</small>
      </div>
    </article>
  );
}
