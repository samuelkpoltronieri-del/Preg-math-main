const jwt = require('jsonwebtoken');

// ============================================================
// FUNÇÃO: login
// ROTA: POST /auth/login
// DESCRIÇÃO:
// Recebe as credenciais enviadas pelo frontend,
// verifica se estão corretas e gera um token JWT.
// ============================================================
async function login(req, res) {

  // Recebe o e-mail e a senha enviados pelo frontend.
  const { email, password } = req.body;

  // Verifica se os dois campos foram preenchidos.
  // Caso algum esteja vazio, retorna erro 400.
  if (!email || !password) {
    return res.status(400).json({
      mensagem: 'E-mail e senha são obrigatórios'
    });
  }

  try {

    // Busca no arquivo .env o usuário autorizado.
    const authUser = process.env.AUTH_USER;

    // Busca no .env a senha autorizada.
    const authPassword = process.env.AUTH_PASSWORD;

    // Compara os dados enviados pelo usuário
    // com os cadastrados no .env.
    if (email !== authUser || password !== authPassword) {

      // Caso não coincidam, retorna erro de autenticação.
      return res.status(401).json({
        mensagem: 'Credenciais inválidas'
      });

    }

    // Cria o payload do JWT.
    // Essas informações ficarão armazenadas dentro do token.
    const payload = {
      email: authUser,
      role: 'admin'
    };

    // Busca a chave secreta utilizada para assinar o JWT.
    // Caso ela não exista, utiliza uma chave padrão.
    const secret =
      process.env.JWT_SECRET ||
      'secret_jwt_default';

    // Gera o token JWT.
    // O token será assinado usando:
    // - o payload
    // - a chave secreta
    // - validade de 2 horas
    const token = jwt.sign(
      payload,
      secret,
      {
        expiresIn: '2h'
      }
    );

    // Envia o JWT e os dados do usuário para o frontend.
    res.status(200).json({

      token,

      user: {

        name: 'Administrador',
        email: authUser,
        role: 'admin'

      },

    });

  } catch (err) {

    // Caso ocorra algum erro inesperado,
    // registra o erro no console do servidor.
    console.error('Erro no login:', err);

    // Retorna erro interno ao frontend.
    res.status(500).json({
      mensagem: 'Erro interno'
    });

  }

}

// Exporta a função para ser utilizada nas rotas.
module.exports = {
  login,
};
