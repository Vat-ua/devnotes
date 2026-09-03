export default function Footer() {
  function scrollToTop() {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';

    window.scrollTo({ top: 0, behavior });
  }

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p className="footer-note">© DevNotes, 2026</p>
        <button className="back-to-top" type="button" onClick={scrollToTop}>
          Voltar <span aria-hidden="true">↑</span>
        </button>
      </div>
    </footer>
  );
}
