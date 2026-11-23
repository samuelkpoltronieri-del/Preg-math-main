import { useState } from 'react';
import './QuestionCard.css';

export default function QuestionCard({ question }) {
  const [selectedAlt, setSelectedAlt] = useState(null);
  const vestibular = question.nome_V || question.nome_v || question.nome_Vestibular || 'Vestibular';
  const tema = question.nome_T || question.nome_t || 'Tema';
  const enunciado = question.enunciado || question.text || 'Questão sem enunciado disponível';
  const alternativas = question.alternativas || [];

  const handleSelect = (alt) => {
    setSelectedAlt(alt);
  };

  const normalizeValidacao = (valor) => String(valor || '').trim().toLowerCase();
  const getCorrectAlternative = () => alternativas.find((alt) => normalizeValidacao(alt.validacao) === 's');

  const renderComment = () => {
    if (!selectedAlt) return null;
    const isCorrect = normalizeValidacao(selectedAlt.validacao) === 's';
    const selectedComment = selectedAlt.comentario?.trim();
    const correctAlt = getCorrectAlternative();
    const correctComment = correctAlt?.comentario?.trim();
    const text = selectedComment || (isCorrect ? 'Resposta correta!' : correctComment || 'Resposta incorreta.');

    return (
      <div className={`comment-box ${isCorrect ? 'comment-correct' : 'comment-wrong'}`}>
        <strong>{isCorrect ? 'Acertou!' : 'Errou!'}</strong>
        <p>{text}</p>
      </div>
    );
  };

  return (
    <article className="question-card">
      <div className="question-header">
        <span>{vestibular}</span>
        <strong>{tema}</strong>
      </div>
      <p className="question-text">{enunciado}</p>
      <ul className="alternatives-list">
        {alternativas.map((alt) => {
          const selected = selectedAlt?.id_alt === alt.id_alt;
          const isCorrect = normalizeValidacao(alt.validacao) === 's';
          return (
            <li key={alt.id_alt || alt.id} className="alternative-item">
              <button
                type="button"
                className={`alternative-button ${selected ? 'selected' : ''} ${selected && isCorrect ? 'correct' : ''} ${selected && !isCorrect ? 'wrong' : ''} ${selectedAlt && isCorrect ? 'correct' : ''}`}
                onClick={() => handleSelect(alt)}
              >
                {alt.enunciado}
              </button>
            </li>
          );
        })}
      </ul>
      {renderComment()}
    </article>
  );
}
