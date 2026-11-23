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
// ─────────────────────────────────────────────────────────────────────────────
// Q16 | O que express.Router() retorna? Por que não usar app.get() direto?
// R:   Retorna um "mini-aplicativo Express" isolado — um roteador modular.
//      Sem ele, o app.js ficaria gigante com todas as rotas de todos os módulos.
//      Com Router, cada módulo (busca, auth, etc) cuida das próprias rotas.
//      No app.js (linha 68): app.use('/busca', buscaRoute) monta este router
//      sob o prefixo '/busca'. As rotas aqui não repetem /busca — é herdado.
//      Exemplo: router.get('/questoes-tema') fica acessível em /busca/questoes-tema.
// ─────────────────────────────────────────────────────────────────────────────
const router = express.Router();
const buscaController = require('../controllers/buscaController');

// ============================================================
// GET /busca/questoes-tema
// Retorna todas as questões do banco com suporte a paginação.
// Query params opcionais: ?page=1&limit=10
// ============================================================
// ─────────────────────────────────────────────────────────────────────────────
// Q17 | buscaController.listarTodos sem parênteses — é a função ou o resultado?
// R:   Sem parênteses, passa a PRÓPRIA FUNÇÃO como referência de callback,
//      não o resultado da execução. Funções em JS são "first-class objects".
//      O Express guarda essa referência e a chama automaticamente quando
//      a rota casar, injetando (req, res) como argumentos:
//        buscaController.listarTodos(req, res)
//      O Controller (linha 25) recebe exatamente: async function listarTodos(req, res)
// ─────────────────────────────────────────────────────────────────────────────
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
// ─────────────────────────────────────────────────────────────────────────────
// Q18 | Duas rotas (/filtrar/:tema e /tema/:tema) apontam para o MESMO Controller.
//      Isso é permitido? O Controller sabe de qual rota veio?
// R:   Totalmente permitido — é o padrão "alias de rota" do Express.
//      O Controller (linha 48) extrai apenas: const { tema } = req.params;
//      Como o parâmetro chama-se :tema em AMBAS as rotas, req.params.tema
//      terá o mesmo valor independentemente da rota usada. O Controller
//      não sabe (e não precisa saber) de qual rota a requisição veio.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/questoes-tema/filtrar/:tema', buscaController.listarPorTema);

// ============================================================
// GET /busca/questoes-tema/vestibular/:vestibular
// Filtra questões pelo nome do vestibular (FUVEST, ENEM, etc).
// Exemplo: GET /busca/questoes-tema/vestibular/FUVEST
// ============================================================
router.get('/questoes-tema/vestibular/:vestibular', buscaController.listarPorVestibular);

// ============================================================
// GET /busca/questoes-tema/tema/:tema
// Alias (alternativa) para a rota /filtrar/:tema.       ← Q18
// Permite duas formas de acessar o mesmo filtro por tema.
// Exemplo: GET /busca/questoes-tema/tema/Geometria
// ============================================================
router.get('/questoes-tema/tema/:tema', buscaController.listarPorTema);

// ============================================================
// GET /busca/questoes-tema/vestibular/:vestibular/tema/:tema
// Filtra questões usando dois critérios: vestibular E tema.
// Exemplo: GET /busca/questoes-tema/vestibular/FUVEST/tema/Álgebra
// ============================================================
// ─────────────────────────────────────────────────────────────────────────────
// Q19 | Dois parâmetros dinâmicos (:vestibular e :tema). Como o Express separa?
// R:   O Express usa os segmentos literais como delimitadores:
//        Rota: /questoes-tema/vestibular/:vestibular/tema/:tema
//        URL:  /questoes-tema/vestibular/FUVEST      /tema/Algebra
//      "vestibular" e "tema" são âncoras fixas que separam os parâmetros.
//      Se o tema tiver "/" (ex: "Razões/Proporções"), a rota não casaria (404)
//      porque "/" é separador de segmento. O cliente precisaria usar %2F
//      (URL-encode) ou enviar via query string.
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// Q20 | O que module.exports = router faz? E se não existisse?
// R:   Exporta o objeto router configurado. Sem isso, module.exports seria {}
//      (objeto vazio). No app.js (linha 68), app.use('/busca', buscaRoute)
//      receberia {} que não é middleware válido → erro fatal:
//        "TypeError: Router.use() requires a middleware function"
//      Comparação com buscaController.js (linha 241):
//        Route:      module.exports = router          → exporta UM objeto (router inteiro)
//        Controller: module.exports = { f1, f2, ... } → exporta funções nomeadas individuais
//      O Route exporta um bloco único para montar. O Controller exporta funções
//      separadas para o Route poder pinçar cada uma individualmente.
// ─────────────────────────────────────────────────────────────────────────────
module.exports = router;