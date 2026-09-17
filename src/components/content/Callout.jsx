export default function Callout({ children, title = 'Nota' }) {
  return (
    <aside className="content-callout" role="note">
      <p className="content-callout-title">{title}</p>
      <div className="content-callout-body">{children}</div>
    </aside>
  );
}
