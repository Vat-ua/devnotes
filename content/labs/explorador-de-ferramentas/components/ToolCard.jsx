export default function ToolCard({ tool }) {
  return (
    <article className="tool-card">
      <span className="tool-category">{tool.category}</span>
      <h3>{tool.name}</h3>
      <p>{tool.description}</p>
      <ul aria-label={`Tópicos relacionados a ${tool.name}`}>
        {tool.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </article>
  );
}
