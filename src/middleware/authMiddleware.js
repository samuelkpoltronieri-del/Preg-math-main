const jwt = require('jsonwebtoken');

// Middleware responsável por verificar se o usuário
// enviou um JWT válido antes de acessar uma rota protegida.
function verificarToken(req, res, next) {

  // Obtém o cabeçalho Authorization da requisição.
  // É nele que normalmente o JWT é enviado.
  const authHeader = req.headers.authorization;

  // Verifica se o cabeçalho existe e se utiliza
  // o padrão "Bearer <token>".
  if (!authHeader || !authHeader.startsWith('Bearer ')) {

    // Caso o token não seja enviado,
    // impede o acesso à rota.
    return res.status(401).json({
      mensagem: 'Token não fornecido'
    });

  }

  // Separa apenas o token,
  // removendo a palavra "Bearer".
  const token = authHeader.split(' ')[1];

  try {

    // Busca a mesma chave secreta utilizada
    // para gerar o JWT no authController.
    const secret =
      process.env.JWT_SECRET ||
      'secret_jwt_default';

    // Verifica se o token:
    // - foi criado pelo servidor;
    // - não foi alterado;
    // - ainda está dentro do prazo de validade.
    const payload = jwt.verify(token, secret);

    // Caso o token seja válido,
    // salva as informações do usuário na requisição.
    // Assim, as próximas funções poderão utilizá-las.
    req.user = payload;

    // Libera o acesso para a próxima função da rota.
    next();

  } catch (erro) {

    // Caso o token seja inválido ou tenha expirado,
    // bloqueia o acesso.
    return res.status(401).json({
      mensagem: 'Token inválido ou expirado'
    });

  }

}

// Exporta o middleware para ser utilizado nas rotas protegidas.
module.exports = {
  verificarToken
};