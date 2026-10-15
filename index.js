const moviesWrapper = document.querySelector(".movies");
const filterEl = document.querySelector(".filter");

let currentMovies = [];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function showLoading() {
  moviesWrapper.classList.add("movies__loading");
  moviesWrapper.innerHTML = `<div class="movies__loading--spinner"></div>`;
}

function hideLoading() {
  moviesWrapper.classList.remove("movies__loading");
}

async function getMovies(searchTerm) {
  if (!searchTerm.trim()) {
    moviesWrapper.innerHTML = "";
    currentMovies = [];
    hideLoading();
    return;
  }

  showLoading();

  try {
    const [response] = await Promise.all([
      fetch(
        `https://www.omdbapi.com/?i=tt3896198&apikey=b7dd1779&s=${encodeURIComponent(searchTerm)}`
      ),
      delay(1000),
    ]);

    const data = await response.json();
    console.log(data);

    hideLoading();

    if (!data.Search) {
      moviesWrapper.innerHTML = `<p>No results found</p>`;
      currentMovies = [];
      return;
    }

    currentMovies = data.Search.slice(0, 6);
    renderMovies(currentMovies);
  } catch (error) {
    hideLoading();
    console.error(error);
    moviesWrapper.innerHTML = `<p>Something went wrong</p>`;
  }
}

function renderMovies(movies) {
  hideLoading();
  moviesWrapper.innerHTML = movies
    .map((movie) => {
      const poster =
        movie.Poster !== "N/A"
          ? movie.Poster
          : "https://via.placeholder.com/300x450?text=No+Poster";

      return `<div class="movie">
        <img src="${poster}" alt="Poster" />
        <h2>${movie.Title}</h2>
        <h4>${movie.Year}</h4>
        <button>Learn More</button>
      </div>`;
    })
    .join("");
}

function sortMovies(sortBy) {
  if (!currentMovies.length) return;

  const sorted = [...currentMovies];

  if (sortBy === "title") {
    sorted.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (sortBy === "year") {
    sorted.sort((a, b) => {
      const yearA = parseInt(a.Year) || 0;
      const yearB = parseInt(b.Year) || 0;
      return yearA - yearB;
    });
  }

  renderMovies(sorted);
}

function onSearchChange(event) {
  console.log(event.target.value);
  getMovies(event.target.value);
}

function onFilterChange(event) {
  sortMovies(event.target.value);
}