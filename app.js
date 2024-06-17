const express = require("express");
const bodyParser = require("body-parser");
const port = 8080;
const app = express();

let users = [
  {
    id: 1,
    user: "Hendrik",
    userName: "Hendrikyong",
    email: "test@gmail.com",
    phoneNum: "90909090",
    bio: "test bio",
    gender: "male",
    password: "test1234",
  },
];

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/users", (req, res) => {
  res.json(users);
});

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
