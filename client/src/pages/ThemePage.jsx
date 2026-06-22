import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import QuestionCard from '../components/QuestionCard';
import { FracaoGuide, PorcentagemGuide, RegraDe3Guide, RazaoProporcaoGuide } from '../components/ThemeGuides';
import './ThemePage.css';
import './ThemeGuides.css';

const themeGuideComponents = {
  FRACAO: FracaoGuide,
  PORCENTAGEM: PorcentagemGuide,
  'RAZAO E PROPORCAO': RazaoProporcaoGuide,
  'REGRA DE 3': RegraDe3Guide,
};

const themeDetails = {
  FRACAO: {
    title: 'Fração',
    dbName: 'Fração',
    videoId: 'YJyY6A_MOQc',
    intro: 'Frações aparecem quando um inteiro é dividido em partes iguais. Em vestibulares, elas surgem em razão, porcentagem, probabilidade, geometria e leitura de gráficos.',
    blocks: [
      ['O que estudar?', 'Equivalência, simplificação, mínimo múltiplo comum, operações e comparação entre frações.'],
      ['Como cai?', 'Os enunciados costumam misturar frações com contexto: parte de uma turma, divisão de renda, receitas, mapas e escalas.'],
      ['Dica rápida', 'Antes de calcular, identifique qual é o todo. Esse detalhe evita a maior parte dos erros.'],
    ],
  },
  PORCENTAGEM: {
    title: 'Porcentagem',
    dbName: 'Porcentagem',
    videoId: 'CERiIwParX4',
    intro: 'Porcentagem é uma forma de escrever frações de denominador 100. Ela é essencial para descontos, aumentos, juros, estatísticas e interpretação de dados.',
    blocks: [
      ['O que estudar?', 'Transformação entre decimal, fração e porcentagem, variação percentual e porcentagem sucessiva.'],
      ['Como cai?', 'Geralmente aparece em gráficos, tabelas, compras, índices sociais e problemas de crescimento ou redução.'],
      ['Dica rápida', 'Aumento de 20% vira multiplicar por 1,2. Desconto de 20% vira multiplicar por 0,8.'],
    ],
  },
  'RAZAO E PROPORCAO': {
    title: 'Razão e proporção',
    dbName: 'Razão e Proporção',
    videoId: 'evXrGaI6SVc',
    intro: 'Razão compara duas grandezas; proporção afirma que duas razões são equivalentes. Esse tema é a base de escala, regra de 3 e semelhança.',
    blocks: [
      ['O que estudar?', 'Razões equivalentes, grandezas diretamente e inversamente proporcionais e escalas.'],
      ['Como cai?', 'Pode aparecer em mapas, misturas, velocidade média, densidade, produtividade e geometria.'],
      ['Dica rápida', 'Confira se as grandezas crescem juntas ou se uma aumenta enquanto a outra diminui.'],
    ],
  },
  'REGRA DE 3': {
    title: 'Regra de 3',
    dbName: 'Regra de 3',
    videoId: 'alLifth7gxE', //ids que são os finais da URL do Youtube que são seus indentificadores únicos
    intro: 'Regra de 3 organiza relações proporcionais para encontrar um valor desconhecido. Ela funciona melhor quando você identifica as grandezas antes de montar a conta.',
    blocks: [
      ['O que estudar?', 'Regra de 3 simples, composta, direta e inversa.'],
      ['Como cai?', 'Questões usam tempo, quantidade, distância, produção, consumo, velocidade e trabalho em equipe.'],
      ['Dica rápida', 'Monte uma tabela curta e marque se cada grandeza é direta ou inversa em relação ao valor procurado.'],
    ],
  },
};

export default function ThemePage() {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const tema = searchParams.get('tema') || 'REGRA DE 3';
  const tipo = searchParams.get('tipo');
  const detail = themeDetails[tema] || themeDetails['REGRA DE 3'];

  // Sempre que o tema mudar volta para a primeira página
  useEffect(() => {
    setPage(1);
  }, [tema, tipo]);

  useEffect(() => {
    async function loadThemeItems() {
      setLoading(true);
      try {
        // Define endpoint dependendo da existência de vestibular
        const endpoint = tipo
          ? `/busca/questoes-tema/vestibular/${encodeURIComponent(tipo)}/tema/${encodeURIComponent(detail.dbName)}`
          : `/busca/questoes-tema/tema/${encodeURIComponent(detail.dbName)}`;
          //Se um vestibular específico for selecionado, busca questões daquele vestibular e tema. Caso contrário, busca questões do tema em geral.
        const response = await api.get(endpoint, { params: { page, limit } });
        setItems(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    loadThemeItems();
  }, [detail.dbName, tipo, page, limit]);

  // Recupera componente teórico correspondente ao tema
  const GuideComponent = themeGuideComponents[tema];

  return (
    <div className="theme-page">
      {detail.videoId && (
        <div className="floating-video">
          <iframe
            src={`https://www.youtube.com/embed/${detail.videoId}`} //URL de incorporação do YouTube, usando o ID do vídeo
            title={`Vídeo sobre ${detail.title}`} //Título para acessibilidade
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" //Permissões recomendadas para vídeos incorporados
            allowFullScreen //Permite que o vídeo seja visto em tela cheia
          />
        </div>
      )}
      <section className="theme-intro-grid">
        <article className="intro-card intro-main">
          <h1>{detail.title}</h1>
          <p>{detail.intro}</p>
          {tipo && <span className="theme-chip">Vestibular: {tipo}</span>}
        </article>
        <aside className="theme-art">
          <div className="image-slot" />
          <div className="mascot-slot">PNG da preguiça</div>
        </aside>
        {detail.blocks.map(([title, text]) => (
          <article className="intro-card" key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
            <small>Veja as questões abaixo para praticar esse ponto.</small>
          </article>
        ))}
        {GuideComponent && <GuideComponent />}
      </section>

      <section className="theme-items" aria-label="Questões do tema">
        <h2>Questões</h2>
        {loading ? (
          <p className="status-text">Carregando questões do tema...</p>
        ) : (
          <>
           {/* Caso nenhuma questão seja encontrada */}
            {items.length === 0 && <p className="status-text">Nenhuma questão encontrada para esta página.</p>}
            {items.map((item, index) => (
              <QuestionCard key={`${item.idq || item.idQ || index}-${page}`} question={item} />
            ))}
            <div className="pagination-controls">
              <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Anterior</button>
              <span>Página {page}</span>
              <button type="button" onClick={() => setPage((p) => p + 1)} disabled={items.length < limit}>Próxima</button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
