require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const { OAuth2Client } = require("google-auth-library");

const app = express();
const port = process.env.PORT || 8080;

// Google Authentication
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

// Route to start OAuth flow
app.get("/auth/google", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
  });
  res.redirect(authUrl);
});

// OAuth2 callback route
app.get("/oauth2callback", async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Log tokens to ensure they are being retrieved correctly
    console.log("Tokens received:", tokens);

    // Save tokens in a cookie
    res.cookie("authToken", tokens.id_token, { httpOnly: false }); // Removed httpOnly for client-side access

    // Log the cookies to ensure they are being set correctly
    console.log("Cookies set:", req.cookies);

    // Redirect to the desired page after login
    res.redirect("/store-token");
  } catch (error) {
    console.error("Error during OAuth2 callback", error);
    res.status(500).send("Authentication failed");
  }
});

// Route to set the authToken in local storage and redirect to index.html
app.get("/store-token", (req, res) => {
  res.send(`
    <script>
      localStorage.setItem('authToken', '${req.cookies.authToken}');
      window.location.href = 'http://localhost:5500/public/html/index.html';
    </script>
  `);
});

// Serve static files
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/index.html"));
});

const bodyParser = require("body-parser");
const dbConfig = require("./dbConfig");
const volunteerController = require("./controllers/volunteerController");
const organisationController = require("./controllers/organisationController");
const postController = require("./controllers/postController");
const listingController = require("./controllers/listingController");
const likesController = require("./controllers/likesController");

const searchPageController = require("./controllers/userSearchPageController");
const userFeedPageController = require("./controllers/userFeedPageController");
const userProfileController = require("./controllers/userProfileController");

const sql = require("mssql");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling
// app.use(staticMiddleware); // Mount the static middleware

app.get("/volunteers", volunteerController.getAllVolunteers); //get all user
app.get("/volunteers/:id", volunteerController.getVolunteerById); // Get user by ID
app.put("/volunteers/:id", volunteerController.updateVolunteerProfile);

app.get("/organisations", organisationController.getAllOrganisations); //get all organisation
app.get("/organisations/:id", organisationController.getOrgById);
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
app.post("/likes", likesController.postLikeById);
app.delete("/likes", likesController.deleteLikesById);

app.post("/userFeedPage", userFeedPageController.postComment);

// app.get("/userProfile/:id", postController.getAllPostsByAccID)
// app.get("/userProfile/:id", volunteerController.getAllFollowersAndFollowing)
app.get("/userProfile/:id", userProfileController.getAccountInfo);

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
