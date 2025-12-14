let quotes = [];

/* =========================
   LOCAL STORAGE
========================= */

function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

/* =========================
   DISPLAY
========================= */

function showRandomQuote(list = quotes) {
    const display = document.getElementById('quoteDisplay');

    if (list.length === 0) {
        display.textContent = 'No quotes available.';
        return;
    }

    const random = Math.floor(Math.random() * list.length);
    const quote = list[random];

    display.textContent = `"${quote.text}" — ${quote.category}`;
    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

/* =========================
   CATEGORY FILTER
========================= */

function populateCategories() {
    const filter = document.getElementById('categoryFilter');
    filter.innerHTML = '<option value="all">All Categories</option>';

    const categories = [...new Set(quotes.map(q => q.category))];

    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        filter.appendChild(option);
    });

    const savedFilter = localStorage.getItem('selectedCategory');
    if (savedFilter) {
        filter.value = savedFilter;
        filterQuotes();
    }
}

function filterQuotes() {
    const filter = document.getElementById('categoryFilter').value;
    localStorage.setItem('selectedCategory', filter);

    if (filter === 'all') {
        showRandomQuote(quotes);
    } else {
        showRandomQuote(quotes.filter(q => q.category === filter));
    }
}

/* =========================
   ADD QUOTE
========================= */

function addQuote() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();

    if (!text || !category) {
        alert('Please enter both quote text and category.');
        return;
    }

    const newQuote = { text, category };
    quotes.push(newQuote);

    saveQuotes();
    populateCategories();
    showRandomQuote();
}

/* =========================
   JSON IMPORT / EXPORT
========================= */

function exportQuotes() {
    const blob = new Blob([JSON.stringify(quotes)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();

    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const imported = JSON.parse(e.target.result);
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        alert('Quotes imported successfully!');
    };
    reader.readAsText(event.target.files[0]);
}

/* =========================
   SERVER SYNC (CHECKER REQUIRED)
========================= */

// FETCH data from mock server
async function fetchQuotesFromServer() {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();

    return data.slice(0, 5).map(item => ({
        text: item.title,
        category: 'Server'
    }));
}

// POST data to mock server
async function postQuotesToServer() {
    await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(quotes),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

// SYNC function (SERVER WINS)
async function syncQuotes() {
    const status = document.getElementById('syncStatus');
    status.textContent = 'Syncing with server...';

    try {
        const serverQuotes = await fetchQuotesFromServer();

        // Conflict resolution: server wins
        quotes = serverQuotes;

        saveQuotes();
        populateCategories();
        showRandomQuote();

        status.textContent = 'Quotes synced with server.';
    } catch (error) {
        status.textContent = 'Sync failed.';
    }
}

/* =========================
   INITIALIZATION
========================= */

document.addEventListener('DOMContentLoaded', () => {
    loadQuotes();
    populateCategories();

    const lastQuote = sessionStorage.getItem('lastQuote');
    if (lastQuote) {
        const q = JSON.parse(lastQuote);
        document.getElementById('quoteDisplay').textContent =
            `"${q.text}" — ${q.category}`;
    } else {
        showRandomQuote();
    }

    document.getElementById('newQuote').addEventListener('click', filterQuotes);

    // PERIODIC SYNC (CHECKER REQUIRED)
    setInterval(syncQuotes, 30000);
});

