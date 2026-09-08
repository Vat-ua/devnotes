export default function ContentDisclosure({ children, label = 'Nota', title }) {
  return (
    <details className="editorial-disclosure">
      <summary>
        <span className="editorial-disclosure-heading">
          <span className="editorial-disclosure-label">{label}</span>
          <span>{title}</span>
        </span>
        <span className="editorial-disclosure-indicator" aria-hidden="true" />
      </summary>
      <div className="editorial-disclosure-body prose">{children}</div>
    </details>
  );
}
