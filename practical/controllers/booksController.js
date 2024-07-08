const Book = require("../models/book");

const getAllBooks = async (req, res) => {
  try {
    const book = await Book.getAllBooks();
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting books");
  }
};

const getBookById = async (req, res) => {
  const bookId = parseInt(req.params.id);
  try {
    const book = await Book.getBookById(bookId);
    if (!book) {
      return res.status(404).send("Book not found");
    }
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving book");
  }
};

const updateBook = async (req, res) => {
  const bookId = parseInt(req.params.id);
  const newAvailability = req.body;

  try {
    const updatedBook = await Book.updateBook(bookId, newAvailability);
    if (!updatedBook) {
      return res.status(404).send("Book not found");
    }
    res.json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating book");
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  updateBook,
};
