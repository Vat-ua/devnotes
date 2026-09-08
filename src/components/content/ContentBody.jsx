export default function ContentBody({ children, className = '', label }) {
  return (
    <div className={`content-body${className ? ` ${className}` : ''}`}>
      {label && <h2 className="eyebrow">{label}</h2>}
      <div className="prose">{children}</div>
    </div>
  );
}
