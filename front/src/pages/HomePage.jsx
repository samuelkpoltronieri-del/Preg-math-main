import { Link } from 'react-router-dom';
import imagemHero from '../assets/image.png';
import styles from './HomePage.module.css';

const featuredThemes = [
  { key: 'FRACAO', label: 'FRAÇÃO' },
  { key: 'PORCENTAGEM', label: 'PORCENTAGEM' },
  { key: 'RAZAO E PROPORCAO', label: 'RAZÃO E PROPORÇÃO' },
  { key: 'REGRA DE 3', label: 'REGRA DE 3' },
];

const themeDescriptions = {
  FRACAO: 'Domine a base da matemática de forma prática. Aqui você revisa desde as operações essenciais até a interpretação de problemas com frações, com simulados e questões reais do ENEM, FUVEST e PUC para garantir sua pontuação nas questões de nível básico e intermediário.',
  'RAZAO E PROPORCAO': 'O assunto mais cobrado na prova de Matemática do ENEM e presença garantida na PUC e FUVEST. Entenda o conceito de escalas, densidade e velocidade, pratique com simulados focados e aprenda a enxergar as relações entre grandezas de um jeito simples.',
  'REGRA DE 3': 'Sua maior aliada na hora de economizar tempo na prova. Aprenda a diferenciar grandezas diretas e inversamente proporcionais sem errar o sinal, e treine com explicações direto ao ponto e uma seleção de questões dos principais vestibulares do país.',
  PORCENTAGEM: 'De descontos a juros compostos: domine o tema que aparece em praticamente todas as edições do ENEM, PUC e FUVEST. Acesse simulados temáticos, aprenda os macetes de cálculo rápido e veja explicações passo a passo para não cair nas pegadinhas da banca.',
};

export default function HomePage() {
  return (
    <main className={styles['home-page']}>
      <section className={styles['hero-section']}>
        <div className={styles['hero-copy']}>
          <p>
            Sua preparação para os maiores vestibulares do país começa aqui. Treine com simulados atualizados e questões gabaritadas do ENEM, FUVEST e PUC, além de contar com explicações descomplicadas de cada tema para você dominar a matemática de ponta a ponta.
          </p>
        </div>

        <div className={styles['hero-preview-box']}>
          <div className={styles['hero-preview-image']}>
            <img src={imagemHero} alt="Hero preview" className={styles['hero-image']} />
          </div>
        </div>
      </section>

      <section className={styles['cards-section']}>
        {featuredThemes.map((theme) => (
          <Link key={theme.key} to={`/temas?tema=${encodeURIComponent(theme.key)}`} className={styles['theme-card-link']}>
            <article className={styles['theme-card']}>
              <div className={styles['theme-card-top']}>
                <div className={styles['theme-card-title']}>{theme.label}</div>
              </div>
              <p>{themeDescriptions[theme.key]}</p>
              <div className={styles['theme-card-footer']} />
            </article>
          </Link>
        ))}
      </section>

    </main>
  );
}
