import { useEffect, useMemo, useState } from 'react';
import './QuestionCard.css';

function useMathJax(dependencies) { 
  useEffect(() => {
    const mathJax = window.MathJax; //Acessa o objeto global MathJax, que deve estar disponível se a biblioteca foi carregada corretamente.
    if (mathJax?.typesetPromise) { //Verifica se a função typesetPromise está disponível, o que indica que o MathJax está pronto para processar as fórmulas.
      mathJax.typesetPromise().catch((error) => console.error('MathJax error:', error)); 
      //Chama typesetPromise para reprocessar o conteúdo da página e as fórmulas matemáticas. 
      //Se ocorrer um erro, ele é capturado e logado no console para facilitar a depuração.
    }
  }, dependencies);
}

export default function QuestionCard({ question }) {
  const [selectedAlt, setSelectedAlt] = useState(null); 
  //Estado para armazenar a alternativa selecionada pelo usuário. Inicialmente, nenhuma alternativa está selecionada (null).
  
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); 
  //Estado para controlar a visibilidade do modal de imagem. Inicialmente, o modal está fechado (false).

  const vestibular = question.nome_V || question.nome_v || question.nome_Vestibular || question.vestibular || 'Vestibular';
  const tema = question.nome_T || question.nome_t || question.tema || 'Tema';
  const enunciado = question.enunciado || question.Enunciado || question.text || 'Questão sem enunciado disponível';
  const rawImage = question.imgQ || question.imgq || question.img || question.imagem;
  const image = typeof rawImage === 'string' && rawImage.trim() !== '' && rawImage.trim().toLowerCase() !== 'null' && rawImage.trim().toLowerCase() !== 'undefined' ? rawImage.trim() : null;
  const alternativas = useMemo(() => question.alternativas || [], [question.alternativas]);

  useEffect(() => {
    setSelectedAlt(null);
  }, [question]); 
  //Sempre que a questão mudar, o estado da alternativa selecionada é resetado para null, garantindo que o usuário comece 
  //sem nenhuma alternativa marcada na nova questão.

  useMathJax([question, selectedAlt]); 
  //Isso força o MathJax a reprocessar e "desenhar" os símbolos matemáticos na tela sempre que o usuário muda de questão ou interage com o card.

  const normalizeValidacao = (valor) => String(valor || '').trim().toLowerCase();
  const isRight = (alt) => ['s', 'sim', 'true', '1', 'correta', 'certo'].includes(normalizeValidacao(alt.validacao || alt.Validacao));
   //A validação é feita pela função helper normalizeValidacao, que converte o valor para string, remove espaços e coloca em minúsculas.
  const getCorrectAlternative = () => alternativas.find((alt) => isRight(alt));

  const renderComment = () => {
    if (!selectedAlt) return null;
    const correct = isRight(selectedAlt);
    const selectedComment = (selectedAlt.comentario || selectedAlt.Comentario || '').trim();
    const correctAlt = getCorrectAlternative();
    const correctComment = (correctAlt?.comentario || correctAlt?.Comentario || '').trim();
    const text = selectedComment || (correct ? 'Resposta correta!' : correctComment || 'Resposta incorreta.');

    return (
      <div className={`comment-box ${correct ? 'comment-correct' : 'comment-wrong'}`}> 
      {/* (.comment-correct ou .comment-wrong) exibindo o feedback explicativo na tela. */}
        <strong>{correct ? 'Acertou!' : 'Errou!'}</strong>
        <p>{text}</p>
      </div>
    );
  }; 
  //Essa função renderComment é responsável por exibir um comentário após o usuário selecionar uma alternativa. 
  // Ela verifica se a alternativa selecionada é correta e exibe um texto apropriado.

  return (
    <article className="question-card">
      <div className="question-header">
        <span>{vestibular}</span>
        <strong>{tema}</strong>
      </div>
      <p className="question-text">{enunciado}</p>
      {image && (
        <div className="question-image-container">
          <img
            src={image}
            alt="Imagem da questão"
            className="question-image"
            onClick={() => setIsImageModalOpen(true)} //Abre o modal de imagem ao clicar na imagem da questão.
          />
        </div>
      )}
      <ul className="alternatives-list">
        {alternativas.map((alt, index) => {
          const id = alt.id_alt || alt.id || index;
          const selected = selectedAlt && (selectedAlt.id_alt || selectedAlt.id || alternativas.indexOf(selectedAlt)) === id;
          const correct = isRight(alt);
          const answerText = alt.enunciado || alt.Enunciado || 'Alternativa sem texto';
          return (
            <li key={id} className="alternative-item">
              <button
                type="button"
                className={`alternative-button ${selected ? 'selected' : ''} ${selected && correct ? 'correct' : ''} ${selected && !correct ? 'wrong' : ''} ${selectedAlt && correct ? 'correct' : ''}`}
                onClick={() => setSelectedAlt(alt)}
              >
                <span>{answerText}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {renderComment()}

      {isImageModalOpen && image && (
        <div className="image-modal-overlay" onClick={() => setIsImageModalOpen(false)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={() => setIsImageModalOpen(false)}>&times;</button>
            <img src={image} alt="Imagem da questão expandida" className="image-modal-img" />
          </div>
      {/*  O modal só é montado no DOM se o estado for true. Para fechar, basta fazer o botão de fechar (ou o clique fora do modal) 
      disparar setIsImageModalOpen(false), alterando o estado de volta para false e removendo o elemento da tela */}
        </div>
      )}
    </article>
  );
}
