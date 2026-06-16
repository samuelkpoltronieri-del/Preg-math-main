import { useEffect, useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './Topbar.css';

const themeOptions = ['FRAÇÃO', 'PORCENTAGEM', 'RAZÃO E PROPORÇÃO', 'REGRA DE 3'];
const vestibularOptions = ['ENEM', 'PUC', 'FUVEST'];
const themeSlugs = {
  'FRAÇÃO': 'FRACAO',
  PORCENTAGEM: 'PORCENTAGEM',
  'RAZÃO E PROPORÇÃO': 'RAZAO E PROPORCAO',
  'REGRA DE 3': 'REGRA DE 3',
};

export default function Topbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('pregmath_theme') === 'dark');
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'; //Define o atributo data-theme para controle de tema via CSS
    localStorage.setItem('pregmath_theme', darkMode ? 'dark' : 'light'); //Armazena a preferência do usuário no localStorage para mudanças entre sessões
  }, [darkMode]); 
  //Grava a nova preferência de volta no localStorage. Isso garante que a escolha persista mesmo após recarregar a página.
  
  const handleThemeSelect = (tipo, tema) => {
    setOpenMenu(null);
    navigate(`/temas?tipo=${encodeURIComponent(tipo)}&tema=${encodeURIComponent(themeSlugs[tema] || tema)}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="topbar">
      <div className="brand-group">
        <NavLink to="/" className="brand-mark" onClick={() => setOpenMenu(null)}>
          <span>Preg</span>
          <strong>Math</strong>
        </NavLink>
        <button
          type="button"
          className="theme-toggle"
          aria-label="Alternar tema claro e escuro"
          aria-pressed={darkMode}
          onClick={() => setDarkMode((value) => !value)}
        >
          <span />
        </button>
      </div>

      <nav className="nav-links">
        <NavLink to="/simulado">SIMULADO ▾</NavLink>
        {vestibularOptions.map((tipo) => (
          <div className="dropdown" key={tipo}>
            <button type="button" className="dropdown-trigger" onClick={() => setOpenMenu(openMenu === tipo ? null : tipo)}>
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

      <div className="topbar-right">
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button" aria-label="Buscar">
            🔍
          </button>
        </form>

        {user && (
          <div className="profile-section">
            <button
              type="button"
              className="profile-button"
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label="Abrir menu de perfil"
            >
              👤 {user.name || user.email}
            </button>
            {profileOpen && (
              <div className="profile-menu">
                <div className="profile-info">
                  <p><strong>{user.name}</strong></p>
                  <p>{user.email}</p>
                </div>
                <button type="button" className="logout-btn" onClick={handleLogout}>
                  Sair
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
