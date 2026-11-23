import { useState } from 'react';
import api from '../services/api';
import QuestionCard from '../components/QuestionCard';
import './SimuladoPage.module.css';

const vestibulares = ['ENEM', 'PUC', 'FUVEST'];

export default function SimuladoPage() {
  const [name, setName] = useState('');
  const [selected, setSelected] = useState([]);
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
      let fetched = [];
      if (selected.length >= 1) {
        const perVest = Math.ceil(quantity / selected.length);
        const promises = selected.map((vest) =>
          api.get(`/busca/questoes-tema/vestibular/${vest}/aleatorias`, { params: { quantidade: perVest } })
            .then((r) => r.data || [])
            .catch(() => [])
        );
        const results = await Promise.all(promises);
        fetched = results.flat().slice(0, quantity);
      } else {
        const resp = await api.get('/busca/questoes-tema/aleatorias', { params: { quantidade: quantity } });
        fetched = resp.data || [];
      }

      const uidBase = Date.now();
      const withUid = (fetched || []).map((q, i) => ({ ...q, _uid: `${uidBase}-${i}` }));
      setQuestions(withUid);
      if (!withUid.length) {
        setMessage('Nenhuma questão encontrada. Tente outro vestibular ou quantidade.');
      }
    } catch (err) {
      setMessage('Erro ao recuperar questões.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="simulado-page">
      <section className="simulado-box">
        <h2>Simulado - ENEM</h2>
        <div className="form-row">
          <span>Quantidade de Questões:</span>
          <div className="quantity-buttons">
            {[5, 10, 20, 30].map((value) => (
              <button key={value} type="button" className={quantity === value ? 'selected' : ''} onClick={() => setQuantity(value)}>{value}</button>
            ))}
          </div>
        </div>
        <div className="form-row">
          <span>Selecione os Vestibulares:</span>
          <div className="checkbox-grid">
            {vestibulares.map((vest) => (
              <label key={vest} className={selected.includes(vest) ? 'checked' : ''}>
                <input type="checkbox" checked={selected.includes(vest)} onChange={() => handleToggle(vest)} />
                {vest}
              </label>
            ))}
          </div>
        </div>
        <button type="button" className="primary-button" onClick={fetchQuestions} disabled={loading}>{loading ? 'Carregando...' : 'Iniciar Simulado →'}</button>
        {message && <p className="form-message">{message}</p>}
      </section>

      {questions.length > 0 && (
        <section className="questions-list">
          <h3>Questões selecionadas</h3>
          {questions.map((item, index) => (
            <QuestionCard key={item._uid || `${item.id || index}-${item.nome_T || index}`} question={item} />
          ))}
        </section>
      )}
    </main>
  );
}
