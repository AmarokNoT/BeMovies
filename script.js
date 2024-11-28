const genreMap = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

const form = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const movieCards = document.getElementById('movieCards');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  searchMovies(searchInput.value);
});


function searchMovies(query) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NzlkZjM4YmNiODJlMWU1Yzg4ZWM0NjZlNDJiYjZjZiIsIm5iZiI6MTczMjcxNjUxOC4yNjU1NDA0LCJzdWIiOiI2NzJkZGQwYmE4MTg3MTNiZGY0OTQ0NWQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.gYcgQnmGk2Cs9hRiq257aKAF4F6Z0ab0kKQ80-dFqVU'
    }
  };
  fetch(`https://api.themoviedb.org/3/search/movie?query=${query}`, options)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.results)
      displayMovies(data.results);
    });
}

function getLatestReleases() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NzlkZjM4YmNiODJlMWU1Yzg4ZWM0NjZlNDJiYjZjZiIsIm5iZiI6MTczMjcxNjUxOC4yNjU1NDA0LCJzdWIiOiI2NzJkZGQwYmE4MTg3MTNiZGY0OTQ0NWQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.gYcgQnmGk2Cs9hRiq257aKAF4F6Z0ab0kKQ80-dFqVU'
    }
  };

  fetch('https://api.themoviedb.org/3/movie/now_playing', options)
    .then((response) => response.json())
    .then((data) => {
      displayLatestReleases(data.results);
    });
}

function showMovieDetails(movie) {
  // Récupération des éléments du modal
  const modal = document.getElementById('movieModal');
  const modalImage = document.getElementById('movieModalImage');
  const modalTitle = document.getElementById('movieModalTitle');
  const modalDescription = document.getElementById('movieModalDescription');
  const modalGenres = document.getElementById('movieModalGenres');
  const modalReleaseDate = document.getElementById('movieModalReleaseDate');
  const modalVoteAverage = document.getElementById('movieModalVoteAverage');
  const modalCast = document.getElementById('movieModalCast'); // Ajout du nouvel élément pour le cast

  // Injection des données dans le modal
  modalImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  modalTitle.textContent = movie.title;
  modalDescription.textContent = movie.overview || 'Aucune description disponible.';
  
  // Transformation des genre_ids en noms de genres via genreMap
  const genres = movie.genre_ids.map(id => genreMap[id] || 'Genre inconnu').join(', ');
  modalGenres.textContent = genres;
  
  modalReleaseDate.textContent = `${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}`;
  modalVoteAverage.textContent = movie.vote_average || 'Non évalué';

  // Récupérer les détails du cast
  fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=879df38bcb82e1e5c88ec466e42bb6cf`)
    .then((response) => response.json())
    .then((data) => {
      // Affichage du cast dans le modal
      const cast = data.cast;
      if (cast.length > 0) {
        const castList = cast.slice(0, 5).map(actor => actor.name).join(', ');
        modalCast.innerHTML = `Cast: ${castList}`;
      } else {
        modalCast.innerHTML = 'Cast: Aucune information sur le cast disponible.';
      }
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération du cast:', error);
      modalCast.innerHTML = 'Cast: Impossible de récupérer les informations du cast.';
    });

  // Affichage du modal
  modal.style.display = 'block';

  // Fermeture du modal lorsqu'on clique sur la croix
  const closeModal = document.getElementById('closeModal');
  closeModal.onclick = function() {
    modal.style.display = 'none';
  };

  // Fermeture du modal lorsqu'on clique à l'extérieur
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}



function displayMovies(movies) {
  movieCards.innerHTML = ''; // Vide les cartes actuelles
  movies.forEach((movie) => {
    const card = document.createElement('div');
    card.classList.add('card', 'swiper-slide'); // Ajoutez swiper-slide ici
    card.innerHTML = `
      <img class="movie-image" src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'asset/default-poster.jpg'}" alt="${movie.title}">
      <div class="info-overlay infos">
        <h3>${movie.title}</h3>
        <p class="year">${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
        <p class="genre">${movie.genre_ids.length > 0 ? genreMap[movie.genre_ids[0]] || 'Unknown Genre' : 'Unknown Genre'}</p>
        <i class="fa-solid fa-star"></i>
        <p class="note">${movie.vote_average || 'N/A'}</p>
      </div>
    `;
    card.addEventListener('click', () => showMovieDetails(movie));
    movieCards.appendChild(card);
  });
  const swiper = new Swiper('.swiper', {
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    slidesPerView: 4, // Montre plusieurs cartes à la fois
    spaceBetween: 10, // Ajoute de l'espacement entre les slides
  });
}

function displayLatestReleases(movies) {
  const latestReleasesContainer = document.querySelector('#MoviesLatest');
  latestReleasesContainer.innerHTML = ''; // Nettoie les anciennes cartes

  movies.forEach((movie) => {
    const card = document.createElement('div');
    card.classList.add('card', 'swiper-slide');
    card.innerHTML = `
      <img class="movie-image" src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'asset/default-poster.jpg'}" alt="${movie.title}">
      <div class="info-overlay infos">
        <h3>${movie.title}</h3>
        <p class="year">${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
        <p class="genre">${movie.genre_ids.length > 0 ? genreMap[movie.genre_ids[0]] || 'Unknown Genre' : 'Unknown Genre'}</p>
        <i class="fa-solid fa-star"></i>
        <p class="note">${movie.vote_average || 'N/A'}</p>
      </div>
    `;
    card.addEventListener('click', () => showMovieDetails(movie));
    latestReleasesContainer.appendChild(card);
  });

  const swiper = new Swiper('.swiper', {
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    slidesPerView: 4, // Montre plusieurs cartes à la fois
    spaceBetween: 10, // Ajoute de l'espacement entre les slides
  });
}

document.addEventListener('DOMContentLoaded', () => {
  getLatestReleases();
});

const genreList = document.querySelector('.movieNav');
const genreResults = document.getElementById('genreResults');

genreList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        const genreId = e.target.getAttribute('data-genre-id');
        fetchMoviesByGenre(genreId);
    }
});

function fetchMoviesByGenre(genreId) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NzlkZjM4YmNiODJlMWU1Yzg4ZWM0NjZlNDJiYjZjZiIsIm5iZiI6MTczMjcxNjUxOC4yNjU1NDA0LCJzdWIiOiI2NzJkZGQwYmE4MTg3MTNiZGY0OTQ0NWQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.gYcgQnmGk2Cs9hRiq257aKAF4F6Z0ab0kKQ80-dFqVU'
        }
    };

    fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}`, options)
        .then((response) => response.json())
        .then((data) => {
            displayGenreMovies(data.results);
        });
}

function displayGenreMovies(movies) {
    genreResults.innerHTML = '';
    movies.forEach((movie) => {
        const card = document.createElement('div');
        card.classList.add('card', 'swiper-slide');
        card.innerHTML = `
            <img class="movie-image" src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'asset/default-poster.jpg'}" alt="${movie.title}">
      <div class="info-overlay infos">
        <h3>${movie.title}</h3>
        <p class="year">${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
        <p class="genre">${movie.genre_ids.length > 0 ? genreMap[movie.genre_ids[0]] || 'Unknown Genre' : 'Unknown Genre'}</p>
        <i class="fa-solid fa-star"></i>
        <p class="note">${movie.vote_average || 'N/A'}</p>
      </div>
        `;
        card.addEventListener('click', () => showMovieDetails(movie));
        genreResults.appendChild(card);

        const swiper = new Swiper('.swiper', {
          loop: true,
          pagination: {
              el: '.swiper-pagination',
              clickable: true,
          },
          slidesPerView: 4, 
          spaceBetween: 10, 
        });

        // swiper.update();
        console.log("Nombre de diapositives dans le DOM :", genreResults.children.length);
    });
}
