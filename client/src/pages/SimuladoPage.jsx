import { useState } from 'react';
import api from '../services/api';
import QuestionCard from '../components/QuestionCard';
import './SimuladoPage.css';

const vestibularesData = [
  { id: 'ENEM', label: 'ENEM', icon: '/assets/enem-icon.png' },
  { id: 'PUC', label: 'PUC', icon: '/assets/puc-icon.png' },
  { id: 'FUVEST', label: 'FUVEST', icon: '/assets/fuvest-icon.png' }
];
const quantities = [5, 10, 20, 30];

export default function SimuladoPage() {
  const [name, setName] = useState('');
  const [selected, setSelected] = useState(['ENEM']);
  const [quantity, setQuantity] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleToggle = (vestibular) => {
    setSelected((current) =>
      current.includes(vestibular)
        ? current.filter((item) => item !== vestibular)
        : [...current, vestibular]
    );
  };

  const fetchQuestions = async () => {
    setLoading(true);
    setMessage('');
    try {
      let response;
      if (selected.length === 1) {
        response = await api.get(`/busca/questoes-tema/vestibular/${encodeURIComponent(selected[0])}/aleatorias`, {
          params: { quantidade: quantity },
        });
      } else {
        response = await api.get('/busca/questoes-tema/aleatorias', { params: { quantidade: quantity } });
      }
      const data = Array.isArray(response.data) ? response.data : [];
      setQuestions(data);
      if (!data.length) {
        setMessage('Nenhuma questão encontrada. Tente outro vestibular ou quantidade.');
      }
    } catch (err) {
      setMessage('Erro ao recuperar questões. Confira se a API e o banco estão rodando.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="simulado-page">
      <div className="simulado-box-wrapper">
        <div className="simulado-box-header">
          <h1>Simulado - ENEM</h1>
        </div>

        <div className="simulado-box-body">
          <div className="simulado-field">
            <label>Seu nome completo:</label>
            <input
              className="custom-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Pedro Henrique Almeida de Pinto Grosso"
            />
          </div>

          <div className="simulado-field">
            <label>Quantidade de Questões:</label>
            <div className="quantity-options">
              <div className="qty-ex">Ex:5-10</div>
              {quantities.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`qty-btn ${quantity === value ? 'selected' : ''}`}
                  onClick={() => setQuantity(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="simulado-field">
            <label>Selecione os Vestibulares:</label>
            <div className="vest-options">
              {vestibularesData.map((vest) => {
                const isSelected = selected.includes(vest.id);
                return (
                  <label key={vest.id} className="vest-checkbox-label">
                    <div className={`custom-checkbox ${isSelected ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggle(vest.id)}
                      />
                    </div>
                    <img src={vest.icon} alt={vest.label} className="vest-icon" />
                    <span className="vest-label">{vest.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="simulado-submit-container">
            <button type="button" className="simulado-submit-btn" onClick={fetchQuestions} disabled={loading}>
              {loading ? 'Carregando...' : 'Iniciar Simulado'}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem' }}>
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
            </button>
          </div>
          {message && <p className="form-message">{message}</p>}
        </div>
      </div>

      {questions.length > 0 && (
        <section className="questions-list">
          <div className="simulado-result-header">
            <div className="exam-logo">ENEM</div>
            <div className="ad-slot" />
          </div>
          {questions.map((item, index) => (
            <QuestionCard key={`${item.idq || item.idQ || index}-simulado`} question={item} />
          ))}
        </section>
      )}
    </div>
  );
}
