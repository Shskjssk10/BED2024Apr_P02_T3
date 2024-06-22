const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./public/routes/authRoutes.js"); // Ensure this path is correct
const { poolPromise } = require("./dbConfig.js");

require("dotenv").config();

const port = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log to confirm middleware is being used
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Database connection
poolPromise
  .then((pool) => {
    console.log("Database connected successfully.");

    // Routes
    app.use(
      "/auth",
      (req, res, next) => {
        console.log("Auth route accessed");
        next();
      },
      authRoutes
    );

    // Example route
    app.get("/", (req, res) => {
      res.send("Server is running.");
    });

    // Start server
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    // Failed to connect to database
    console.error("Database connection failed: ", err);
    process.exit(1); // Exit the process if unable to connect to the database
  });
