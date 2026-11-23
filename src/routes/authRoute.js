import express from 'express';

const router = express.Router();

// Importa o controller responsável pela autenticação.
const AuthController = require('../controllers/authController');

// =======================================================
// ROTA DE LOGIN
// =======================================================

// Quando uma requisição POST for enviada para "/auth/login",
// ela será encaminhada para a função login() do AuthController.
// A rota apenas direciona a requisição, sem realizar validações
// ou gerar o JWT.
router.post('/login', AuthController.login);

// Exporta as rotas para serem utilizadas pelo servidor principal.
module.exports = router;