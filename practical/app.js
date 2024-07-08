/*
- develop new online system to manage book borrowing and user accounts 
- api needs to be secure 
    - only authorised users are allowed to access the system
    - librarians and registered library members
only library members nad librarians can view books availablility 
- librarians have access to update a books availability 
- develop user auth (registration and login) and password encryption
- JWT tokens
- secure hashing (bycryptjs) JWT
- implement auth using roles (members, librarians) to control access to 
different functionalities 
- use database mssql to store user information user table and books table 
- endpoints req 
    - user reg (POST /register)
    - login (POST /login)
    - get all books (GET /books) - accessible by librarians and members
    - update book availability (PUT /books/:bookId/availability) only librarians
- basic error handling 
- Library Members (Students):
    - Register for an account (POST /register)
    - Login to access the system (POST /login)
    - View a list of books and their availability (Y/N) (GET /books)
- Librarians:
    - Register for an account (POST /register)
    - Login to access the system (POST /login)
    - View a list of books and their availability (Y/N) (GET /books)
    - Update the availability of books (Y/N) (PUT /books/:bookId/availability)
*/

const express = require("express");
const sql = require("mssql");
const bookController = require("./controllers/booksController");
const userController = require("./controllers/usersController");
const bodyParser = require("body-parser");
const dbConfig = require("./dbConfig");
const verifyJWT = require("./middlewares/authValidate");
const staticMiddleware = express.static("public");
const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(staticMiddleware);

app.get("/books", bookController.getAllBooks);
app.get("/books/:id", bookController.getBookById);
app.put("/books/:id/availability", verifyJWT, bookController.updateBook);
app.get("/users", userController.getAllUsers);
app.get("/users/:username", userController.getUserByUsername);
app.post("/register", userController.registerUser);
app.post("/login", userController.login);

app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
  }

  console.log(`Server listening on port ${port}`);
});

process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});
