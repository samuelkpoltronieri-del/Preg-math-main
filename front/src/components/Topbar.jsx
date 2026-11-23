import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Topbar.css';

const themeOptions = ['FRACAO', 'PORCENTAGEM', 'RAZAO E PROPORCAO', 'REGRA DE 3'];
const vestibularOptions = ['ENEM', 'PUC', 'FUVEST'];

export default function Topbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedMode = localStorage.getItem('pregmath_dark');
    const active = storedMode === '1';
    setDarkMode(active);
    document.body.classList.toggle('dark', active);
  }, []);

  const handleDarkModeToggle = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    localStorage.setItem('pregmath_dark', nextMode ? '1' : '0');
    document.body.classList.toggle('dark', nextMode);
  };

  const handleVestibularClick = (tipo) => {
    setOpenMenu(openMenu === tipo ? null : tipo);
  };

  const handleThemeSelect = (tipo, tema) => {
    setOpenMenu(null);
    navigate(`/temas?tipo=${encodeURIComponent(tipo)}&tema=${encodeURIComponent(tema)}`);
  };

  const handleSearchClick = () => {
    const trimmed = searchInput.trim();
    if (trimmed) {
      navigate(`/temas?palavra=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/');
    }
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pregmath_token');
    navigate('/');
  };

  return (
    <header className="topbar">
      <div className="brand-group">
        <div className="brand-info">
          <button type="button" className="brand-title" onClick={() => navigate('/home')}> 
            <div className="brand-toggle">
              <span className="brand-small">Preg</span>
              <strong>Math</strong>
            </div>
          </button>
          <button type="button" className={`dark-mode-switch ${darkMode ? 'on' : ''}`} onClick={handleDarkModeToggle} aria-pressed={darkMode}>
            <span className="switch-handle" />
          </button>
        </div>
      </div>

      <nav className="nav-links">
        <NavLink to="/simulado">SIMULADO ▾</NavLink>
        {vestibularOptions.map((tipo) => (
          <div className="dropdown" key={tipo}>
            <button type="button" className="dropdown-trigger" onClick={() => handleVestibularClick(tipo)}>
              {tipo} ▾
            </button>
            {openMenu === tipo && (
              <div className="dropdown-menu">
                {themeOptions.map((tema) => (
                  <button key={tema} type="button" className="dropdown-item" onClick={() => handleThemeSelect(tipo, tema)}>
                    {tema}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <NavLink to="/video-aulas">VIDEO-AULAS ▾</NavLink>
      </nav>

      <div className="search-group">
        <input
          type="text"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Buscar por palavra-chave"
          className="search-input"
        />
        <button type="button" className="logout-button" onClick={handleLogout}>
          SAIR
        </button>
      </div>
    </header>
  );
}
