const express = require("express");
const bodyParser = require("body-parser");
const dbConfig = require("./dbConfig");
const userController = require("./controllers/userController");
const organisationController = require("./controllers/organisationController");
const sql = require("mssql");
const port = 8080;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling
// app.use(staticMiddleware); // Mount the static middleware

app.get("/users", userController.getAllUsers); //get all user
app.get("/users/:username", userController.getUserByUsername);
app.get("/organisations", organisationController.getAllOrganisations); //get all organisation
app.put("/users/:username", userController.updateUserProfile);

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
