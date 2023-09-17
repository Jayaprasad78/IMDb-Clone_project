const apiKey = '1b1b60c0';

// Function to search for movies
async function searchMovies(query) {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`);
    const data = await response.json();
    return data.Search || [];
}

// Function to add a movie to favourites
async function addToFavourites(event) {
    const imdbID = event.target.dataset.imdbid;
    const movie = await getMovieDetails(imdbID);
    if (movie) {
        const favouritesList = JSON.parse(localStorage.getItem('favourites')) || [];
        if (!favouritesList.some(m => m.imdbID === movie.imdbID)) {
            favouritesList.push(movie);
            localStorage.setItem('favourites', JSON.stringify(favouritesList));
            alert(`${movie.Title} has been added to your favourites!`);
        } else {
            alert(`${movie.Title} is already in your favourites!`);
        }
    }
}

// Function to display search results on the index.html page
function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('searchResults');
    searchResultsContainer.innerHTML = '';

    results.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('card', 'col-md-4', 'mb-4');
        movieCard.innerHTML = `
            <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
            <div class="card-body">
                <h5 class="card-title">${movie.Title}</h5>
                <button class="btn btn-primary btn-sm favourite-button" data-imdbid="${movie.imdbID}">Add to Favourites</button>
                <a href="movie.html?id=${movie.imdbID}" class="btn btn-secondary btn-sm more-button">More</a>
            </div>
        `;
        searchResultsContainer.appendChild(movieCard);
    });

    const favouriteButtons = document.querySelectorAll('.favourite-button');
    favouriteButtons.forEach(button => {
        button.addEventListener('click', addToFavourites);
    });
}

// Event listener for the Search Button
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', function () {
    const query = document.getElementById('searchInput').value.trim();
    if (query.length > 0) {
        searchMovies(query)
            .then(results => {
                displaySearchResults(results);
                // Store the search results in LocalStorage
                localStorage.setItem('searchResults', JSON.stringify(results));
            })
            .catch(error => console.error('Error searching movies:', error));
    }
});



// Function to get movie details by IMDb ID
async function getMovieDetails(imdbID) {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`);
    const data = await response.json();
    return data.Response === 'True' ? data : null;
}

// Automatically display search results if available from previous search
const previousSearchResults = JSON.parse(localStorage.getItem('searchResults'));
if (previousSearchResults && previousSearchResults.length > 0) {
    displaySearchResults(previousSearchResults);
}

const quoteText = document.getElementById('quoteText');
const quoteSpeed = 200; // Time (in milliseconds) for each word to appear
const movieQuotations = [
    "I feel the need... the need for speed. - Top Gun",
"Houston, we have a problem. - Apollo 13",
"You talking to me? - Taxi Driver",
"You had me at 'hello.' - Jerry Maguire",
"Here's Johnny! - The Shining",
"Keep your friends close, but your enemies closer. - The Godfather Part II",
"You can't change the wind, but you can adjust your sails. - The Pursuit of Happyness",
"I'm the king of the world! - Titanic",
"I see dead people. - The Sixth Sense",
"Life is like a box of chocolates; you never know what you're gonna get. - Forrest Gump",
];
let currentQuoteIndex = 0;

// Function to display the quotation word by word
async function displayQuoteWordByWord() {
    const quote = movieQuotations[currentQuoteIndex];
    const words = quote.split(' ');

    for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, quoteSpeed));
        quoteText.textContent = words.slice(0, i + 1).join(' ');
    }

    // After displaying all words, wait for 15 seconds and then show the next quote
    await new Promise(resolve => setTimeout(resolve, 800));
    showNextQuote();
}

// Function to show the next quotation
function showNextQuote() {
    currentQuoteIndex = (currentQuoteIndex + 1) % movieQuotations.length;
    displayQuoteWordByWord();
}

// Display the first quotation on page load
displayQuoteWordByWord();
