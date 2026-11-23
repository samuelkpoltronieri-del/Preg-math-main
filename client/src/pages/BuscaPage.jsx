import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import QuestionCard from '../components/QuestionCard';
import './BuscaPage.css';

export default function BuscaPage() {

  // Recupera os parâmetros enviados pela URL
  const [searchParams] = useSearchParams();

  // Obtém o texto pesquisado pelo usuário
  const query = searchParams.get('q') || '';

  // Lista de questões encontradas
  const [items, setItems] = useState([]);

  // Controla o estado de carregamento
  const [loading, setLoading] = useState(false);

  // Página atual da pesquisa
  const [page, setPage] = useState(1);

  // Quantidade de resultados por página
  const limit = 10;

  // Armazena mensagens de erro
  const [error, setError] = useState('');

  // Sempre que a pesquisa mudar, volta para a primeira página
  useEffect(() => {
    setPage(1);
  }, [query]);

  // Executa a busca sempre que:
  // - a palavra pesquisada mudar
  // - a página mudar
  useEffect(() => {

    // Se não existir texto pesquisado
    // limpa os resultados
    if (!query) {
      setItems([]);
      return;
    }

    async function loadSearchItems() {

      setLoading(true);

      // Limpa erros anteriores
      setError('');

      try {

        // Faz requisição para o backend
        const response = await api.get(
          '/busca/questoes-tema/busca',
          {
            params: {
              palavra: query,
              page,
              limit
            }
          }
        );

        // Salva resultados encontrados
        setItems(
          Array.isArray(response.data)
            ? response.data
            : []
        );

      } catch (err) {

        console.error(err);

        // Exibe mensagem de erro
        setError(
          'Erro ao buscar questões. Tente novamente mais tarde.'
        );

        // Limpa resultados
        setItems([]);

      } finally {

        // Finaliza carregamento
        setLoading(false);
      }
    }

    loadSearchItems();

  }, [query, page, limit]);

  return (
    <div className="busca-page">

      {/* Cabeçalho da pesquisa */}
      <section className="busca-header">

        <h1>Resultados da Busca</h1>

        <p>
          Procurando por:
          <strong> "{query}" </strong>
        </p>

      </section>

      {/* Área de exibição dos resultados */}
      <section
        className="busca-items"
        aria-label="Resultados da pesquisa"
      >

        {loading ? (

          // Exibido durante carregamento
          <p className="status-text">
            Buscando questões...
          </p>

        ) : error ? (

          // Exibido quando ocorre erro
          <p className="status-error">
            {error}
          </p>

        ) : (

          <>
            {/* Nenhum resultado encontrado */}
            {items.length === 0 && query && (
              <p className="status-text">
                Nenhuma questão encontrada contendo "{query}".
              </p>
            )}

            {/* Lista de questões encontradas */}
            {items.map((item, index) => (

              <QuestionCard
                key={`${item.idq || item.idQ || index}-${page}`}
                question={item}
              />

            ))}

            {/* Paginação */}
            {items.length > 0 && (

              <div className="pagination-controls">

                <button
                  type="button"
                  onClick={() =>
                    setPage((p) =>
                      Math.max(1, p - 1)
                    )
                  }
                  disabled={page === 1}
                >
                  Anterior
                </button>

                <span>
                  Página {page}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setPage((p) => p + 1)
                  }
                  disabled={items.length < limit}
                >
                  Próxima
                </button>

              </div>

            )}

          </>
        )}

      </section>

    </div>
  );
}