// Define your API key for the OMDB API.
const apiKey = '1b1b60c0';

// Function to get movie details by IMDb ID.
async function getMovieDetailsById(imdbID) {
    // Fetch movie details from the OMDB API using the provided IMDb ID.
    const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`);
    const data = await response.json(); // Parse the JSON response.
    return data.Response === 'True' ? data : null; // Check if the response is valid.
}

// Function to display movie details on the webpage.
function displayMovieDetails(movie) {
    // Get the container element where movie details will be displayed.
    const movieDetailsContainer = document.getElementById('movieDetails');
    
    // Populate the container with HTML for displaying movie details.
    movieDetailsContainer.innerHTML = `
        <div class="card mb-2">
            <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
            <div class="card-body">
                <h5 class="card-title">${movie.Title}</h5>
                <p>${movie.Plot}</p>
                <p><strong>Year:</strong> ${movie.Year}</p>
                <p><strong>Director:</strong> ${movie.Director}</p>
                <p><strong>Genre:</strong> ${movie.Genre}</p>
                <p><strong>Runtime:</strong> ${movie.Runtime}</p>
                <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
                <!-- Add other movie details here -->
            </div>
        </div>
    `;
}

// Event listener for when the DOM content is loaded.
document.addEventListener('DOMContentLoaded', () => {
    // Get the IMDb ID from the URL query parameters.
    const urlParams = new URLSearchParams(window.location.search);
    const imdbID = urlParams.get('id');

    if (imdbID) {
        // Call the getMovieDetailsById function with the IMDb ID.
        getMovieDetailsById(imdbID)
            .then(movie => {
                if (movie) {
                    // If movie details are found, display them on the webpage.
                    displayMovieDetails(movie);
                } else {
                    // If movie details are not found, show an error message.
                    const movieDetailsContainer = document.getElementById('movieDetails');
                    movieDetailsContainer.innerHTML = '<p>Movie details not found.</p>';
                }
            })
            .catch(error => {
                // Handle errors and display an error message.
                console.error('Error fetching movie details:', error);
                const movieDetailsContainer = document.getElementById('movieDetails');
                movieDetailsContainer.innerHTML = '<p>Error fetching movie details.</p>';
            });
    }
});
