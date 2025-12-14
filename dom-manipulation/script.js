// Load quotes from local storage or default
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" }
];

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Populate categories
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

  const saved = localStorage.getItem('selectedCategory');
  if (saved) filter.value = saved;
}

// Display quote
function showRandomQuote(list = quotes) {
  const display = document.getElementById('quoteDisplay');
  if (list.length === 0) {
    display.textContent = "No quotes available.";
    return;
  }
  const random = list[Math.floor(Math.random() * list.length)];
  display.textContent = `"${random.text}" — ${random.category}`;
  sessionStorage.setItem('lastQuote', JSON.stringify(random));
}

// Filter quotes
function filterQuotes() {
  const category = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', category);

  if (category === "all") {
    showRandomQuote(quotes);
  } else {
    showRandomQuote(quotes.filter(q => q.category === category));
  }
}

// Add quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!text || !category) {
    alert("Enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();

  document.getElementById('newQuoteText').value = "";
  document.getElementById('newQuoteCategory').value = "";

  alert("Quote added!");
}

// =============================
// SERVER SYNC SIMULATION
// =============================

// Simulated server fetch
async function fetchServerQuotes() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
  const data = await response.json();

  // Convert server data to quote format
  return data.map(item => ({
    text: item.title,
    category: "Server"
  }));
}

// Sync local data with server (server wins)
async function syncWithServer() {
  const status = document.getElementById('syncStatus');

  try {
    const serverQuotes = await fetchServerQuotes();

    // Conflict resolution: server overwrites local
    quotes = serverQuotes;
    saveQuotes();
    populateCategories();
    filterQuotes();

    status.textContent = "Data synced with server successfully.";
    status.style.color = "green";
  } catch (error) {
    status.textContent = "Failed to sync with server.";
    status.style.color = "red";
  }
}

// Periodic sync every 30 seconds
setInterval(syncWithServer, 30000);

// =============================
// EVENT LISTENERS
// =============================

document.getElementById('newQuote').addEventListener('click', filterQuotes);

// Initialize app
document.addEventListener('DOMContentLoaded', function () {
  populateCategories();
  filterQuotes();
  syncWithServer();
});

