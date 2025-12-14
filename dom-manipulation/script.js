// Quote data
let quotes = [];

/* =========================
   STORAGE FUNCTIONS
========================= */

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Load quotes from localStorage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

/* =========================
   DISPLAY FUNCTIONS
========================= */

// Display a random quote
function showRandomQuote(filteredQuotes = quotes) {
    if (filteredQuotes.length === 0) {
        document.getElementById('quoteDisplay').textContent = 'No quotes available.';
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];

    document.getElementById('quoteDisplay').textContent =
        `"${quote.text}" — ${quote.category}`;

    // Save last viewed quote in sessionStorage
    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

// Populate category dropdown
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    const categories = [...new Set(quotes.map(q => q.category))];

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore last selected filter
    const savedFilter = localStorage.getItem('selectedCategory');
    if (savedFilter) {
        categoryFilter.value = savedFilter;
        filterQuotes();
    }
}

// Filter quotes by category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('selectedCategory', selectedCategory);

    if (selectedCategory === 'all') {
        showRandomQuote(quotes);
    } else {
        const filtered = quotes.filter(q => q.category === selectedCategory);
        showRandomQuote(filtered);
    }
}

/* =========================
   ADD QUOTES
========================= */

function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');

    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (!text || !category) {
        alert('Please enter both quote text and category.');
        return;
    }

    const newQuote = { text, category };
    quotes.push(newQuote);

    saveQuotes();
    populateCategories();
    showRandomQuote();

    textInput.value = '';
    categoryInput.value = '';
}

/* =========================
   JSON IMPORT / EXPORT
========================= */

function exportQuotes() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], {
        type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quotes.json';
    link.click();

    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

/* =========================
   SERVER SYNC (SIMULATION)
========================= */

async function syncWithServer() {
    const status = document.getElementById('syncStatus');
    status.textContent = 'Syncing with server...';

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const serverData = await response.json();

        // Server wins strategy
        quotes = serverData.slice(0, 5).map(item => ({
            text: item.title,
            category: 'Server'
        }));

        saveQuotes();
        populateCategories();
        showRandomQuote();

        status.textContent = 'Data synced from server.';
    } catch (error) {
        status.textContent = 'Server sync failed.';
    }
}

/* =========================
   INITIALIZATION
========================= */

document.addEventListener('DOMContentLoaded', () => {
    loadQuotes();

    // Load last viewed quote if exists
    const lastQuote = sessionStorage.getItem('lastQuote');
    if (lastQuote) {
        const quote = JSON.parse(lastQuote);
        document.getElementById('quoteDisplay').textContent =
            `"${quote.text}" — ${quote.category}`;
    } else {
        showRandomQuote();
    }

    populateCategories();

    document.getElementById('newQuote').addEventListener('click', () => {
        filterQuotes();
    });

    // Periodic server sync (simulation)
    setInterval(syncWithServer, 30000);
});

