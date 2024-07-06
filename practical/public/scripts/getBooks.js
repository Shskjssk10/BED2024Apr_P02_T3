document.addEventListener("DOMContentLoaded", async function () {
  console.log("dom loaded");

  const getBooksButton = document.getElementById("books");
  getBooksButton.addEventListener("click", async function () {
    const response = await fetch("http://localhost:8080/books");

    // Check the response status code
    if (!response.ok) {
      console.error("Error:", response.statusText);
      return; // Handle errors appropriately (e.g., display error message)
    }

    // Regardless of initial browser rendering, parse the JSON data
    const data = await response.json();

    const bookList = document.getElementById("book-list");

    data.forEach((book) => {
      const bookItem = document.createElement("div");
      bookItem.classList.add("book"); // Add a CSS class for styling

      // Create elements for title, author, etc. and populate with book data
      const titleElement = document.createElement("h2");
      titleElement.textContent = book.title;

      const authorElement = document.createElement("p");
      authorElement.textContent = `By: ${book.author}`;

      const availability = document.createElement("p");
      availability.textContent = `Availability: ${book.availability}`;

      // ... add more elements for other book data (optional)

      bookItem.appendChild(titleElement);
      bookItem.appendChild(authorElement);
      bookItem.appendChild(availability);
      // ... append other elements

      bookList.appendChild(bookItem);
    });
  });
});
