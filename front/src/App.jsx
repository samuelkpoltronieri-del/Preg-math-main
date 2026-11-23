import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Topbar from './components/Topbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SimuladoPage from './pages/SimuladoPage';
import VideoAulasPage from './pages/VideoAulasPage';
import ThemePage from './pages/ThemePage';
import LoginPage from './pages/LoginPage';
import './App.css';

function RequireAuth({ children }) {
  const token = localStorage.getItem('pregmath_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppRoutes() {
  const location = useLocation();
  const hideShell = location.pathname === '/login' || location.pathname === '/';

  return (
    <div className="app-container">
      {!hideShell && <Topbar />}
      <main>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/home"
            element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            }
          />
          <Route
            path="/simulado"
            element={
              <RequireAuth>
                <SimuladoPage />
              </RequireAuth>
            }
          />
          <Route
            path="/video-aulas"
            element={
              <RequireAuth>
                <VideoAulasPage />
              </RequireAuth>
            }
          />
          <Route
            path="/temas"
            element={
              <RequireAuth>
                <ThemePage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideShell && <Footer />}
    </div>
  );
}

function App() {
  return <AppRoutes />;
}

export default App;
