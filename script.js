/**
 * ============================================================================
 * CINEPOOL - LÓGICA DA APLICAÇÃO (API TMDB + FALLBACK + i18n + TEMA)
 * ============================================================================
 */

// 1. CONFIGURAÇÃO DA API TMDB
// Obtenha uma chave gratuita em: https://www.themoviedb.org/settings/api
// Enquanto estiver vazia (''), o site usará automaticamente o catálogo de demonstração abaixo.
const API_KEY = ''; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Estado Global da Aplicação
let currentLang = 'pt-BR';
let currentGenre = 'all';
let currentMoviesList = [];

// 2. DICIONÁRIO DE INTERNACIONALIZAÇÃO (PT-BR, EN-US, ES-ES)
const translations = {
  'pt-BR': {
    heroBadge: 'CURADORIA & CRÍTICA',
    heroTitle: 'Mergulhe na Sétima Arte',
    heroSubtitle: 'Explore obras selecionadas, análises críticas e descubra sua próxima sessão de cinema.',
    filterTitle: 'Explorar por Gênero',
    genreAll: 'Em Alta',
    genreHorror: 'Terror',
    genreCrime: 'Policial',
    genreComedy: 'Humor',
    genreAction: 'Ação',
    genreSciFi: 'Ficção Científica',
    criticLabel: 'Resumo da Crítica',
    readMore: 'Ler crítica completa',
    synopsisLabel: 'Sinopse',
    apiDemo: 'Modo Demonstração (Catálogo Curado)',
    apiLive: 'Conectado ao TMDB ao vivo',
    footerDesc: 'Projeto didático de Desenvolvimento Web, UI/UX e Crítica Cinematográfica.',
    footerRights: 'Todos os direitos reservados.'
  },
  'en-US': {
    heroBadge: 'CURATION & REVIEWS',
    heroTitle: 'Dive into the Seventh Art',
    heroSubtitle: 'Explore selected works, critical reviews, and discover your next cinema session.',
    filterTitle: 'Explore by Genre',
    genreAll: 'Trending',
    genreHorror: 'Horror',
    genreCrime: 'Crime',
    genreComedy: 'Comedy',
    genreAction: 'Action',
    genreSciFi: 'Sci-Fi',
    criticLabel: 'Critics Consensus',
    readMore: 'Read full review',
    synopsisLabel: 'Synopsis',
    apiDemo: 'Demo Mode (Curated Catalog)',
    apiLive: 'Connected to Live TMDB API',
    footerDesc: 'Educational project on Web Development, UI/UX, and Film Criticism.',
    footerRights: 'All rights reserved.'
  },
  'es-ES': {
    heroBadge: 'CURADURÍA Y CRÍTICA',
    heroTitle: 'Sumérgete en el Séptimo Arte',
    heroSubtitle: 'Explora obras seleccionadas, análisis críticos y descubre tu próxima sesión de cine.',
    filterTitle: 'Explorar por Género',
    genreAll: 'Tendencias',
    genreHorror: 'Terror',
    genreCrime: 'Policial',
    genreComedy: 'Comedia',
    genreAction: 'Acción',
    genreSciFi: 'Ciencia Ficción',
    criticLabel: 'Resumen de la Crítica',
    readMore: 'Leer crítica completa',
    synopsisLabel: 'Sinopsis',
    apiDemo: 'Modo Demostración (Catálogo Curado)',
    apiLive: 'Conectado a la API de TMDB en vivo',
    footerDesc: 'Proyecto didáctico de Desarrollo Web, UI/UX y Crítica Cinematográfica.',
    footerRights: 'Todos los derechos reservados.'
  }
};

// 3. CATÁLOGO FALLBACK MULTILÍNGUE (Garante funcionamento imediato sem API_KEY)
const fallbackMovies = [
  {
    id: 1,
    genre_ids: [878, 28],
    vote_average: 8.8,
    release_date: '2024-03-01',
    poster_path: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    content: {
      'pt-BR': {
        title: 'Duna: Parte Dois',
        overview: 'Paul Atreides se une a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família.',
        critic: 'Espetáculo visual monumental que eleva a ficção científica moderna a um nível operístico.'
      },
      'en-US': {
        title: 'Dune: Part Two',
        overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
        critic: 'A monumental visual spectacle that elevates modern sci-fi to an operatic level.'
      },
      'es-ES': {
        title: 'Dune: Parte Dos',
        overview: 'Paul Atreides se une a Chani y a los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia.',
        critic: 'Espectáculo visual monumental que eleva la ciencia ficción moderna a un nivel operístico.'
      }
    }
  },
  {
    id: 2,
    genre_ids: [27],
    vote_average: 7.9,
    release_date: '2024-12-25',
    poster_path: 'https://image.tmdb.org/t/p/w500/5qGIxdEO841C0tdY8vOdLoRVrr0.jpg',
    content: {
      'pt-BR': {
        title: 'Nosferatu',
        overview: 'Uma história gótica de obsessão entre uma jovem assombrada e o terrível vampiro apaixonado por ela.',
        critic: 'Atmosfera sufocante, fotografia expressionista impecável e terror psicológico puro.'
      },
      'en-US': {
        title: 'Nosferatu',
        overview: 'A gothic tale of obsession between a haunted young woman and the terrifying vampire infatuated with her.',
        critic: 'Suffocating atmosphere, impeccable expressionist cinematography, and pure psychological horror.'
      },
      'es-ES': {
        title: 'Nosferatu',
        overview: 'Una historia gótica de obsesión entre una joven atormentada y el aterrador vampiro enamorado de ella.',
        critic: 'Atmósfera sofocante, fotografía expresionista impecable y terror psicológico puro.'
      }
    }
  },
  {
    id: 3,
    genre_ids: [80, 28],
    vote_average: 8.5,
    release_date: '2022-03-04',
    poster_path: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    content: {
      'pt-BR': {
        title: 'Batman',
        overview: 'Quando um assassino sádico deixa pistas enigmáticas em Gotham, o Cavaleiro das Trevas investiga o submundo policial.',
        critic: 'Um thriller noir sombrio e visceral que resgata a essência detetivesca do personagem.'
      },
      'en-US': {
        title: 'The Batman',
        overview: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate.',
        critic: 'A dark, visceral noir thriller that reclaims the character’s detective roots.'
      },
      'es-ES': {
        title: 'The Batman',
        overview: 'Cuando un asesino sádico deja pistas enigmáticas en Gotham, el Caballero Oscuro investiga el inframundo criminal.',
        critic: 'Un thriller noir oscuro y visceral que rescata la esencia detectivesca del personaje.'
      }
    }
  },
  {
    id: 4,
    genre_ids: [35],
    vote_average: 8.1,
    release_date: '2014-03-07',
    poster_path: 'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg',
    content: {
      'pt-BR': {
        title: 'O Grande Hotel Budapeste',
        overview: 'As aventuras de Gustave H, um lendário concierge de um famoso hotel europeu entre as guerras, e seu fiel mensageiro.',
        critic: 'Humor refinado, simetria estética hipnotizante e um roteiro ágil repleto de melancolia doce.'
      },
      'en-US': {
        title: 'The Grand Budapest Hotel',
        overview: 'The adventures of Gustave H, a legendary concierge at a famous European hotel between the wars, and his lobby boy.',
        critic: 'Refined humor, mesmerizing aesthetic symmetry, and a brisk script filled with sweet melancholy.'
      },
      'es-ES': {
        title: 'El Gran Hotel Budapest',
        overview: 'Las aventuras de Gustave H, un legendario conserje de un famoso hotel europeo de entreguerras, y su fiel botones.',
        critic: 'Humor refinado, simetría estética hipnotizante y un guion ágil lleno de dulce melancolía.'
      }
    }
  },
  {
    id: 5,
    genre_ids: [27, 878],
    vote_average: 7.6,
    release_date: '2024-08-15',
    poster_path: 'https://image.tmdb.org/t/p/w500/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg',
    content: {
      'pt-BR': {
        title: 'Alien: Romulus',
        overview: 'Enquanto vasculham uma estação espacial abandonada, jovens colonizadores ficam cara a cara com a forma de vida mais implacável do universo.',
        critic: 'Retorno tenso às raízes do horror claustrofóbico espacial com efeitos práticos impressionantes.'
      },
      'en-US': {
        title: 'Alien: Romulus',
        overview: 'While scavenging the deep ends of a derelict space station, young space colonizers come face to face with the most terrifying life form.',
        critic: 'A tense return to the roots of claustrophobic space horror with impressive practical effects.'
      },
      'es-ES': {
        title: 'Alien: Romulus',
        overview: 'Mientras exploran una estación espacial abandonada, jóvenes colonizadores se enfrentan a la forma de vida más aterradora del universo.',
        critic: 'Regreso tenso a las raíces del terror claustrofóbico espacial con efectos prácticos impresionantes.'
      }
    }
  },
  {
    id: 6,
    genre_ids: [80, 35],
    vote_average: 8.3,
    release_date: '2019-11-27',
    poster_path: 'https://image.tmdb.org/t/p/w500/pThyQovXQrw2m0s9x82twj48Jq4.jpg',
    content: {
      'pt-BR': {
        title: 'Entre Facas e Segredos',
        overview: 'Um detetive excêntrico investiga a morte misteriosa do patriarca de uma família disfuncional e gananciosa.',
        critic: 'Revitaliza o gênero policial "quem matou?" com sátira social afiada e elenco em estado de graça.'
      },
      'en-US': {
        title: 'Knives Out',
        overview: 'A detective investigates the death of the patriarch of an eccentric, combative family.',
        critic: 'Revitalizes the whodunit crime genre with sharp social satire and an ensemble cast in top form.'
      },
      'es-ES': {
        title: 'Puñales por la espalda',
        overview: 'Un detective excéntrico investiga la muerte del patriarca de una familia disfuncional y codiciosa.',
        critic: 'Revitaliza el género policial de misterio con sátira social afilada y un elenco brillante.'
      }
    }
  }
];

// ============================================================================
// 4. INICIALIZAÇÃO & EVENTOS
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setupEventListeners();
  updateStatusBadge();
  loadMovies();
});

function setupEventListeners() {
  // Alternância de Tema (Claro/Escuro)
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  // Botões de Idioma (PT / EN / ES)
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentLang = e.target.dataset.lang;
      applyTranslations();
      loadMovies();
    });
  });

  // Botões de Filtro por Gênero
  document.querySelectorAll('.genre-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.genre-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentGenre = e.target.dataset.genre;
      loadMovies();
    });
  });

  // Fechar Modal
  const modal = document.getElementById('movie-modal');
  document.getElementById('close-modal').addEventListener('click', () => {
    modal.classList.remove('open');
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });
}

// ============================================================================
// 5. GERENCIAMENTO DE TEMA (DARK / LIGHT MODE)
// ============================================================================
function initTheme() {
  const savedTheme = localStorage.getItem('cinepool-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('cinepool-theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#theme-toggle i');
  icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

// ============================================================================
// 6. TRADUÇÃO DA INTERFACE (i18n)
// ============================================================================
function applyTranslations() {
  const dict = translations[currentLang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
  updateStatusBadge();
}

function updateStatusBadge() {
  const badge = document.getElementById('api-status');
  const dict = translations[currentLang];
  if (API_KEY) {
    badge.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#00B4D8"></i> ${dict.apiLive}`;
  } else {
    badge.innerHTML = `<i class="fa-solid fa-film" style="color:#00B4D8"></i> ${dict.apiDemo}`;
  }
}

// ============================================================================
// 7. CONSUMO DA API TMDB + FALLBACK E RENDERIZAÇÃO DOS CARDS
// ============================================================================
async function loadMovies() {
  const grid = document.getElementById('movies-grid');
  grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center;">Carregando sessão...</p>';

  // Se a API_KEY foi preenchida, busca dados reais do TMDB
  if (API_KEY) {
    try {
      const endpoint = currentGenre === 'all'
        ? `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=${currentLang}`
        : `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${currentLang}&with_genres=${currentGenre}&sort_by=popularity.desc`;

      const response = await fetch(endpoint);
      const data = await response.json();

      currentMoviesList = data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        poster: movie.poster_path ? `${IMG_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=Sem+Poster',
        rating: movie.vote_average.toFixed(1),
        year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
        overview: movie.overview || 'Sinopse indisponível neste idioma.',
        critic: generateEditorialReview(movie.vote_average, currentLang)
      }));

      renderMovies(currentMoviesList);
      return;
    } catch (error) {
      console.warn('Erro ao conectar com TMDB, ativando fallback local:', error);
    }
  }

  // Modo Fallback (Funciona 100% offline/sem chave)
  const filtered = currentGenre === 'all'
    ? fallbackMovies
    : fallbackMovies.filter(m => m.genre_ids.includes(Number(currentGenre)));

  currentMoviesList = filtered.map(movie => ({
    id: movie.id,
    title: movie.content[currentLang].title,
    poster: movie.poster_path,
    rating: movie.vote_average.toFixed(1),
    year: movie.release_date.split('-')[0],
    overview: movie.content[currentLang].overview,
    critic: movie.content[currentLang].critic
  }));

  renderMovies(currentMoviesList);
}

// Gera um comentário crítico contextual caso venha da API ao vivo
function generateEditorialReview(score, lang) {
  const reviews = {
    'pt-BR': score >= 8
      ? 'Obra aclamada pela direção precisa, ritmo envolvente e forte impacto visual.'
      : 'Entretenimento sólido com boas atuações e momentos marcantes de gênero.',
    'en-US': score >= 8
      ? 'Acclaimed for its precise direction, engaging pacing, and strong visual impact.'
      : 'Solid entertainment featuring strong performances and memorable genre moments.',
    'es-ES': score >= 8
      ? 'Aclamada por su dirección precisa, ritmo envolvente y fuerte impacto visual.'
      : 'Entretenimiento sólido con buenas actuaciones y momentos memorables.'
  };
  return reviews[lang];
}

function renderMovies(movies) {
  const grid = document.getElementById('movies-grid');
  const dict = translations[currentLang];
  grid.innerHTML = '';

  movies.forEach((movie, index) => {
    const card = document.createElement('article');
    card.className = 'movie-card';
    card.style.animationDelay = `${index * 0.08}s`;

    card.innerHTML = `
      <div class="poster-wrapper">
        <img src="${movie.poster}" alt="Pôster de ${movie.title}" loading="lazy">
        <div class="rating-pill">
          <i class="fa-solid fa-star"></i> ${movie.rating}
        </div>
        <div class="poster-overlay">
          <span class="overlay-cta">${dict.readMore}</span>
        </div>
      </div>
      <div class="card-info">
        <span class="card-meta">${movie.year}</span>
        <h3 class="card-title">${movie.title}</h3>
        <div class="critic-box">
          <span class="critic-label"><i class="fa-solid fa-pen-nib"></i> ${dict.criticLabel}</span>
          <p>${movie.critic}</p>
        </div>
      </div>
    `;

    card.addEventListener('click', () => openMovieModal(movie));
    grid.appendChild(card);
  });
}

function openMovieModal(movie) {
  const modal = document.getElementById('movie-modal');
  const body = document.getElementById('modal-body');
  const dict = translations[currentLang];

  body.innerHTML = `
    <img src="${movie.poster}" alt="${movie.title}">
    <div class="modal-details">
      <span class="badge">${movie.year} • ★ ${movie.rating}</span>
      <h2>${movie.title}</h2>
      <h4 style="color: var(--pool-primary); margin-top: 0.5rem;">${dict.synopsisLabel}</h4>
      <p class="modal-synopsis">${movie.overview}</p>
      <div class="modal-review-full">
        <strong style="color: var(--pool-primary); display:block; margin-bottom:0.35rem;">
          <i class="fa-solid fa-quote-left"></i> ${dict.criticLabel}
        </strong>
        <p>${movie.critic}</p>
      </div>
    </div>
  `;

  modal.classList.add('open');
}