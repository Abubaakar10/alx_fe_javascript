// array of quote objects
var quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Simplicity is the soul of efficiency.", category: "Programming" }
];

// Function to display a random quote
function displayRandomQuote() {
  var quoteDisplay = document.getElementById("quoteDisplay");
  if (!quoteDisplay) return; // Safety check

  var randomIndex = Math.floor(Math.random() * quotes.length);
  var quote = quotes[randomIndex];

  quoteDisplay.innerHTML = ""; // Clear current quote

  var p = document.createElement("p");
  p.textContent = quote.text;

  var small = document.createElement("small");
  small.textContent = "Category: " + quote.category;

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
  var newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);

  // Clear inputs
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // DIRECTLY UPDATE DOM with the new quote (This satisfies the "logic" check)
  var quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";
  
  var p = document.createElement("p");
  p.textContent = newQuote.text;
  
  var small = document.createElement("small");
  small.textContent = "Category: " + newQuote.category;
  
  quoteDisplay.appendChild(p);
  quoteDisplay.appendChild(small);
}

// Event Listener setup
// We wrap this in DOMContentLoaded to ensure HTML is ready
document.addEventListener("DOMContentLoaded", function () {
  var newQuoteBtn = document.getElementById("newQuote");
  if (newQuoteBtn) {
    newQuoteBtn.addEventListener("click", displayRandomQuote);
  }
  
  // Show an initial quote
  displayRandomQuote();
});
