import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import QuestionCard from '../components/QuestionCard';
import styles from './ThemePage.module.css';

const themeDescriptions = {
  FRACAO: 'Conteúdo sobre fração, operações e exercícios para dominar o assunto.',
  PORCENTAGEM: 'Conteúdo de porcentagem com exemplos práticos e questões de prova.',
  'RAZAO E PROPORCAO': 'Conteúdo de razão e proporção para aprender a resolver com confiança.',
  'REGRA DE 3': 'Conteúdo de regra de 3 simples e composta, com exemplos passo a passo.',
};

const dbThemeNames = {
  FRACAO: 'Fração',
  PORCENTAGEM: 'Porcentagem',
  'RAZAO E PROPORCAO': 'Razão e Proporção',
  'REGRA DE 3': 'Regra de 3',
};

// Detailed content for each theme (rendered when user clicks a theme)
const themeExplanations = {
  FRACAO: (
    <div className={styles['explanation-card']}>
      <h3>Fração: o que é, como calcular, tipos e operações</h3>
      <p>
        A fração é uma forma de representar uma quantidade através de uma divisão. Ela indica em quantas partes iguais um todo foi dividido e quantas dessas partes foram selecionadas.
      </p>
      <p>
        As frações pertencem ao conjunto dos Números Racionais (Q) e aparecem muito em provas como ENEM, FUVEST e PUC.
      </p>

      <h4>Estrutura de uma Fração</h4>
      <p>Uma fração é escrita na forma a/b, sendo composta por:</p>
      <ul>
        <li><strong>a (numerador):</strong> número de partes tomadas ou selecionadas;</li>
        <li><strong>b (denominador):</strong> número total de partes iguais em que o todo foi dividido (b ≠ 0).</li>
      </ul>

      <h4>Tipos de Frações</h4>
      <ul>
        <li><strong>Fração Própria:</strong> numerador menor que o denominador. Ex.: 3/5.</li>
        <li><strong>Fração Imprópria:</strong> numerador maior ou igual ao denominador. Ex.: 7/4.</li>
        <li><strong>Fração Aparente:</strong> numerador múltiplo exato do denominador. Ex.: 6/2 = 3.</li>
        <li><strong>Fração Mista:</strong> parte inteira mais parte fracionária. Ex.: 1 3/4 = 7/4.</li>
      </ul>

      <h4>Operações com Frações</h4>
      <h5>1. Adição e Subtração</h5>
      <p>Se os denominadores são iguais, conserva-se o denominador e soma-se ou subtrai-se o numerador.</p>
      <p><strong>Exemplo:</strong> 5/7 + 1/7 = 6/7.</p>
      <p>Se os denominadores são diferentes, primeiro igualamos usando o MMC.</p>
      <p><strong>Exemplo:</strong> 1/2 + 1/3 = 3/6 + 2/6 = 5/6.</p>

      <h5>2. Multiplicação</h5>
      <p>Multiplica-se numerador por numerador e denominador por denominador.</p>
      <p><strong>Exemplo:</strong> 2/3 · 4/5 = 8/15.</p>

      <h5>3. Divisão</h5>
      <p>Conserva-se a primeira fração e multiplica-se pelo inverso da segunda.</p>
      <p><strong>Exemplo:</strong> 3/4 ÷ 2/5 = 3/4 · 5/2 = 15/8.</p>
    </div>
  ),

  'RAZAO E PROPORCAO': (
    <div className={styles['explanation-card']}>
      <h3>Razão e Proporção: o que são, fórmulas e exemplos</h3>
      <p>
        A razão e a proporção são conceitos matemáticos que estabelecem relações de comparação entre grandezas. Enquanto a razão utiliza a divisão para comparar duas quantidades, a proporção é a igualdade entre duas ou mais razões.
      </p>
      <p>
        Esses conceitos são fundamentais para resolver problemas do dia a dia, como calcular a velocidade de um automóvel, ler mapas em escalas ou calcular a divisão de lucros em uma empresa.
      </p>

      <h4>O que é Razão?</h4>
      <p>
        A razão é o quociente entre dois números. Dados dois números <em>a</em> e <em>b</em> (com <em>b ≠ 0</em>), a razão entre <em>a</em> e <em>b</em> é a fração <strong>a/b</strong> ou <strong>a : b</strong>.
      </p>
      <p>
        Onde:
      </p>
      <ul>
        <li><strong>a</strong> é chamado de <strong>antecedente</strong>;</li>
        <li><strong>b</strong> é chamado de <strong>consequente</strong>.</li>
      </ul>

      <blockquote>
        <p><strong>Exemplo:</strong> Em uma sala existem 15 meninos e 20 meninas. Qual a razão entre o número de meninos e o de meninas?</p>
        <p><strong>Razão = 15/20 = 3/4</strong></p>
      </blockquote>

      <h4>Razões Especiais</h4>
      <ul>
        <li><strong>Velocidade Média:</strong> razão entre distância e tempo, <strong>V<sub>m</sub> = Δs / Δt</strong>.</li>
        <li><strong>Densidade Demográfica:</strong> razão entre habitantes e área, <strong>Densidade = Habitantes / Área</strong>.</li>
        <li><strong>Escala:</strong> razão entre medida no desenho e medida real, <strong>Escala = Medida no desenho / Medida real</strong>.</li>
      </ul>

      <h4>O que é Proporção?</h4>
      <p>
        A proporção é a igualdade entre duas razões. Dizemos que as razões <strong>a/b</strong> e <strong>c/d</strong> são proporcionais se <strong>a/b = c/d</strong>.
      </p>
      <p>
        Nos termos da proporção, <strong>a</strong> e <strong>d</strong> são os <strong>extremos</strong>, enquanto <strong>b</strong> e <strong>c</strong> são os <strong>meios</strong>.
      </p>

      <h4>Propriedade Fundamental da Proporção</h4>
      <p>
        A propriedade mais importante afirma que <strong>o produto dos meios é igual ao produto dos extremos</strong>.
      </p>
      <p><strong>Se a/b = c/d então a · d = b · c</strong></p>

      <blockquote>
        <p><strong>Exemplo:</strong> Verifique se 2/5 e 6/15 formam uma proporção.</p>
        <p>Multiplicando cruzado: 2 · 15 = 30 e 5 · 6 = 30. Como 30 = 30, as razões são proporcionais.</p>
      </blockquote>

      <h4>Grandezas Proporcionais</h4>
      <p>Duas grandezas podem se relacionar de duas maneiras: diretamente proporcionais ou inversamente proporcionais.</p>
      <table className={styles['theme-table']}>
        <thead>
          <tr>
            <th>Tipo de Grandeza</th>
            <th>O que acontece?</th>
            <th>Exemplo Prático</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Diretamente Proporcionais</strong></td>
            <td>Quando uma grandeza aumenta, a outra aumenta na mesma proporção.</td>
            <td>Quanto maior a quantidade de combustível comprada, maior será o valor pago.</td>
          </tr>
          <tr>
            <td><strong>Inversamente Proporcionais</strong></td>
            <td>Quando uma grandeza aumenta, a outra diminui na mesma proporção.</td>
            <td>Quanto maior a velocidade, menor será o tempo de viagem.</td>
          </tr>
        </tbody>
      </table>
    </div>
  ),

  'REGRA DE 3': (
    <div className={styles['explanation-card']}>
      <h3>Regra de Três: simples, composta, como calcular e exemplos</h3>
      <p>
        A regra de três é um processo matemático prático utilizado para resolver problemas que envolvem grandezas proporcionais. A partir de três (ou mais) valores conhecidos, conseguimos determinar o valor de uma incógnita desconhecida.
      </p>
      <p>
        Ela é presença garantida no ENEM, PUC e FUVEST para resolver problemas de escala, produção, tempo e consumo.
      </p>

      <h4>Regra de Três Simples</h4>
      <p>
        É utilizada quando o problema envolve apenas duas grandezas. O passo mais importante é analisar se elas são diretamente ou inversamente proporcionais.
      </p>

      <h5>Grandezas Diretamente Proporcionais (GDP)</h5>
      <p>
        Ocorre quando o aumento de uma grandeza provoca o aumento da outra na mesma proporção.
      </p>
      <p><strong>Como resolver:</strong> monta-se a tabela relacionando as grandezas e multiplica-se em cruz.</p>
      <blockquote>
        <p><strong>Exemplo:</strong> Se 4 canetas custam R$ 12,00, quanto custarão 10 canetas?</p>
        <p>Organizamos as grandezas:</p>
        <p>4 canetas → 12 reais<br />10 canetas → x reais</p>
        <p>Análise: são diretamente proporcionais, pois mais canetas aumentam o preço.</p>
        <p><strong>4 · x = 10 · 12</strong></p>
        <p><strong>4x = 120 → x = 120 / 4 = 30</strong></p>
        <p><strong>Resposta: R$ 30,00</strong></p>
      </blockquote>

      <h5>Grandezas Inversamente Proporcionais (GIP)</h5>
      <p>
        Ocorre quando o aumento de uma grandeza provoca a redução da outra na mesma proporção.
      </p>
      <p><strong>Como resolver:</strong> monta-se a tabela e multiplica-se em linha reta, ou inverte-se os termos antes de cruzar.</p>
      <blockquote>
        <p><strong>Exemplo:</strong> Um carro faz um percurso em 3 horas a 80 km/h. Quanto tempo gastará a 120 km/h?</p>
        <p>Organizamos as grandezas:</p>
        <p>80 km/h → 3 horas<br />120 km/h → x horas</p>
        <p>Análise: são inversamente proporcionais, pois maior velocidade reduz o tempo.</p>
        <p><strong>120 · x = 80 · 3</strong></p>
        <p><strong>120x = 240 → x = 240 / 120 = 2</strong></p>
        <p><strong>Resposta: 2 horas</strong></p>
      </blockquote>

      <h4>Regra de Três Composta</h4>
      <p>
        É utilizada quando o problema envolve três ou mais grandezas. O método ideal é separar o problema em duas categorias: processo e produto.
      </p>
      <p><strong>Processo:</strong> elementos que trabalham ou consomem recursos (operários, horas, máquinas).</p>
      <p><strong>Produto:</strong> resultado final ou objetivo (peças produzidas, área construída, volume produzido).</p>
      <p>
        A fórmula fixa é:
      </p>
      <p><strong>Processo<sub>1</sub> / Produto<sub>1</sub> = Processo<sub>2</sub> / Produto<sub>2</sub></strong></p>
      <p>Use essa divisão para evitar erros de inversão e desenhar menos setas.</p>
    </div>
  ),

  PORCENTAGEM: (
    <div className={styles['explanation-card']}>
      <h3>Porcentagem: o que é, como calcular e exemplos</h3>
      <p>
        A porcentagem representa uma razão cujo denominador é igual a 100. Ela indica uma parte de um total de 100 partes e é utilizada para expressar descontos, acréscimos, taxas de juros e dados estatísticos.
      </p>
      <p>
        O símbolo utilizado para representar a porcentagem é o <strong>%</strong>, lido como "por cento".
      </p>

      <h4>Como representar a porcentagem?</h4>
      <p>Uma taxa percentual pode ser escrita de três formas diferentes: forma percentual, forma fracionária e forma decimal.</p>
      <table className={styles['theme-table']}>
        <thead>
          <tr>
            <th>Forma Percentual</th>
            <th>Forma Fracionária</th>
            <th>Forma Decimal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>20%</td>
            <td>20/100</td>
            <td>0,2</td>
          </tr>
          <tr>
            <td>5%</td>
            <td>5/100</td>
            <td>0,05</td>
          </tr>
          <tr>
            <td>115%</td>
            <td>115/100</td>
            <td>1,15</td>
          </tr>
        </tbody>
      </table>

      <h4>Como calcular a porcentagem?</h4>
      <p>Existem diferentes métodos para calcular a porcentagem de um valor. Abaixo estão os três métodos mais práticos utilizados nos vestibulares.</p>

      <h5>Método 1: Multiplicação Direta (Transformação em Fração)</h5>
      <p>Para encontrar a porcentagem de um número, basta multiplicar a taxa percentual pelo valor total.</p>
      <blockquote>
        <p><strong>Exemplo:</strong> Quanto é 25% de 80?</p>
        <p>Transformamos 25% na fração 25/100. Substituímos "de" por multiplicação:</p>
        <p><strong>(25/100) · 80 = 2000/100 = 20</strong></p>
        <p>Logo, 25% de 80 é igual a <strong>20</strong>.</p>
      </blockquote>

      <h5>Método 2: Utilizando a Forma Decimal</h5>
      <p>Este método é excelente para acelerar os cálculos mentais.</p>
      <blockquote>
        <p><strong>Exemplo:</strong> Quanto é 15% de 120?</p>
        <p>Transformamos 15% em número decimal: 0,15.</p>
        <p><strong>0,15 · 120 = 18</strong></p>
        <p>Logo, 15% de 120 é igual a <strong>18</strong>.</p>
      </blockquote>

      <h5>Método 3: Regra de Três Simples</h5>
      <p>Ideal para descobrir qual é a taxa percentual que um número representa em relação a outro.</p>
      <blockquote>
        <p><strong>Exemplo:</strong> Em uma sala com 40 alunos, 12 foram reprovados. Qual é a porcentagem de alunos reprovados?</p>
        <p>Organizamos as grandezas:</p>
        <p><strong>40 alunos → 100%</strong><br /><strong>12 alunos → x</strong></p>
        <p>Multiplicando cruzado:</p>
        <p><strong>40x = 12 · 100 → 40x = 1200 → x = 1200/40 = 30%</strong></p>
        <p>Logo, a taxa de reprovação foi de <strong>30%</strong>.</p>
      </blockquote>

      <h4>Aumentos e Descontos Percentuais</h4>
      <p>É comum a cobrança de acréscimos ou descontos sobre um valor original. Para ganhar tempo, utilizamos os Fatores de Multiplicação.</p>

      <h5>Fator de Aumento</h5>
      <p>Quando um valor sofre um acréscimo, somamos a taxa de aumento a 1.</p>
      <p><strong>Fator = 1 + i</strong> (onde <em>i</em> é a taxa decimal).</p>
      <p><strong>Exemplo:</strong> Um produto de R$ 150,00 teve aumento de 20%. Taxa decimal: 0,20.</p>
      <p><strong>Fator de aumento = 1 + 0,20 = 1,20</strong></p>
      <p><strong>Novo valor = 150 · 1,20 = R$ 180,00</strong></p>

      <h5>Fator de Desconto</h5>
      <p>Quando um valor sofre uma redução, subtraímos a taxa de desconto de 1.</p>
      <p><strong>Fator = 1 - i</strong> (onde <em>i</em> é a taxa decimal).</p>
      <p><strong>Exemplo:</strong> Roupa de R$ 200,00 com desconto de 15%. Taxa decimal: 0,15.</p>
      <p><strong>Fator de desconto = 1 - 0,15 = 0,85</strong></p>
      <p><strong>Novo valor = 200 · 0,85 = R$ 170,00</strong></p>
    </div>
  ),
};

function renderThemeContent(key) {
  const content = themeExplanations[key] || null;
  return content ? <div className={styles['theme-content-wrap']}>{content}</div> : null;
}

export default function ThemePage() {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const searchKeyword = searchParams.get('palavra') || searchParams.get('q');
  const tema = searchParams.get('tema') || 'FRACAO';
  const tipo = searchParams.get('tipo');
  const isSearch = Boolean(searchKeyword);
  const showExplanation = !isSearch && !tipo;

  useEffect(() => {
    setPage(1);
  }, [tema, tipo, searchKeyword]);

  useEffect(() => {
    async function loadThemeItems() {
      setLoading(true);
      try {
        let endpoint;
        let params = { page, limit };

        if (isSearch) {
          endpoint = '/busca/questoes-tema/busca';
          params = { ...params, palavra: searchKeyword };
        } else {
          const themeName = dbThemeNames[tema] || tema;
          endpoint = tipo
            ? `/busca/questoes-tema/vestibular/${encodeURIComponent(tipo)}/tema/${encodeURIComponent(themeName)}`
            : `/busca/questoes-tema/tema/${encodeURIComponent(themeName)}`;
        }

        const response = await api.get(endpoint, { params });
        setItems(response.data);
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    loadThemeItems();
  }, [tema, tipo, searchKeyword, page, limit, isSearch]);

  return (
    <main className={styles['theme-page']}>
      <header className={styles['theme-header']}>
          <div>
            <h2>{isSearch ? `Resultados para "${searchKeyword}"` : tema}</h2>
            <p>
              {isSearch
                ? 'Veja as questões encontradas para a sua busca por palavra-chave.'
                : tipo
                  ? `Questões do vestibular ${tipo} para o tema selecionado.`
                  : themeDescriptions[tema] || 'Explore o tema e veja as questões disponíveis.'}
            </p>
            {!isSearch && tipo && <p className="theme-subtitle">Vestibular: {tipo}</p>}
          </div>
        </header>

      {/* Detailed explanation area (from the content mapping) */}
      {showExplanation && (
        <section className={styles['theme-content']}>
          {renderThemeContent(tema)}
        </section>
      )}

      <section className={styles['theme-items']}>
        {loading ? (
          <p>Carregando questões do tema...</p>
        ) : (
          <>
            {items.length === 0 && <p>Nenhuma questão encontrada para esta página.</p>}
            {items.map((item, index) => (
              <QuestionCard key={`${tema}-${index}`} question={item} />
            ))}
            <div className="pagination-controls">
              <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Anterior</button>
              <span className="page"> Página {page} </span>
              <button type="button" onClick={() => setPage((p) => p + 1)} disabled={items.length < limit}>Próxima</button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
