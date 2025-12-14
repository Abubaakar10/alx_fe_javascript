var quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Simplicity is the soul of efficiency.", category: "Programming" }
];

// Function to display a random quote
function displayRandomQuote() {
  var quoteDisplay = document.getElementById("quoteDisplay");
  var randomIndex = Math.floor(Math.random() * quotes.length);
  var quote = quotes[randomIndex];

  quoteDisplay.innerHTML = ""; // Clear existing content

  var p = document.createElement("p");
  p.textContent = quote.text;

  var small = document.createElement("small");
  small.textContent = "Category: " + quote.category; // Simple string concatenation

  quoteDisplay.appendChild(p);
  quoteDisplay.appendChild(small);
}

// Function to add a new quote
function addQuote() {
  var newQuoteText = document.getElementById("newQuoteText").value.trim();
  var newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please enter both quote text and category");
    return;
  }

  // Add to array
  quotes.push({ text: newQuoteText, category: newQuoteCategory });

  // Clear inputs
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  
  // Update the DOM immediately to show the new data (or a random one)
  displayRandomQuote(); 
}

// Event Listener for the "Show New Quote" button
// We check if the element exists first to prevent errors
var newQuoteBtn = document.getElementById("newQuote");
if (newQuoteBtn) {
  newQuoteBtn.addEventListener("click", displayRandomQuote);
}

// Initial call to display a quote when the page loads
displayRandomQuote();
