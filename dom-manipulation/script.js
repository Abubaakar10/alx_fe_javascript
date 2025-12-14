const quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Simplicity is the soul of efficiency.", category: "Programming" }
];

function displayRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = "";

  const p = document.createElement("p");
  p.textContent = quote.text;

  const small = document.createElement("small");
  small.textContent = `Category: ${quote.category}`;

  quoteDisplay.appendChild(p);
  quoteDisplay.appendChild(small);
}

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please enter both quote text and category");
    return;
  }

  quotes.push({ text: newQuoteText, category: newQuoteCategory });

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  
  // LOGIC TO UPDATE DOM
  displayRandomQuote(); 
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
  displayRandomQuote();
});
