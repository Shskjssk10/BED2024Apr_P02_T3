const express = require("express");
const bodyParser = require("body-parser");
const dbConfig = require("./dbConfig");
const volunteerController = require("./controllers/volunteerController");
const organisationController = require("./controllers/organisationController");
const postController = require("./controllers/postController")
const listingController = require("./controllers/listingController")
const likesController = require("./controllers/likesController")

const searchPageController = require("./controllers/userSearchPageController");
const userFeedPageController = require("./controllers/userFeedPageController");
const userProfileController = require("./controllers/userProfileController")

const sql = require("mssql");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling
// app.use(staticMiddleware); // Mount the static middleware

app.get("/volunteers", volunteerController.getAllVolunteers); //get all user
app.get("/volunteers/:id", volunteerController.getVolunteerById); // Get user by ID
app.get("/organisations", organisationController.getAllOrganisations); //get all organisation

app.get("/organisations/:id", organisationController.getOrgById);
app.put("/volunteers/:id", volunteerController.updateVolunteerProfile);
app.put("/organisations/:id", organisationController.updateOrgProfile);

app.get("/organisations/:OrgName", organisationController.getOrgByName);
//app.put("/organisations/:OrgName", organisationController.updateOrgProfile);

// Caden's Parts
app.get("/searchPage", searchPageController.getAllAccounts);
app.post("/searchPage", volunteerController.postFollow);
app.delete("/searchPage", volunteerController.deleteFollow);
app.get("/searchPage/:username", searchPageController.getAccountByUsername);

// Likes' end points
app.get("/likes/:id", likesController.getAllLikesById);
app.post("likes", likesController.postLikeById);
app.delete("likes", likesController.deleteLikesById);

app.post("/userFeedPage", userFeedPageController.postComment);

// app.get("/userProfile/:id", postController.getAllPostsByAccID)
// app.get("/userProfile/:id", volunteerController.getAllFollowersAndFollowing)
app.get("/userProfile/:id", userProfileController.getAccountInfo)

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
  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  const authRoutes = require("./routes/authRoutes");
  app.use("/auth", authRoutes);

  process.on("SIGINT", async () => {
    console.log("Server is gracefully shutting down");
    // Perform cleanup tasks (e.g., close database connections)
    await sql.close();
    console.log("Database connection closed");
    process.exit(0); // Exit with code 0 indicating successful shutdown
  });
});
