import { useState } from 'react';
import styles from './VideoAulasPage.module.css';

const topics = [
  {
    title: 'Frações',
    summary:
      'Frações representam partes de um inteiro. Dominar soma, subtração, multiplicação e simplificação é essencial para resolver questões de vestibular.',
    videos: [
      { id: 'YJyY6A_MOQc', label: 'Introdução a frações' },
      { id: 'SgJpB78R7x0', label: 'Operações com frações' },
      { id: 'BWFnqKYxgMo', label: 'Frações em problemas' },
    ],
  },
  {
    title: 'Razão e Proporção',
    summary:
      'A razão compara duas grandezas e a proporção é a igualdade entre razões. Conceitos básicos para escalas, mapas e análise proporcional.',
    videos: [
      { id: 'evXrGaI6SVc', label: 'Razão explicado' },
      { id: 'uIulBEk8gcM', label: 'Proporção e exemplos' },
      { id: '6Dsta1eZ1BA', label: 'Proporção em vestibulares' },
    ],
  },
  {
    title: 'Porcentagem',
    summary:
      'A porcentagem é uma razão com denominador 100. É um tema recorrente para calcular descontos, acréscimos e taxas de juros.',
    videos: [
      { id: 'CERiIwParX4', label: 'Porcentagem fácil' },
      { id: 'azedx0uou64', label: 'Descontos e acréscimos' },
      { id: '3EefFSEF8Ds', label: 'Exemplos de porcentagem' },
    ],
  },
  {
    title: 'Regra de 3',
    summary:
      'A regra de três calcula um valor desconhecido a partir de três conhecidos. Muito usada em grandezas proporcionais diretas e inversas.',
    videos: [
      { id: 'alLifth7gxE', label: 'Regra de três simples' },
      { id: 'buYey1YGJhA', label: 'Regra de três inversa' },
      { id: 'xuQgQTiD3mw', label: 'Regra de três em provas' },
    ],
  },
];

function getThumbnail(id) {
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
}

export default function VideoAulasPage() {
  const [openTopic, setOpenTopic] = useState('Frações');
  const [modalVideo, setModalVideo] = useState(null);

  return (
    <main className={styles['video-aulas-page']}>
      <header className={styles['video-header']}>
        <div>
          <p className={styles['video-label']}>Video Aulas</p>
          <h2>Aprenda com aulas em vídeo por tema</h2>
          <p className={styles['video-description']}>
            Escolha um tema, veja o resumo e abra a aula que explica o conteúdo de forma simples e rápida.
          </p>
        </div>
      </header>

      <section className={styles['video-topics']}>
        {topics.map((topic) => {
          const isOpen = openTopic === topic.title;

          return (
            <article
              key={topic.title}
              className={`${styles['video-topic']}${isOpen ? ' open' : ''}`}
            >
              <button type="button" className={styles['video-topic-header']} onClick={() => setOpenTopic(isOpen ? null : topic.title)}>
                <span>{topic.title}</span>
                <span>{isOpen ? '-' : '+'}</span>
              </button>

              {isOpen && (
                <div className={styles['video-topic-body']}>
                  <p>{topic.summary}</p>
                  <div className={styles['video-thumbnails']}>
                    {topic.videos.map((video) => (
                      <button
                        key={video.id}
                        type="button"
                        className={styles['video-thumb']}
                        onClick={() => setModalVideo(video)}
                      >
                        <img src={getThumbnail(video.id)} alt={video.label} />
                        <span>{video.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </section>

      {modalVideo && (
        <div className={styles['video-modal']} role="dialog" aria-modal="true">
          <div className={styles['video-modal-backdrop']} onClick={() => setModalVideo(null)} />
          <div className={styles['video-modal-content']}>
            <header className={styles['video-modal-header']}>
              <h3>{modalVideo.label}</h3>
              <button type="button" onClick={() => setModalVideo(null)} aria-label="Fechar vídeo">
                ✕
              </button>
            </header>
            <div className={styles['video-modal-player']}>
              <iframe
                title={modalVideo.label}
                src={`https://www.youtube.com/embed/${modalVideo.id}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
