import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import Topbar from './components/Topbar';
import HomePage from './pages/HomePage';
import SimuladoPage from './pages/SimuladoPage';
import VideoAulasPage from './pages/VideoAulasPage';
import ThemePage from './pages/ThemePage';
import BuscaPage from './pages/BuscaPage';
import LoginRegisterPage from './pages/LoginRegisterPage';
import './App.css';

// Componente responsável por proteger rotas que exigem login
function ProtectedRoute({ children }) {

  // Obtém informações de autenticação do contexto global
  const { user, loading } = useContext(AuthContext);

  // Enquanto verifica se o usuário está autenticado
  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  // Caso não exista usuário logado, redireciona para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, exibe a página solicitada
  return children;
}

function AppRoutes() {

  // Recupera o usuário atual para controlar exibição de elementos
  const { user } = useContext(AuthContext);

  return (
    <div className="app-container">

      {/* Barra de navegação exibida apenas para usuários logados */}
      {user && <Topbar />}

      <main className="app-main">
        <Routes>

          {/* Página pública de login e cadastro */}
          <Route path="/login" element={<LoginRegisterPage />} />

          {/* Página inicial protegida */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* Página de simulados */}
          <Route
            path="/simulado"
            element={
              <ProtectedRoute>
                <SimuladoPage />
              </ProtectedRoute>
            }
          />

          {/* Página de videoaulas */}
          <Route
            path="/video-aulas"
            element={
              <ProtectedRoute>
                <VideoAulasPage />
              </ProtectedRoute>
            }
          />

          {/* Página de temas de estudo */}
          <Route
            path="/temas"
            element={
              <ProtectedRoute>
                <ThemePage />
              </ProtectedRoute>
            }
          />

          {/* Página de busca de questões */}
          <Route
            path="/busca"
            element={
              <ProtectedRoute>
                <BuscaPage />
              </ProtectedRoute>
            }
          />

          {/* 
            Rota coringa:
            qualquer URL inexistente será redirecionada.
            Se estiver logado vai para Home.
            Caso contrário vai para Login.
          */}
          <Route
            path="*"
            element={<Navigate to={user ? '/' : '/login'} replace />}
          />

        </Routes>
      </main>

      {/* Rodapé exibido apenas para usuários autenticados */}
      {user && (
        <footer className="site-footer">
          <p>© 2026 SESI Vinhedo - CE 242. Todos os direitos reservados.</p>
          <p>Desenvolvido por alunos da Instituição SESI Vinhedo-Ce242.</p>
        </footer>
      )}
    </div>
  );
}

// Componente principal da aplicação
function App() {
  return (

    // Disponibiliza os dados de autenticação para toda a aplicação
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;