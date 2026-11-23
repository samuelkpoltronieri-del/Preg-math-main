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
// ─────────────────────────────────────────────────────────────────────────────
// Q1 | Por que usar require() e guardar em QuestaoTema?
// R:  O require retorna o objeto definido no module.exports de buscaModel.js
//     (linhas 224-233 daquele arquivo). QuestaoTema é só um apelido (alias).
//     console.log(QuestaoTema) mostraria: { listarTodos: [Function], ... }
// ─────────────────────────────────────────────────────────────────────────────
const QuestaoTema = require('../models/buscaModel');

// ============================================================
// FUNÇÃO: listarTodos
// ROTA: GET /busca/questoes-tema
// DESCRIÇÃO: Retorna todas as questões com paginação.
// QUERY PARAMS: ?page=1&limit=10
// ============================================================
async function listarTodos(req, res) {
    // ─────────────────────────────────────────────────────────────────────────
    // Q2 | O que é { page, limit } = req.query? O que acontece sem parâmetros?
    // R:  É desestruturação de objeto: extrai req.query.page e req.query.limit.
    //     req.query é criado pelo Express com os pares chave=valor após o ?
    //     Sem parâmetros: req.query={}, page=undefined, limit=undefined.
    //     Isso não quebra: buscaModel.js (linha 64) usa parseInt(limit)||10
    //     para aplicar valores padrão (10 itens, página 1) quando undefined.
    // ─────────────────────────────────────────────────────────────────────────
    const { page, limit } = req.query;
    try {
        // O alias QuestaoTema é usado aqui para acessar a função do Model
        const dados = await QuestaoTema.listarTodos(page, limit); // ← Q1: QuestaoTema.listarTodos = função exportada pelo Model
        // ─────────────────────────────────────────────────────────────────────
        // Q3 | Por que return antes de res.status(200).json(dados)?
        // R:  O return faz duas coisas: envia a resposta E encerra a função.
        //     Sem ele, se houvesse outro res.json() abaixo, o Node tentaria
        //     enviar uma segunda resposta, causando: "Cannot set headers after
        //     they are sent to the client". O encadeamento .status().json() é
        //     "method chaining": .status() retorna o próprio res, permitindo
        //     chamar .json() em seguida para definir o código HTTP e o corpo.
        // ─────────────────────────────────────────────────────────────────────
        return res.status(200).json(dados);
    } catch (error) {
        // ─────────────────────────────────────────────────────────────────────
        // Q4 | Por que error.message e não error diretamente?
        // R:  error é o objeto completo (com .stack, .code, .name).
        //     Passar error no JSON resulta em {} pois Error não serializa.
        //     error.message é o texto descritivo (ex: "relation does not exist").
        //     ATENÇÃO: em produção, isso pode vazar detalhes do banco. O ideal
        //     seria logar internamente e retornar uma mensagem genérica ao cliente.
        // ─────────────────────────────────────────────────────────────────────
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
    // ─────────────────────────────────────────────────────────────────────────
    // Q5 | Diferença entre req.params e req.query?
    // R:  req.params → segmentos dinâmicos da ROTA (definidos com : no Route,
    //     ex: /filtrar/:tema faz req.params = { tema: 'Algebra' }).
    //     req.query → pares chave=valor após o ? na URL
    //     (ex: ?page=2 faz req.query = { page: '2' }).
    //     Para /busca/questoes-tema/filtrar/Algebra?page=2:
    //       req.params = { tema: 'Algebra' }
    //       req.query  = { page: '2' }
    //     Todos os valores chegam como STRING — por isso buscaModel.js usa parseInt().
    // ─────────────────────────────────────────────────────────────────────────
    const { tema } = req.params;
    const { page, limit } = req.query;
    try {
        if (!tema) {
            return res.status(400).json({ message: 'O parâmetro "tema" é obrigatório.' });
        }
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
    const { vestibular } = req.params;
    const { page, limit } = req.query;
    try {
        if (!vestibular) {
            return res.status(400).json({ message: 'O parâmetro "vestibular" é obrigatório.' });
        }
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
    const { vestibular, tema } = req.params;
    const { page, limit } = req.query;
    try {
        // ─────────────────────────────────────────────────────────────────────
        // Q6 | Por que || e não && na validação dos dois parâmetros?
        // R:  || (OU) retorna 400 se QUALQUER UM dos dois estiver faltando.
        //     Com && (E), só erraria se os DOIS faltassem — faltando apenas um,
        //     o código passaria e enviaria undefined ao banco, causando erro 500.
        //     || é correto porque ambos os parâmetros são obrigatórios para
        //     esta rota. Sem vestibular OU sem tema → a busca não faz sentido.
        // ─────────────────────────────────────────────────────────────────────
        if (!vestibular || !tema) {
            return res.status(400).json({ message: 'Os parâmetros "vestibular" e "tema" são obrigatórios.' });
        }
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
    // ─────────────────────────────────────────────────────────────────────────
    // Q7 | Por que parseInt() aqui se o Model já faz parseInt() de novo?
    // R:  É um parseInt() duplo — redundância inofensiva. O Controller pré-
    //     converte para passar um valor mais limpo. parseInt(parseInt('5'))=5.
    //     Comportamento do parseInt():
    //       '5'     → 5     (inteiro direto)
    //       '3.7'   → 3     (TRUNCA, não arredonda!)
    //       'cinco' → NaN   (texto → NaN, e NaN || 1 assume padrão 1)
    //       ''      → NaN   (idem)
    // ─────────────────────────────────────────────────────────────────────────
    const quantidade = parseInt(req.query.quantidade) || 1;
    try {
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
    const { vestibular } = req.params;
    const quantidade = parseInt(req.query.quantidade) || 1;

    try {
        if (!vestibular) {
            return res.status(400).json({ message: 'O parâmetro "vestibular" é obrigatório.' });
        }
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
    const quantidade = parseInt(req.params.quantidade) || 1;
    try {
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
    const { id } = req.params;

    // ─────────────────────────────────────────────────────────────────────────
    // Q8 | !id não verifica se o id é número válido. O que acontece com /id/abc?
    // R:  !id só detecta ausência (undefined, null, ''). 'abc' passa no !id.
    //     O Model então executa WHERE q.idQ = 'abc', e o PostgreSQL tenta
    //     converter 'abc' para INTEGER → falha. O catch retorna erro 500,
    //     quando deveria ser 400. O fix correto seria:
    //       const id = parseInt(req.params.id);
    //       if (isNaN(id) || id <= 0) return res.status(400).json(...)
    // ─────────────────────────────────────────────────────────────────────────
    if (!id) return res.status(400).json({ message: 'O parâmetro "id" é obrigatório.' });

    try {
        const dado = await QuestaoTema.listarPorId(id);

        // ─────────────────────────────────────────────────────────────────────
        // Q9 | O que o Model retorna quando a questão não existe? Por que !dado?
        // R:  buscaModel.js (linha 217) retorna: result.rows[0] || null
        //     Se não existe: rows[0] = undefined → undefined || null = null.
        //     !null = true → entra no if → retorna 404. Correto!
        //     Se retornasse [] (array vazio): ![] = false (array é TRUTHY!)
        //     → o if não dispararia → retornaria 200 OK vazio. Por isso
        //     o Model usa null e não [] para indicar "não encontrado".
        // ─────────────────────────────────────────────────────────────────────
        if (!dado) return res.status(404).json({ message: 'Questão não encontrada.' });

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
    const { palavra } = req.query;

    if (!palavra) {
        return res.status(400).json({ message: 'O parâmetro de query "palavra" é obrigatório.' });
    }

    const { page, limit } = req.query;
    try {
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