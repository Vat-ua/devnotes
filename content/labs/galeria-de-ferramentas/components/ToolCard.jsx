import ToolDetails from './ToolDetails.jsx';

export default function ToolCard({
  name,
  category,
  description,
  tags,
  useCases,
  featured = false,
}) {
  return (
    <article className={`gallery-card ${featured ? 'is-featured' : ''}`}>
      <header className="gallery-card-heading">
        <span className="gallery-category">{category}</span>
        {featured && <span className="gallery-featured">Destaque</span>}
      </header>

      <h3>{name}</h3>
      <p>{description}</p>

      <ul className="gallery-tags" aria-label={`Tópicos relacionados a ${name}`}>
        {tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>

      <ToolDetails name={name} useCases={useCases} />
    </article>
  );
}
