// ============================================================
// BUSCA MODEL - Modelo de Acesso ao Banco de Dados
// ============================================================
// Este arquivo é responsável por toda a comunicação com o
// banco de dados PostgreSQL para consultas de questões.
// Cada função monta uma query SQL parametrizada e a executa
// usando o pool de conexões importado do database.js.
//
// Segurança: todas as queries usam parâmetros ($1, $2, ...)
// para evitar SQL Injection — nunca concatenamos strings direto.
// ============================================================

// Importa o pool de conexões configurado em database.js
const pool = require('../config/database');

// ============================================================
// BASE QUERY (baseAggregate)
// ============================================================
// Esta é a query SQL base usada por quase todas as funções.
// Ela realiza um JOIN entre 4 tabelas:
//   - Questoes (q): dados principais da questão
//   - Alternativas (a): opções de resposta de cada questão
//   - Vestibulares (v): nome do vestibular (FUVEST, ENEM, etc)
//   - Temas (t): tema da questão (Álgebra, Geometria, etc)
//
// json_agg() agrega todas as alternativas de uma questão em
// um único array JSON, evitando múltiplas linhas por questão.
// ORDER BY a.id_alt garante que as alternativas sejam retornadas
// sempre na mesma ordem (a, b, c, d, e).
//
// LEFT JOIN é usado para garantir que questões sem alternativas
// ou sem tema/vestibular associado ainda apareçam nos resultados.
// ============================================================
const baseAggregate = `
SELECT
  q.idQ,
  q.enunciado,
  q.Dificuldade,
  q.linkk,
  q.imgQ,
  v.nome_V,
  t.nome_T,
  json_agg(json_build_object('id_alt', a.id_alt, 'enunciado', a.Enunciado, 'validacao', a.Validacao, 'comentario', a.Comentario) ORDER BY a.id_alt) AS alternativas
FROM Questoes q
LEFT JOIN Alternativas a ON a.idQuestoes = q.idQ
LEFT JOIN Vestibulares v ON q.idVestibulares = v.idV
LEFT JOIN Temas t ON q.idTemas = t.idT
`

// ============================================================
// FUNÇÃO AUXILIAR: buildLimitOffset
// ============================================================
// Calcula os valores de LIMIT e OFFSET para paginação SQL.
//   - LIMIT: quantos registros retornar por página
//   - OFFSET: quantos registros pular (início da página)
//
// Exemplo: page=2, limit=10 → LIMIT 10 OFFSET 10
//          (pula os 10 primeiros e retorna do 11º ao 20º)
//
// Math.max(1, ...) garante valores mínimos de 1,
// evitando limite 0 ou página 0 que causariam resultados errados.
// ============================================================
function buildLimitOffset(page, limit) {
    const l = Math.max(1, parseInt(limit) || 10); // Limite padrão: 10 itens por página
    const p = Math.max(1, parseInt(page) || 1);   // Página padrão: 1 (primeira página)
    const offset = (p - 1) * l;                   // Calcula quantos registros pular
    return { limit: l, offset };
}

// ============================================================
// FUNÇÃO: listarTodos
// Retorna todas as questões com paginação.
// Parâmetros: page (número da página), limit (itens por página)
// ============================================================
async function listarTodos(page, limit) {
    // Calcula os valores de paginação
    const { limit: l, offset } = buildLimitOffset(page, limit);

    // Adiciona à base query: agrupamento, ordenação e paginação.
    // GROUP BY é necessário por causa do json_agg() na base query.
    // ORDER BY q.idQ garante uma ordem consistente nos resultados.
    const sql = baseAggregate + '\nGROUP BY q.idQ, v.nome_V, t.nome_T ORDER BY q.idQ LIMIT $1 OFFSET $2';

    // Executa a query com os parâmetros de paginação
    // $1 = limite, $2 = offset (prevenção contra SQL Injection)
    const result = await pool.query(sql, [l, offset]);

    // Retorna apenas o array de linhas do resultado
    return result.rows;
}

// ============================================================
// FUNÇÃO: listarPorTema
// Filtra questões por tema usando ILIKE (case-insensitive).
// ILIKE é como LIKE mas ignora maiúsculas/minúsculas no PostgreSQL.
// Parâmetros: nomeTema, page, limit
// ============================================================
async function listarPorTema(nomeTema, page, limit) {
    const { limit: l, offset } = buildLimitOffset(page, limit);

    // WHERE t.nome_T ILIKE $1 filtra pelo nome do tema.
    // ILIKE permite que "álgebra", "Álgebra" e "ÁLGEBRA" retornem o mesmo resultado.
    const sql = baseAggregate + '\nWHERE t.nome_T ILIKE $1 GROUP BY q.idQ, v.nome_V, t.nome_T ORDER BY q.idQ LIMIT $2 OFFSET $3';

    // $1 = nomeTema, $2 = limite, $3 = offset
    const result = await pool.query(sql, [nomeTema, l, offset]);
    return result.rows;
}

// ============================================================
// FUNÇÃO: listarPorVestibular
// Filtra questões pelo nome do vestibular usando ILIKE.
// Parâmetros: vestibular (nome), page, limit
// ============================================================
async function listarPorVestibular(vestibular, page, limit) {
    const { limit: l, offset } = buildLimitOffset(page, limit);

    // WHERE v.nome_V ILIKE $1 filtra pelo nome do vestibular
    const sql = baseAggregate + '\nWHERE v.nome_V ILIKE $1 GROUP BY q.idQ, v.nome_V, t.nome_T ORDER BY q.idQ LIMIT $2 OFFSET $3';
    const result = await pool.query(sql, [vestibular, l, offset]);
    return result.rows;
}

// ============================================================
// FUNÇÃO: listarPorVestibularTema
// Filtra questões aplicando dois critérios: vestibular E tema.
// Parâmetros: vestibular, tema, page, limit
// ============================================================
async function listarPorVestibularTema(vestibular, tema, page, limit) {
    const { limit: l, offset } = buildLimitOffset(page, limit);

    // AND combina os dois filtros: só retorna questões que
    // atendam simultaneamente ao vestibular E ao tema informados.
    const sql = baseAggregate + '\nWHERE v.nome_V ILIKE $1 AND t.nome_T ILIKE $2 GROUP BY q.idQ, v.nome_V, t.nome_T ORDER BY q.idQ LIMIT $3 OFFSET $4';

    // $1 = vestibular, $2 = tema, $3 = limite, $4 = offset
    const result = await pool.query(sql, [vestibular, tema, l, offset]);
    return result.rows;
}

// ============================================================
// FUNÇÃO: listarAleatorias
// Retorna N questões escolhidas aleatoriamente do banco.
// Usa CTE (WITH sel AS ...) para primeiro sortear os IDs
// e depois buscar os dados completos apenas das selecionadas.
// Parâmetros: quantidade (número de questões desejadas)
// ============================================================
async function listarAleatorias(quantidade) {
    // Garante que a quantidade seja pelo menos 1
    const q = Math.max(1, parseInt(quantidade) || 1);

    // A CTE (Common Table Expression) 'sel' seleciona N IDs aleatórios.
    // ORDER BY RANDOM() embaralha as questões no PostgreSQL.
    // O resultado de 'sel' é então usado para filtrar a query principal.
    const sql = `WITH sel AS (SELECT idQ FROM Questoes ORDER BY RANDOM() LIMIT $1)
    ${baseAggregate} WHERE q.idQ IN (SELECT idQ FROM sel) GROUP BY q.idQ, v.nome_V, t.nome_T ORDER BY q.idQ`;
    const result = await pool.query(sql, [q]);
    return result.rows;
}

// ============================================================
// FUNÇÃO: listarAleatoriasPorVestibular
// Retorna N questões aleatórias filtradas por vestibular.
// A subquery na CTE restringe o pool de questões ao vestibular.
// Parâmetros: vestibular (nome), quantidade
// ============================================================
async function listarAleatoriasPorVestibular(vestibular, quantidade) {
    const q = Math.max(1, parseInt(quantidade) || 1);

    // A subquery busca o idV do vestibular pelo nome, depois
    // a CTE sorteia N IDs aleatórios apenas desse vestibular.
    const sql = `WITH sel AS (SELECT idQ FROM Questoes WHERE idVestibulares = (SELECT idV FROM Vestibulares WHERE nome_V ILIKE $1) ORDER BY RANDOM() LIMIT $2)
    ${baseAggregate} WHERE q.idQ IN (SELECT idQ FROM sel) GROUP BY q.idQ, v.nome_V, t.nome_T ORDER BY q.idQ`;

    // $1 = vestibular, $2 = quantidade
    const result = await pool.query(sql, [vestibular, q]);
    return result.rows;
}

// ============================================================
// FUNÇÃO: buscarPorPalavra
// Realiza busca textual em múltiplas colunas usando ILIKE.
// Busca no enunciado da questão, no enunciado das alternativas
// e no comentário das alternativas.
// Parâmetros: palavra (texto a buscar), page, limit
// ============================================================
async function buscarPorPalavra(palavra, page, limit) {
    const { limit: l, offset } = buildLimitOffset(page, limit);

    // Adiciona % antes e depois para busca "contém" (substring match).
    // Exemplo: palavra="trigono" → like="%trigono%"
    // Isso encontra "trigonometria", "trigonométrico", etc.
    const like = `%${palavra}%`;

    // OR busca em qualquer um dos três campos:
    // enunciado da questão, enunciado das alternativas, ou comentário
    const sql = baseAggregate + '\nWHERE q.enunciado ILIKE $1 OR a.Enunciado ILIKE $1 OR a.Comentario ILIKE $1 GROUP BY q.idQ, v.nome_V, t.nome_T ORDER BY q.idQ LIMIT $2 OFFSET $3';

    // $1 = like (com %), $2 = limite, $3 = offset
    const result = await pool.query(sql, [like, l, offset]);
    return result.rows;
}

// ============================================================
// FUNÇÃO: listarPorId
// Retorna uma única questão pelo ID exato.
// Retorna null se nenhuma questão for encontrada.
// Parâmetros: id (número inteiro — chave primária da questão)
// ============================================================
async function listarPorId(id) {
    // WHERE q.idQ = $1 filtra pela chave primária — resultado único
    const sql = baseAggregate + '\nWHERE q.idQ = $1 GROUP BY q.idQ, v.nome_V, t.nome_T';
    const result = await pool.query(sql, [id]);

    // result.rows[0] pega o primeiro (e único) resultado.
    // O operador || null retorna null se rows[0] for undefined (questão não existe).
    return result.rows[0] || null;
}

// ============================================================
// EXPORTAR TODAS AS FUNÇÕES
// O Controller (buscaController.js) importa e usa estas funções.
// ============================================================
module.exports = {
    listarTodos,
    listarPorTema,
    listarPorVestibular,
    listarPorVestibularTema,
    listarAleatorias,
    listarAleatoriasPorVestibular,
    buscarPorPalavra,
    listarPorId
};