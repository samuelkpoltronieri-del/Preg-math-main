import React, { createContext, useState, useEffect } from 'react';

// Cria o contexto de autenticação.
// Ele será responsável por compartilhar os dados do usuário
// entre todos os componentes da aplicação.
export const AuthContext = createContext();

export function AuthProvider({ children }) {

  // Armazena os dados do usuário logado.
  const [user, setUser] = useState(null);

  // Armazena o JWT utilizado para autenticação.
  const [token, setToken] = useState(null);

  // Controla o carregamento inicial da autenticação.
  const [loading, setLoading] = useState(true);

  // Executa apenas uma vez quando a aplicação inicia.
  // Seu objetivo é recuperar um login salvo anteriormente.
  useEffect(() => {

    // Procura o token salvo no navegador.
    const storedToken = localStorage.getItem('pregmath_token');

    // Procura os dados do usuário salvos no navegador.
    const storedUser = localStorage.getItem('pregmath_user');

    // Caso existam informações salvas...
    if (storedToken && storedUser) {

      // ...restaura o JWT na aplicação.
      setToken(storedToken);

      // ...restaura também os dados do usuário.
      setUser(JSON.parse(storedUser));

    }

    // Finaliza o carregamento inicial.
    setLoading(false);

  }, []);

  // Função chamada quando o login é realizado com sucesso.
  const login = (userData, jwtToken) => {

    // Atualiza o usuário no estado da aplicação.
    setUser(userData);

    // Armazena o JWT no estado.
    setToken(jwtToken);

    // Salva o JWT no navegador para manter o login.
    localStorage.setItem('pregmath_token', jwtToken);

    // Salva também os dados do usuário.
    localStorage.setItem(
      'pregmath_user',
      JSON.stringify(userData)
    );

  };

  // Permite acessar o sistema como visitante.
  const loginAsGuest = () => {

    // Cria um usuário temporário sem autenticação.
    const guestUser = {
      name: 'Visitante',
      email: '',
      role: 'guest'
    };

    // Atualiza o estado da aplicação.
    setUser(guestUser);

    // Visitantes não possuem JWT.
    setToken(null);

    // Salva apenas os dados do visitante.
    localStorage.setItem(
      'pregmath_user',
      JSON.stringify(guestUser)
    );

    // Remove qualquer token existente.
    localStorage.removeItem('pregmath_token');

  };

  // Realiza o logout do usuário.
  const logout = () => {

    // Remove o usuário da aplicação.
    setUser(null);

    // Remove o JWT da aplicação.
    setToken(null);

    // Remove as informações salvas no navegador.
    localStorage.removeItem('pregmath_token');
    localStorage.removeItem('pregmath_user');

  };

  // Disponibiliza todas essas informações para os componentes filhos.
  return (

    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        loginAsGuest,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}