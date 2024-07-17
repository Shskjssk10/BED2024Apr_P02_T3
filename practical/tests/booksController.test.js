// booksController.test.js

const booksController = require("../controllers/booksController");
const Book = require("../models/book");

// Mock the Book model
jest.mock("../models/book"); // Replace with the actual path to your Book model

describe("booksController.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it("should fetch all books and return a JSON response", async () => {
    const mockBooks = [
      {
        book_id: 1,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        availability: "Y",
      },
      { book_id: 2, title: "1984", author: "George Orwell", availability: "N" },
      {
        book_id: 3,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        availability: "Y",
      },
      {
        book_id: 4,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        availability: "Y",
      },
      {
        book_id: 5,
        title: "Moby-Dick",
        author: "Herman Melville",
        availability: "N",
      },
      {
        book_id: 6,
        title: "War and Peace",
        author: "Leo Tolstoy",
        availability: "Y",
      },
      {
        book_id: 7,
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        availability: "N",
      },
      {
        book_id: 8,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        availability: "Y",
      },
      {
        book_id: 9,
        title: "Crime and Punishment",
        author: "Fyodor Dostoevsky",
        availability: "Y",
      },
      {
        book_id: 10,
        title: "Brave New World",
        author: "Aldous Huxley",
        availability: "N",
      },
    ];

    // Mock the Book.getAllBooks function to return the mock data
    Book.getAllBooks.mockResolvedValue(mockBooks);

    const req = {};
    const res = {
      json: jest.fn(), // Mock the res.json function
    };

    await booksController.getAllBooks(req, res);

    expect(Book.getAllBooks).toHaveBeenCalledTimes(1); // Check if getAllBooks was called
    expect(res.json).toHaveBeenCalledWith(mockBooks); // Check the response body
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Book.getAllBooks.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await booksController.getAllBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error retrieving books");
  });
});

const { updateBook } = require("../controllers/booksController"); // Adjust the path to your actual controller

describe("updateBook", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: "1" },
      body: { available: true },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("should update the book and return the updated book", async () => {
    const updatedBook = { id: 1, title: "Sample Book", available: true };

    Book.updateBook.mockResolvedValue(updatedBook);

    await updateBook(req, res, next);

    expect(Book.updateBook).toHaveBeenCalledWith(1, req.body);
    expect(res.json).toHaveBeenCalledWith(updatedBook);
    expect(res.status).not.toHaveBeenCalledWith(404);
    expect(res.send).not.toHaveBeenCalledWith("Book not found");
  });

  it("should return 404 if the book is not found", async () => {
    Book.updateBook.mockResolvedValue(null);

    await updateBook(req, res, next);

    expect(Book.updateBook).toHaveBeenCalledWith(1, req.body);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith("Book not found");
  });

  it("should return 500 if an error occurs", async () => {
    const errorMessage = "Error updating book";
    Book.updateBook.mockRejectedValue(new Error(errorMessage));
    jest.spyOn(console, "error").mockImplementation(() => {}); // Mock console.error

    await updateBook(req, res, next);

    expect(Book.updateBook).toHaveBeenCalledWith(1, req.body);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error updating book");
    expect(console.error).toHaveBeenCalledWith(expect.any(Error));
  });
});
