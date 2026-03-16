import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/work', label: 'Work' },
  { to: '/projects', label: 'Projects' },
  { to: '/resume', label: 'Resume' },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [theme, setTheme] = useState('dark');
  const isFirstThemeRender = useRef(true);

  // Initialize theme from localStorage with system fallback
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const initialTheme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark';

    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  // Persist and apply theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (isFirstThemeRender.current) {
      isFirstThemeRender.current = false;
      return;
    }

    document.documentElement.classList.add('theme-switching');
    const timeoutId = window.setTimeout(() => {
      document.documentElement.classList.remove('theme-switching');
    }, 320);

    return () => window.clearTimeout(timeoutId);
  }, [theme]);

  // Sticky background on scroll & close menu when scrolling
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      if (menuOpen) setMenuOpen(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [menuOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (!e.target.closest('.nav-menu') && !e.target.closest('.nav-toggle')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [menuOpen]);

  // Close menu and reset scroll position on route change
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} aria-label="Main navigation">
      <div className="nav-container">
        <Link to="/" className="nav-brand" aria-label="Home – Janmejay S Purohit">
          JSP
        </Link>

        <ul className={`nav-menu${menuOpen ? ' open' : ''}`} role="list">
          {NAV_LINKS.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button
            type="button"
            className={`theme-toggle ${theme === 'dark' ? 'is-dark' : 'is-light'}`}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          >
            <span className="theme-icon-wrap" aria-hidden="true">
              <svg className="theme-icon sun" viewBox="0 0 24 24" focusable="false">
                <circle cx="12" cy="12" r="4.2" />
                <path d="M12 2.2v2.4M12 19.4v2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2.2 12h2.4M19.4 12h2.4M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7" />
              </svg>
              <svg className="theme-icon moon" viewBox="0 0 24 24" focusable="false">
                <path d="M20.2 14.7a8.8 8.8 0 1 1-10.9-10.9 7.2 7.2 0 1 0 10.9 10.9Z" />
              </svg>
            </span>
          </button>

          <button
            className={`nav-toggle${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
}
