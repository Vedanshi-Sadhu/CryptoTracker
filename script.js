// Fetch cryptocurrency data from CoinGecko API
const apiURL = 'https://api.coingecko.com/api/v3/coins/markets';
const cryptocurrenciesList = document.getElementById('cryptocurrency-list');
const comparisonList = document.getElementById('comparison-section');
let selectedCryptosForComparison = JSON.parse(localStorage.getItem('selectedCryptosForComparison')) || []; // Retrieve from localStorage
let selectedSortOption = localStorage.getItem('selectedSortOption') || 'price'; // Retrieve sorting option from localStorage

// Apply dark mode preference from localStorage
if (localStorage.getItem('darkModeEnabled') === 'true') {
    document.body.classList.add('dark-theme');
}

// Fetch function to retrieve cryptocurrencies data
async function fetchCryptocurrencyData() {
    try {
        const response = await fetch(`${apiURL}?vs_currency=usd&order=${selectedSortOption}_desc&per_page=10&page=1`);
        const data = await response.json();
        displayCryptocurrencyData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Display the cryptocurrency list
function displayCryptocurrencyData(cryptos) {
    cryptocurrenciesList.innerHTML = ''; // Clear existing content
    cryptos.forEach(crypto => {
        const cryptoCard = document.createElement('div');
        cryptoCard.classList.add('crypto-card');
        const priceChangeClass = crypto.price_change_percentage_24h > 0 ? 'price-up' : 'price-down';
        cryptoCard.innerHTML = `
            <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
            <p class="crypto-price">Price: $${crypto.current_price.toFixed(2)} 
                <svg class="arrow ${priceChangeClass}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 2l-6 6h4v8h4v-8h4z"/>
                </svg>
            </p>
            <p class="crypto-change">24h Change: ${crypto.price_change_percentage_24h.toFixed(2)}%</p>
            <p><button onclick="addCryptoToComparison('${crypto.id}', '${crypto.name}', '${crypto.symbol}', ${crypto.current_price}, ${crypto.price_change_percentage_24h}, ${crypto.market_cap})">Add to Compare</button></p>
            <p><button class="favorite-button" onclick="toggleFavorite('${crypto.id}')">Favorite</button></p>
        `;
        cryptocurrenciesList.appendChild(cryptoCard);
    });
}

// Add selected cryptocurrency to comparison
function addCryptoToComparison(cryptoId, name, symbol, price, change, marketCap) {
    if (selectedCryptosForComparison.length >= 5) {
        alert('You can only compare up to 5 cryptocurrencies.');
        return;
    }

    if (selectedCryptosForComparison.includes(cryptoId)) {
        alert('This cryptocurrency is already in your comparison list.');
        return;
    }

    selectedCryptosForComparison.push(cryptoId);
    localStorage.setItem('selectedCryptosForComparison', JSON.stringify(selectedCryptosForComparison)); // Save to localStorage
    const comparisonCard = document.createElement('div');
    comparisonCard.classList.add('comparison-card');
    comparisonCard.id = `crypto-${cryptoId}`;
    comparisonCard.innerHTML = `
        <h3>${name} (${symbol.toUpperCase()})</h3>
        <p>Price: $${price.toFixed(2)}</p>
        <p>24h Change: ${change.toFixed(2)}%</p>
        <p>Market Cap: $${marketCap.toLocaleString()}</p>
        <p><button onclick="removeCryptoFromComparison('${cryptoId}')">Remove</button></p>
    `;
    comparisonList.appendChild(comparisonCard);
}

// Remove cryptocurrency from comparison
function removeCryptoFromComparison(cryptoId) {
    const comparisonCard = document.getElementById(`crypto-${cryptoId}`);
    if (comparisonCard) {
        comparisonList.removeChild(comparisonCard);
        selectedCryptosForComparison = selectedCryptosForComparison.filter(id => id !== cryptoId); // Remove from the array
        localStorage.setItem('selectedCryptosForComparison', JSON.stringify(selectedCryptosForComparison)); // Save updated list
    }
}

// Toggle Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-theme');
    const darkModeEnabled = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkModeEnabled', darkModeEnabled); // Save dark mode preference to localStorage
}

// Change Sorting Options
document.getElementById('sort-cryptos').addEventListener('change', function() {
    selectedSortOption = this.value;
    localStorage.setItem('selectedSortOption', selectedSortOption); // Save sorting option to localStorage
    fetchCryptocurrencyData();
});

// Load the initial data when the page loads
window.onload = fetchCryptocurrencyData;
