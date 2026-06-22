import { useState } from 'react';
import api from '../services/api';
import QuestionCard from '../components/QuestionCard';
import './SimuladoPage.css';

// Lista de vestibulares disponíveis para seleção
const vestibularesData = [
  { id: 'ENEM', label: 'ENEM', icon: '/assets/enem-icon.png' },
  { id: 'PUC', label: 'PUC', icon: '/assets/puc-icon.png' },
  { id: 'FUVEST', label: 'FUVEST', icon: '/assets/fuvest-icon.png' }
];

// Quantidades de questões disponíveis para o simulado
const quantities = [5, 10, 20, 30];

export default function SimuladoPage() {

  // Nome informado pelo usuário
  const [name, setName] = useState('');

  // Vestibulares selecionados
  const [selected, setSelected] = useState(['ENEM']);

  // Quantidade de questões desejada
  const [quantity, setQuantity] = useState(5);

  // Questões retornadas pela API
  const [questions, setQuestions] = useState([]);

  // Controla o estado de carregamento
  const [loading, setLoading] = useState(false);

  // Mensagens de erro ou aviso exibidas ao usuário
  const [message, setMessage] = useState('');

  // Adiciona ou remove vestibulares da seleção
  const handleToggle = (vestibular) => {

    setSelected((current) =>
      current.includes(vestibular)
        ? current.filter((item) => item !== vestibular)
        : [...current, vestibular]
    );
  };

  // Busca questões no backend
  const fetchQuestions = async () => {

    // Ativa loading
    setLoading(true);

    // Limpa mensagens anteriores
    setMessage('');

    try {

      let response;

      // Se apenas um vestibular estiver selecionado
      // busca questões específicas daquele vestibular
      if (selected.length === 1) {

        response = await api.get(
          `/busca/questoes-tema/vestibular/${encodeURIComponent(selected[0])}/aleatorias`,
          {
            params: {
              quantidade: quantity,
            },
          }
        );

      } else {

        // Se houver mais de um vestibular
        // busca questões aleatórias gerais
        response = await api.get(
          '/busca/questoes-tema/aleatorias',
          {
            params: {
              quantidade: quantity,
            },
          }
        );
      }

      // Garante que os dados recebidos sejam um array
      const data = Array.isArray(response.data)
        ? response.data
        : [];

      // Salva as questões recebidas
      setQuestions(data);

      // Caso nenhuma questão seja encontrada
      if (!data.length) {
        setMessage(
          'Nenhuma questão encontrada. Tente outro vestibular ou quantidade.'
        );
      }

    } catch (err) {

      // Mensagem de erro para falhas na API
      setMessage(
        'Erro ao recuperar questões. Confira se a API e o banco estão rodando.'
      );

      console.error(err);

    } finally {

      // Finaliza loading independentemente do resultado
      setLoading(false);
    }
  };

  return (
    <div className="simulado-page">

      {/* Caixa principal de configuração do simulado */}
      <div className="simulado-box-wrapper">

        <div className="simulado-box-header">
          <h1>Simulado - ENEM</h1>
        </div>

        <div className="simulado-box-body">

          {/* Campo para identificação do usuário */}
          <div className="simulado-field">

            <label>Seu nome completo:</label>

            <input
              className="custom-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Pedro Henrique Almeida de Pinto Grosso"
            />

          </div>

          {/* Seleção da quantidade de questões */}
          <div className="simulado-field">

            <label>Quantidade de Questões:</label>

            <div className="quantity-options">

              <div className="qty-ex">
                Ex:5-10
              </div>

              {quantities.map((value) => (

                <button
                  key={value}
                  type="button"
                  className={`qty-btn ${quantity === value
                      ? 'selected'
                      : ''
                    }`}
                  onClick={() => setQuantity(value)}
                >
                  {value}
                </button>

              ))}

            </div>

          </div>

          {/* Seleção dos vestibulares */}
          <div className="simulado-field">

            <label>
              Selecione os Vestibulares:
            </label>

            <div className="vest-options">

              {vestibularesData.map((vest) => {

                const isSelected =
                  selected.includes(vest.id);

                return (
                  <label
                    key={vest.id}
                    className="vest-checkbox-label"
                  >

                    {/* Checkbox customizado */}
                    <div
                      className={`custom-checkbox ${isSelected
                          ? 'checked'
                          : ''
                        }`}
                    >

                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          handleToggle(vest.id)
                        }
                      />

                    </div>

                    <img
                      src={vest.icon}
                      alt={vest.label}
                      className="vest-icon"
                    />

                    <span className="vest-label">
                      {vest.label}
                    </span>

                  </label>
                );
              })}

            </div>

          </div>

          {/* Botão responsável por iniciar o simulado */}
          <div className="simulado-submit-container">

            <button
              type="button"
              className="simulado-submit-btn"
              onClick={fetchQuestions}
              disabled={loading}
            >

              {loading
                ? 'Carregando...'
                : 'Iniciar Simulado'}

              {/* Ícone do botão */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginLeft: '0.5rem' }}
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>

            </button>

          </div>

          {/* Mensagem de erro ou aviso */}
          {message && (
            <p className="form-message">
              {message}
            </p>
          )}

        </div>

      </div>

      {/* Exibição das questões retornadas */}
      {questions.length > 0 && (

        <section className="questions-list">

          <div className="simulado-result-header">

            <div className="exam-logo">
              ENEM
            </div>

            <div className="ad-slot" />

          </div>

          {/* Cada questão é renderizada pelo QuestionCard */}
          {questions.map((item, index) => (

            <QuestionCard
              key={`${item.idq || item.idQ || index}-simulado`}
              question={item}
            />

          ))}

        </section>

      )}

    </div>
  );
}