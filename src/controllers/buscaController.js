// ============================================================
// BUSCA CONTROLLER - Controlador de Questões
// ============================================================
// Este arquivo contém todas as funções controladoras das rotas
// de busca de questões. Cada função recebe a requisição HTTP,
// extrai os parâmetros necessários, chama o Model correspondente
// e devolve a resposta JSON ao cliente.
//
// Padrão utilizado: MVC (Model-View-Controller)
//   - Model (buscaModel.js): acessa o banco de dados
//   - Controller (este arquivo): interpreta a requisição e responde
//   - View: é o frontend (React/cliente) que consome esta API
// ============================================================

// Importa o Model de busca, que contém as funções que executam
// as queries SQL no banco de dados PostgreSQL.
const QuestaoTema = require('../models/buscaModel');

// ============================================================
// FUNÇÃO: listarTodos
// ROTA: GET /busca/questoes-tema
// DESCRIÇÃO: Retorna todas as questões com paginação.
// QUERY PARAMS: ?page=1&limit=10
// ============================================================
async function listarTodos(req, res) {
    // Extrai os parâmetros de paginação da query string da URL.
    // Exemplo: /questoes-tema?page=2&limit=5
    const { page, limit } = req.query;
    try {
        // Chama o Model para buscar os dados no banco com paginação
        const dados = await QuestaoTema.listarTodos(page, limit);
        // Retorna os dados com status 200 (OK) em formato JSON
        return res.status(200).json(dados);
    } catch (error) {
        // Em caso de erro no banco, retorna status 500 com a mensagem do erro
        return res.status(500).json({ error: error.message });
    }
}

// ============================================================
// FUNÇÃO: listarPorTema
// ROTA: GET /busca/questoes-tema/filtrar/:tema
//       GET /busca/questoes-tema/tema/:tema
// DESCRIÇÃO: Filtra e retorna questões de um tema específico.
// URL PARAMS: :tema (ex: "Álgebra")
// QUERY PARAMS: ?page=1&limit=10
// ============================================================
async function listarPorTema(req, res) {
    // Extrai o tema da URL (parâmetro de rota dinâmico)
    const { tema } = req.params;
    // Extrai os parâmetros de paginação da query string
    const { page, limit } = req.query;
    try {
        // Validação: o tema é obrigatório para esta rota
        if (!tema) {
            return res.status(400).json({ message: 'O parâmetro "tema" é obrigatório.' });
        }
        // Busca no banco as questões que correspondem ao tema informado
        const dados = await QuestaoTema.listarPorTema(tema, page, limit);
        return res.status(200).json(dados);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// ============================================================
// FUNÇÃO: listarPorVestibular
// ROTA: GET /busca/questoes-tema/vestibular/:vestibular
// DESCRIÇÃO: Filtra questões por vestibular (ex: FUVEST, UNICAMP).
// URL PARAMS: :vestibular (nome do vestibular)
// QUERY PARAMS: ?page=1&limit=10
// ============================================================
async function listarPorVestibular(req, res) {
    // Extrai o nome do vestibular da URL
    const { vestibular } = req.params;
    const { page, limit } = req.query;
    try {
        // Validação: o vestibular é obrigatório
        if (!vestibular) {
            return res.status(400).json({ message: 'O parâmetro "vestibular" é obrigatório.' });
        }
        // Busca no banco as questões do vestibular informado
        const dados = await QuestaoTema.listarPorVestibular(vestibular, page, limit);
        return res.status(200).json(dados);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// ============================================================
// FUNÇÃO: listarPorVestibularTema
// ROTA: GET /busca/questoes-tema/vestibular/:vestibular/tema/:tema
// DESCRIÇÃO: Filtra questões combinando vestibular E tema.
//            Permite uma busca mais específica usando dois filtros.
// URL PARAMS: :vestibular, :tema
// QUERY PARAMS: ?page=1&limit=10
// ============================================================
async function listarPorVestibularTema(req, res) {
    // Extrai ambos os parâmetros de rota da URL
    const { vestibular, tema } = req.params;
    const { page, limit } = req.query;
    try {
        // Ambos os parâmetros são obrigatórios para esta rota
        if (!vestibular || !tema) {
            return res.status(400).json({ message: 'Os parâmetros "vestibular" e "tema" são obrigatórios.' });
        }
        // Busca no banco com o duplo filtro: vestibular + tema
        const dados = await QuestaoTema.listarPorVestibularTema(vestibular, tema, page, limit);
        return res.status(200).json(dados);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// ============================================================
// FUNÇÃO: listarAleatorias
// ROTA: GET /busca/questoes-tema/aleatorias?quantidade=5
// DESCRIÇÃO: Retorna N questões escolhidas aleatoriamente do banco.
//            Útil para montar simulados ou testes randômicos.
// QUERY PARAMS: ?quantidade=N (padrão: 1)
// ============================================================
async function listarAleatorias(req, res) {
    // Converte o parâmetro 'quantidade' para inteiro.
    // Se não informado ou inválido, usa 1 como padrão.
    const quantidade = parseInt(req.query.quantidade) || 1;
    try {
        // O Model usa ORDER BY RANDOM() no SQL para embaralhar as questões
        const dados = await QuestaoTema.listarAleatorias(quantidade);
        return res.status(200).json(dados);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// ============================================================
// FUNÇÃO: listarAleatoriasPorVestibular
// ROTA: GET /busca/questoes-tema/vestibular/:vestibular/aleatorias
// DESCRIÇÃO: Retorna N questões aleatórias de um vestibular específico.
// URL PARAMS: :vestibular
// QUERY PARAMS: ?quantidade=N (padrão: 1)
// ============================================================
async function listarAleatoriasPorVestibular(req, res) {
    // Extrai o vestibular da rota e a quantidade desejada da query string
    const { vestibular } = req.params;
    const quantidade = parseInt(req.query.quantidade) || 1;

    try {
        // Validação: o vestibular é obrigatório para filtrar as aleatórias
        if (!vestibular) {
            return res.status(400).json({ message: 'O parâmetro "vestibular" é obrigatório.' });
        }
        // Busca N questões aleatórias do vestibular informado
        const dados = await QuestaoTema.listarAleatoriasPorVestibular(vestibular, quantidade);
        return res.status(200).json(dados);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// ============================================================
// FUNÇÃO: listarQuantidade
// ROTA: GET /busca/questoes-tema/quantidade/:quantidade
// DESCRIÇÃO: Retorna um número específico de questões aleatórias,
//            recebendo a quantidade diretamente na URL (não na query string).
//            É uma alternativa à rota /aleatorias com estilo de URL diferente.
// URL PARAMS: :quantidade
// ============================================================
async function listarQuantidade(req, res) {
    // Aqui a quantidade vem como parâmetro de rota (:quantidade), não query string
    const quantidade = parseInt(req.params.quantidade) || 1;
    try {
        // Reutiliza o mesmo método do Model que busca questões aleatórias
        const dados = await QuestaoTema.listarAleatorias(quantidade);
        return res.status(200).json(dados);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// ============================================================
// FUNÇÃO: listarPorId
// ROTA: GET /busca/questoes-tema/id/:id
// DESCRIÇÃO: Retorna uma questão específica pelo seu ID único.
//            Útil para exibir os detalhes de uma questão individual.
// URL PARAMS: :id (identificador numérico da questão)
// ============================================================
async function listarPorId(req, res) {
    // Extrai o ID da questão dos parâmetros de rota
    const { id } = req.params;

    // Validação rápida antes de ir ao banco: ID deve ser informado
    if (!id) return res.status(400).json({ message: 'O parâmetro "id" é obrigatório.' });

    try {
        // Busca a questão pelo ID no banco de dados
        const dado = await QuestaoTema.listarPorId(id);

        // Se nenhuma questão foi encontrada com esse ID, retorna 404 (Not Found)
        if (!dado) return res.status(404).json({ message: 'Questão não encontrada.' });

        // Retorna a questão encontrada com status 200
        return res.status(200).json(dado);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// ============================================================
// FUNÇÃO: buscarPorPalavra
// ROTA: GET /busca/questoes-tema/busca?palavra=trigonometria
// DESCRIÇÃO: Realiza uma busca por palavra-chave no enunciado da
//            questão e nas alternativas (enunciado e comentário).
//            Útil para encontrar questões por conteúdo textual.
// QUERY PARAMS: ?palavra=texto (obrigatório), ?page=1, ?limit=10
// ============================================================
async function buscarPorPalavra(req, res) {
    // Extrai a palavra de busca da query string
    const { palavra } = req.query;

    // Validação: a palavra é obrigatória para realizar a busca
    if (!palavra) {
        return res.status(400).json({ message: 'O parâmetro de query "palavra" é obrigatório.' });
    }

    // Extrai os parâmetros de paginação da query string
    const { page, limit } = req.query;
    try {
        // Chama o Model com a palavra-chave (o Model adiciona os % para o ILIKE do SQL)
        const dados = await QuestaoTema.buscarPorPalavra(palavra, page, limit);
        return res.status(200).json(dados);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// ============================================================
// EXPORTAR TODAS AS FUNÇÕES
// O arquivo de rotas (buscaRoute.js) importa essas funções
// e as associa a cada endpoint HTTP.
// ============================================================
module.exports = { 
    listarTodos,
    listarPorTema,
    listarPorVestibular,
    listarPorVestibularTema,
    listarAleatorias,
    listarAleatoriasPorVestibular,
    listarQuantidade,
    buscarPorPalavra,
    listarPorId
};