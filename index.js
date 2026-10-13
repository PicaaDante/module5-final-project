const moviesWrapper = document.querySelector(".movies");
const nameWrapper = document.querySelector(".searchName");

async function getMovies(searchTerm) {
  if (!searchTerm.trim()) {
    moviesWrapper.innerHTML = "";
    nameWrapper.innerHTML = "";
    return;
  }

  const response = await fetch(
    `https://www.omdbapi.com/?i=tt3896198&apikey=b7dd1779&s=${encodeURIComponent(searchTerm)}`
  );
  const data = await response.json();
  console.log(data);

  nameWrapper.innerHTML = searchTerm;

  if (!data.Search) {
    moviesWrapper.innerHTML = `<p>No results found</p>`;
    return;
  }

  moviesWrapper.innerHTML = data.Search.map((movie) => {
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
    .slice(0, 6)
    .join("");
}

function onSearchChange(event) {
  console.log(event.target.value);
  getMovies(event.target.value);
}

