// book.test.js
const Book = require("../models/book");
const sql = require("mssql");

jest.mock("mssql"); // Mock the mssql library

describe("Book.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all books from the database", async () => {
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

    const mockRequest = {
      query: jest.fn().mockResolvedValue({ recordset: mockBooks }),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

    const books = await Book.getAllBooks();

    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(mockConnection.close).toHaveBeenCalledTimes(1);
    expect(books).toHaveLength(10);
    expect(books[0]).toBeInstanceOf(Book);
    expect(books[0].book_id).toBe(1);
    expect(books[0].title).toBe("To Kill a Mockingbird");
    expect(books[0].author).toBe("Harper Lee");
    expect(books[0].availability).toBe("Y");
    // ... Add assertions for the second book
  });

  it("should handle errors when retrieving books", async () => {
    const errorMessage = "Database Error";
    sql.connect.mockRejectedValue(new Error(errorMessage));
    await expect(Book.getAllBooks()).rejects.toThrow(errorMessage);
  });
});

// book.test.js (continue in the same file)

// Write Test Cases: Implement the following test cases within the describe block:

// Test Case 1: Successful Update:
// Set up mock data for the book to update and the updated availability status.
// Mock the database connection, request, and query to simulate a successful update.
// Call updateBookAvailability and verify that:
// The correct SQL query and parameters were passed.
// The updated book object is returned.
// Test Case 2: Book Not Found:
// Mock the database interactions to simulate a scenario where the book with the given ID doesn't exist.
// Call updateBookAvailability and verify that it returns null.
// Test Case 3: Database Error:
// Mock the database interactions to throw an error.
// Call updateBookAvailability and verify that it throws the appropriate error.
// Remember:

// Use beforeEach to reset your mocks before each test case to keep your tests independent.
// Leverage Jest's assertion methods (e.g., expect, toBe, toHaveBeenCalledWith, etc.) to verify the expected behavior.
// Aim for comprehensive test coverage to build confidence in the reliability of your model's functionality.
describe("Book.updateBookAvailability", () => {
  // ... mock mssql and other necessary components

  it("should update the availability of a book", async () => {
    // ... arrange: set up mock book data and mock database interaction
    // ... act: call updateBookAvailability with the test data
    // ... assert: check if the database was updated correctly and the updated book is returned
  });

  it("should return null if book with the given id does not exist", async () => {
    // ... arrange: set up mocks for a non-existent book id
    // ... act: call updateBookAvailability
    // ... assert: expect the function to return null
  });

  // Add more tests for error scenarios (e.g., database error)
});
