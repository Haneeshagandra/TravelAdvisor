// Please replace YOUR_RAPID_API_KEY with your actual RapidAPI key
const RAPID_API_KEY = '3b606a257emsh6ff784120871cbfp10a151jsn5663427cce04';
const apiUrl = 'https://travel-advisor.p.rapidapi.com/';

// Function to fetch data from the RapidAPI endpoint
async function fetchData(filterType, rangeValue) {
  const response = await fetch(`${apiUrl}${filterType}/list-by-latlng?latitude=0&longitude=0&radius=${rangeValue}`, {
    headers: {
      'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
      'x-rapidapi-key': RAPID_API_KEY,
    },
  });

  if (!response.ok) {
    console.error('Failed to fetch data');
    return [];
  }

  const data = await response.json();
  return data.data || [];
}

// Function to render the map with markers
function renderMap(places) {
  const mapContainer = document.getElementById('map');

  // Initialize the map with center and zoom level
  const map = L.map(mapContainer).setView([0, 0], 2);

  // Add a tile layer from OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Loop through the places and add markers to the map
  places.forEach((place) => {
    const { latitude, longitude, name } = place;
    L.marker([latitude, longitude]).addTo(map).bindPopup(name);
  });
}

// Function to handle filter change
function handleFilterChange() {
  const filterType = document.getElementById('filterSelect').value;
  const rangeValue = document.getElementById('rangeSlider').value;
  const dateContainer = document.getElementById('dateContainer');
  const showDates = filterType === 'hotels';

  // Show/hide the "Enter Dates" button based on filter type
  dateContainer.innerHTML = showDates
    ? '<button id="dateButton">Enter Dates</button>'
    : 'Filter type does not require date input.';

  // Fetch data and render the map
  fetchData(filterType, rangeValue)
    .then(renderMap)
    .catch((error) => console.error(error));
}

// Function to handle date button click (only for hotels)
function handleDateButtonClick() {
  // Implement the date input functionality here
  // For example, you can use a date picker or any other logic as needed
  console.log('Date button clicked');
}

// Event listeners
document.getElementById('filterSelect').addEventListener('change', handleFilterChange);
document.getElementById('rangeSlider').addEventListener('input', handleFilterChange);
document.getElementById('dateContainer').addEventListener('click', function (event) {
  if (event.target.id === 'dateButton') {
    handleDateButtonClick();
  }
});

// Initial fetch and render on page load
handleFilterChange();


// Function to handle search input
function handleSearchInput() {
  const searchInput = document.getElementById('searchInput').value;
  const filterType = document.getElementById('filterSelect').value;
  const rangeValue = document.getElementById('rangeSlider').value;
  const dateContainer = document.getElementById('dateContainer');
  const showDates = filterType === 'hotels';

  // Show/hide the "Enter Dates" button based on filter type
  dateContainer.innerHTML = showDates
    ? '<button id="dateButton">Enter Dates</button>'
    : 'Filter type does not require date input.';

  // Fetch data and render the map
  fetchData(filterType, rangeValue)
    .then((places) => {
      // Filter the places based on the search query
      const filteredPlaces = places.filter((place) =>
        place.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      renderMap(filteredPlaces);
    })
    .catch((error) => console.error(error));
}

// Event listener for search input
document.getElementById('searchInput').addEventListener('input', handleSearchInput);


// Initialize the map with center and zoom level
const map = L.map('map').setView([0, 0], 2);

// Add a tile layer from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Function to render the map with markers
function renderMap(places) {
  // Clear existing markers from the map
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  // Loop through the places and add markers to the map
  places.forEach((place) => {
    const { latitude, longitude, name } = place;
    L.marker([latitude, longitude]).addTo(map).bindPopup(name);
  });
}

// Function to handle search input
async function handleSearchInput() {
  const searchInput = document.getElementById('searchInput').value;
  const filterType = document.getElementById('filterSelect').value;
  const rangeValue = document.getElementById('rangeSlider').value;
  const dateContainer = document.getElementById('dateContainer');
  const showDates = filterType === 'hotels';

  // Show/hide the "Enter Dates" button based on filter type
  dateContainer.innerHTML = showDates
    ? '<button id="dateButton">Enter Dates</button>'
    : 'Filter type does not require date input.';

  // Fetch data and render the map
  try {
    const response = await fetch(`${apiUrl}${filterType}/list-by-latlng?latitude=0&longitude=0&radius=${rangeValue}`, {
      headers: {
        'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
        'x-rapidapi-key': RAPID_API_KEY,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch data');
      return;
    }

    const data = await response.json();
    const places = data.data || [];

    // Filter the places based on the search query
    const filteredPlaces = places.filter((place) => place.name.toLowerCase().includes(searchInput.toLowerCase()));
    renderMap(filteredPlaces);
  } catch (error) {
    console.error(error);
  }
}

// Event listener for search input
document.getElementById('searchInput').addEventListener('input', debounce(handleSearchInput, 500));


// Function to add debounce behavior to functions
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}
