import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function LoginRegisterPage() {

  // Armazena os valores digitados nos campos de login.
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Guarda mensagens de erro para exibição na tela.
  const [error, setError] = useState('');

  // Controla o estado de carregamento durante o login.
  const [loading, setLoading] = useState(false);

  // Controla o tema claro/escuro da página.
  const [darkMode, setDarkMode] = useState(false);

  // Permite navegar entre as páginas da aplicação.
  const navigate = useNavigate();

  // Obtém as funções responsáveis pelo login.
  const { login, loginAsGuest } = useAuth();

  // Atualiza automaticamente o campo alterado pelo usuário.
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Executado quando o formulário é enviado.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpa mensagens de erro anteriores.
    setError('');

    // Informa que o login está sendo processado.
    setLoading(true);

    try {

      // Envia o e-mail e a senha para o backend.
      const response = await authApi.login(
        formData.email,
        formData.password
      );

      // Recupera o token JWT e os dados do usuário enviados pelo servidor.
      const { token, user } = response.data;

      // Salva o usuário e o token no Context e no localStorage.
      login(user, token);

      // Redireciona o usuário para a página inicial.
      navigate('/');

    } catch (err) {

      // Exibe a mensagem enviada pelo backend ou uma mensagem padrão.
      setError(
        err.response?.data?.mensagem ||
        'Erro ao processar requisição'
      );

    } finally {

      // Finaliza o estado de carregamento, independentemente do resultado.
      setLoading(false);

    }
  };

  // Permite acessar o sistema como visitante.
  const handleGuestLogin = () => {

    // Cria um usuário visitante sem gerar JWT.
    loginAsGuest();

    // Redireciona para a página inicial.
    navigate('/');

  };

  return (
    <div className="login-page">

      {/* Barra superior da página */}
      <header className="login-topbar">

        <div className="login-brand-group">

          {/* Logo da aplicação */}
          <div className="login-brand-mark">
            <span>Preg</span>
            <strong>Math</strong>
          </div>

          {/* Botão para alternar entre tema claro e escuro */}
          <button
            type="button"
            className="login-theme-toggle"
            aria-label="Alternar tema claro e escuro"
            aria-pressed={darkMode}
            onClick={() => setDarkMode((v) => !v)}
          >
            <span />
          </button>

        </div>

      </header>

      {/* Área principal da tela de login */}
      <main className="login-content">

        <div className="login-card">

          <h1>Olá, seja bem vindo!</h1>

          <p className="login-subtitle">
            entre na sua conta
          </p>

          {/* Exibe mensagem caso o login falhe */}
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* Formulário de login */}
          <form onSubmit={handleSubmit}>

            {/* Campo de e-mail */}
            <div className="login-field">

              <span className="login-field-icon">
                ✉
              </span>

              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
              />

            </div>

            {/* Campo de senha */}
            <div className="login-field">

              <span className="login-field-icon">
                🔑
              </span>

              <input
                type="password"
                name="password"
                placeholder="Senha"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={loading}
              />

            </div>

            {/* Botão responsável por enviar o formulário */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {/* Enquanto a requisição acontece, informa ao usuário */}
              {loading ? 'Entrando...' : 'fazer login'}
            </button>

          </form>

          {/* Login sem autenticação utilizando perfil visitante */}
          <button
            type="button"
            className="login-guest-btn"
            onClick={handleGuestLogin}
          >
            entrar como visitante
          </button>

        </div>

      </main>

      {/* Rodapé da aplicação */}
      <footer className="login-footer">

        <p>
          © 2026 SESI Vinhedo - CE 242. Todos os direitos reservados.
        </p>

        <p>
          Desenvolvido por alunos da Instituição SESI Vinhedo-Ce242.
        </p>

      </footer>

    </div>
  );
}