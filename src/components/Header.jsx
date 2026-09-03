import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router';
import { Menu, X } from 'lucide-react';
import BrandMark from './BrandMark.jsx';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const navigationRef = useRef(null);

  function closeMenu() {
    setMenuOpen(false);
  }

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape' && menuOpen) {
        closeMenu();
        menuButtonRef.current?.focus();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) navigationRef.current?.querySelector('a')?.focus();
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <NavLink className="brand" to="/" onClick={closeMenu}>
          <BrandMark />
          DevNotes
        </NavLink>

        <nav
          className={`navigation ${menuOpen ? 'is-open' : ''}`}
          id="main-navigation"
          aria-label="Navegação principal"
          ref={navigationRef}
        >
          <NavLink to="/" onClick={closeMenu}>
            Início
          </NavLink>

          <NavLink to="/articles" onClick={closeMenu}>
            Artigos
          </NavLink>

          <NavLink to="/labs" onClick={closeMenu}>
            Labs
          </NavLink>

          <NavLink to="/sobre" onClick={closeMenu}>
            Sobre
          </NavLink>
        </nav>

        <div className="header-actions">
          <ThemeToggle />

          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            ref={menuButtonRef}
          >
            {menuOpen ? <X aria-hidden="true" size={19} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
