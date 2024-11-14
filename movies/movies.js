const moviesApiUrl = "https://6734deec5995834c8a912dcd.mockapi.io/movies";
const userId = localStorage.getItem("userId");
const username = localStorage.getItem("username");

document.addEventListener("DOMContentLoaded", () => {
  if (username) {
    document.getElementById("usernameDisplay").textContent = username;
    loadMovies(userId);
  } else {
    window.location.href = "../login/index.html";
  }

  document.getElementById("filterGenre").addEventListener("change", applyFilters);
  document.getElementById("filterRating").addEventListener("change", applyFilters);
  document.getElementById("filterWatchedButton").addEventListener("click", toggleWatchedFilter);
});

async function loadMovies(userId) {
  try {
    const response = await fetch(`${moviesApiUrl}?userId=${userId}`);
    const movies = await response.json();
    displayMovies(movies);
  } catch (error) {
    console.error("Error loading movies", error);
  }
}

function displayMovies(movies) {
  const container = document.getElementById("moviesContainer");
  container.innerHTML = "";

  if (movies.length === 0) {
    container.innerHTML = "<p>No movies to display.</p>";
    return;
  }

  movies.forEach(movie => {
    const movieElement = document.createElement("li");
    movieElement.classList.add("movie-item");

    movieElement.innerHTML = `
      <div class="movie-details">
        <strong>${movie.title}</strong> - ${movie.genre} - ${movie.rating}★
        ${movie.watched ? " Watched" : "Not Watched"}
      </div>
      <div class="movie-actions">
        <button onclick="editMovie('${movie.id}', '${movie.title}', '${movie.genre}', '${movie.rating}', ${movie.watched})">Edit</button>
        <button onclick="deleteMovie('${movie.id}')">Delete</button>
      </div>
    `;

    container.appendChild(movieElement);
  });
}

document.getElementById("addMovieButton").addEventListener("click", async () => {
  const title = document.getElementById("movieTitle").value;
  const genre = document.getElementById("movieGenre").value;
  const rating = document.getElementById("movieRating").value;
  const watched = document.getElementById("movieWatched").checked;

  if (title && genre && rating) {
    try {
      await fetch(moviesApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title, genre, rating, watched })
      });
      loadMovies(userId);
      clearForm();
      alert("Movie added successfully!");
    } catch (error) {
      console.error("Error adding movie", error);
    }
  }
});

function clearForm() {
  document.getElementById("movieTitle").value = "";
  document.getElementById("movieGenre").value = "";
  document.getElementById("movieRating").value = "";
  document.getElementById("movieWatched").checked = false;
}

async function deleteMovie(movieId) {
  try {
    await fetch(`${moviesApiUrl}/${movieId}`, {
      method: "DELETE"
    });
    loadMovies(userId);
    alert("Movie deleted successfully!");
  } catch (error) {
    console.error("Error deleting movie", error);
  }
}

function editMovie(movieId, currentTitle, currentGenre, currentRating, currentWatched) {
  const newTitle = prompt("Edit Title:", currentTitle);
  const newGenre = prompt("Edit Genre:", currentGenre);
  const newRating = prompt("Edit Rating (1 - 5):", currentRating);
  const newWatched = confirm("Mark as watched?") ? true : false;

  if (newTitle && newGenre && newRating) {
    updateMovie(movieId, newTitle, newGenre, newRating, newWatched);
  }
}

async function updateMovie(movieId, title, genre, rating, watched) {
  try {
    await fetch(`${moviesApiUrl}/${movieId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, genre, rating, watched })
    });
    loadMovies(userId);
    alert("Movie updated successfully!");
  } catch (error) {
    console.error("Error updating movie", error);
  }
}

let showWatched = false;
function toggleWatchedFilter() {
  showWatched = !showWatched;
  applyFilters();
}

async function applyFilters() {
  const selectedGenre = document.getElementById("filterGenre").value;
  const selectedRating = document.getElementById("filterRating").value;

  try {
    const response = await fetch(`${moviesApiUrl}?userId=${userId}`);
    const movies = await response.json();

    const filteredMovies = movies.filter(movie => {
      const genreMatch = selectedGenre === "all" || movie.genre === selectedGenre;
      const ratingMatch = selectedRating === "all" || movie.rating == selectedRating;
      const watchedMatch = !showWatched || movie.watched;

      return genreMatch && ratingMatch && watchedMatch;
    });

    displayMovies(filteredMovies);
  } catch (error) {
    console.error("Error applying filters", error);
  }
}

document.getElementById("logoutButton").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "../login/index.html";
});
