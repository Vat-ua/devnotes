import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") closeMenu();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <NavLink className="brand" to="/" onClick={closeMenu}>
          <span className="brand-mark">#</span>
          <span>DevNotes</span>
        </NavLink>

        <div className="header-actions">
          <ThemeToggle />

          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" size={19} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </div>

        <nav
          className={`navigation ${menuOpen ? "is-open" : ""}`}
          id="main-navigation"
          aria-label="Navegação principal"
        >
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink to="/articles" onClick={closeMenu}>
            Articles
          </NavLink>

          <NavLink to="/labs" onClick={closeMenu}>
            Labs
          </NavLink>

          <NavLink to="/sobre" onClick={closeMenu}>
            Sobre
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
