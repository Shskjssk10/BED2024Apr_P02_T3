// book.test.js
const Book = require("../models/book");
const dbConfig = require("../dbConfig");
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
