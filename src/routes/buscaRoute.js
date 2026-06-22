// ============================================================
// BUSCA ROUTE - Rotas de Busca de Questões
// ============================================================
// Define todos os endpoints HTTP para consulta de questões.
// Este router é montado com o prefixo '/busca' no app.js.
// Portanto, todas as rotas aqui ficam acessíveis em /busca/...
//
// ATENÇÃO: A ordem das rotas importa no Express!
// Rotas mais específicas (ex: /aleatorias, /busca, /id/:id)
// devem vir ANTES de rotas mais genéricas (ex: /filtrar/:tema),
// pois o Express para na primeira rota que casar com a URL.
// ============================================================

// Cria o roteador Express e importa o Controller de busca
const express = require('express');
const router = express.Router();
const buscaController = require('../controllers/buscaController');

// ============================================================
// GET /busca/questoes-tema
// Retorna todas as questões do banco com suporte a paginação.
// Query params opcionais: ?page=1&limit=10
// ============================================================
router.get('/questoes-tema', buscaController.listarTodos);

// ============================================================
// GET /busca/questoes-tema/id/:id
// Retorna uma questão específica pelo seu ID numérico.
// Exemplo: GET /busca/questoes-tema/id/42
// ============================================================
router.get('/questoes-tema/id/:id', buscaController.listarPorId);

// ============================================================
// GET /busca/questoes-tema/filtrar/:tema
// Filtra questões por tema usando correspondência parcial (ILIKE).
// Exemplo: GET /busca/questoes-tema/filtrar/Álgebra
// ============================================================
router.get('/questoes-tema/filtrar/:tema', buscaController.listarPorTema);

// ============================================================
// GET /busca/questoes-tema/vestibular/:vestibular
// Filtra questões pelo nome do vestibular (FUVEST, ENEM, etc).
// Exemplo: GET /busca/questoes-tema/vestibular/FUVEST
// ============================================================
router.get('/questoes-tema/vestibular/:vestibular', buscaController.listarPorVestibular);

// ============================================================
// GET /busca/questoes-tema/tema/:tema
// Alias (alternativa) para a rota /filtrar/:tema.
// Permite duas formas de acessar o mesmo filtro por tema.
// Exemplo: GET /busca/questoes-tema/tema/Geometria
// ============================================================
router.get('/questoes-tema/tema/:tema', buscaController.listarPorTema);

// ============================================================
// GET /busca/questoes-tema/vestibular/:vestibular/tema/:tema
// Filtra questões usando dois critérios: vestibular E tema.
// Exemplo: GET /busca/questoes-tema/vestibular/FUVEST/tema/Álgebra
// ============================================================
router.get('/questoes-tema/vestibular/:vestibular/tema/:tema', buscaController.listarPorVestibularTema);

// ============================================================
// GET /busca/questoes-tema/aleatorias
// Retorna N questões aleatórias de qualquer tema/vestibular.
// Query param opcional: ?quantidade=5 (padrão: 1)
// Exemplo: GET /busca/questoes-tema/aleatorias?quantidade=10
// ============================================================
router.get('/questoes-tema/aleatorias', buscaController.listarAleatorias);

// ============================================================
// GET /busca/questoes-tema/vestibular/:vestibular/aleatorias
// Retorna N questões aleatórias de um vestibular específico.
// Query param opcional: ?quantidade=5 (padrão: 1)
// Exemplo: GET /busca/questoes-tema/vestibular/UNICAMP/aleatorias?quantidade=3
// ============================================================
router.get('/questoes-tema/vestibular/:vestibular/aleatorias', buscaController.listarAleatoriasPorVestibular);

// ============================================================
// GET /busca/questoes-tema/quantidade/:quantidade
// Retorna um número fixo de questões aleatórias.
// A quantidade vem na URL (não como query param).
// Exemplo: GET /busca/questoes-tema/quantidade/5
// ============================================================
router.get('/questoes-tema/quantidade/:quantidade', buscaController.listarQuantidade);

// ============================================================
// GET /busca/questoes-tema/busca?palavra=trigonometria
// Busca questões que contenham a palavra no enunciado ou
// nas alternativas (busca textual com ILIKE no PostgreSQL).
// Query param obrigatório: ?palavra=texto
// ============================================================
router.get('/questoes-tema/busca', buscaController.buscarPorPalavra);

// Exporta o router para ser registrado no app.js
module.exports = router;