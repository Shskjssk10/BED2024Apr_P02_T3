const express = require("express");
const bodyParser = require("body-parser");
const userController = require("./controllers/userController");
const organisationController = require("./controllers/organisationController");
const port = 8080;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling
// app.use(staticMiddleware); // Mount the static middleware

app.get("/users", userController.getAllUsers);
app.get("/organisations", organisationController.getAllOrganisations);

app.get("/userprofilemgmt/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((user) => user.id === userId);
  if (user) {
    res.json(user);
  } else {
    res.status(400).send("User not found");
  }
});

app.put("/userProfilemgmt/:id/", (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;

  const userIndex = users.findIndex((user) => user.id === userId);

  if (userId !== -1) {
    updatedUser.id = userId;
    users[userIndex] = updatedUser;
    res.json(updatedUser);
  } else {
    res.status(404).send("User not found");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
