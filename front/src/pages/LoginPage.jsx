import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Preencha e-mail e senha para continuar.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password: password.trim(),
      });

      localStorage.setItem('pregmath_token', response.data.token);
      navigate('/home');
    } catch (err) {
      const mensagem = err?.response?.data?.mensagem || 'Falha ao fazer login. Verifique suas credenciais.';
      setError(mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles['login-page']}>
      <section className={styles['login-card']}>
        <h1>Crie sua conta!</h1>
        <form className={styles['login-form']} onSubmit={handleSubmit}>
          <label>
            <span>E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Digite seu e-mail"
              required
            />
          </label>

          <label>
            <span>Senha</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </label>

          {error && <p className={styles['login-error']}>{error}</p>}

          <button type="submit" className={styles['login-submit']} disabled={loading}>
            {loading ? 'Carregando...' : 'fazer cadastro'}
          </button>
        </form>
      </section>
    </main>
  );
}
