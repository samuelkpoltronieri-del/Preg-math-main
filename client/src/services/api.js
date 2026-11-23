import axios from 'axios';

// Define a URL base da API.
// Caso exista uma variável de ambiente, ela será utilizada.
// Caso contrário, será usado o servidor local.
const baseURL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000';

// Cria uma instância do Axios com configurações padrão.
// Assim todas as requisições utilizam a mesma configuração.
const api = axios.create({
  baseURL,
  headers: {

    // Define que todas as requisições enviarão dados em formato JSON.
    'Content-Type': 'application/json',

  },
});

// Intercepta todas as requisições antes de serem enviadas ao backend.
api.interceptors.request.use((config) => {

  // Procura um JWT salvo no navegador.
  const token = localStorage.getItem('pregmath_token');

  // Se existir um token...
  if (token) {

    // ...ele é enviado automaticamente no cabeçalho Authorization.
    // O prefixo "Bearer" é o padrão utilizado na autenticação JWT.
    config.headers.Authorization = `Bearer ${token}`;

  }

  // Retorna a configuração da requisição para continuar normalmente.
  return config;

});

// Funções relacionadas à autenticação.
export const authApi = {

  // Envia os dados necessários para cadastrar um novo usuário.
  register: (name, email, password) => {
    return api.post('/auth/register', {
      name,
      email,
      password,
    });
  },

  // Envia o e-mail e a senha para o backend realizar o login.
  login: (email, password) => {
    return api.post('/auth/login', {
      email,
      password,
    });
  },

};

// Exporta a instância do Axios para ser utilizada em outras partes da aplicação.
export default api;