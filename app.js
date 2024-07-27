require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { OAuth2Client } = require("google-auth-library");

const app = express();
const port = process.env.PORT || 8080;

// Body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Google Authentication
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const {
  authAccount,
  createVolunteer,
  createOrganisation,
  checkGoogleAccount,
  googleSignupVolunteerController,
  googleSignupOrganisationController,
} = require("./controllers/authController.js");

const { verifyToken } = require("./middlewares/authMiddleware.js");
const {
  getOrganisationListings,
} = require("./controllers/listingController.js");

// Cheryl's Routes
app.post("/auth/login", authAccount);
app.post("/auth/signup/volunteer", createVolunteer);
app.post("/auth/signup/organisation", createOrganisation);
app.post("/auth/signup/google-volunteer", googleSignupVolunteerController);
app.post("/auth/signup/google-organisation", googleSignupOrganisationController);
app.post("/auth/check-google-account", checkGoogleAccount);
app.get("/auth/listings", verifyToken, getOrganisationListings);

// Serve static files with the /public prefix
app.use("/public", express.static("public"));
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
    // Verify ID token
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    // Save tokens in a cookie
    res.cookie("authToken", tokens.id_token, { httpOnly: false });
    // Log the cookies to ensure they are being set correctly
    console.log("Cookies set:", req.cookies);
    // Redirect to googleLogin.html with email as URL parameter
    res.redirect(`/public/html/googleLogin.html?email=${email}`);
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
      window.location.href = '/public/html/index.html';
    </script>
  `);
});

// Serve the main index.html file
app.get("/", (req, res) => {
  res.sendFile("public/html/index.html", { root: "." });
});



const dbConfig = require("./dbConfig");
const volunteerController = require("./controllers/volunteerController");
const organisationController = require("./controllers/organisationController");
const postController = require("./controllers/postController");
const listingController = require("./controllers/listingController");
const likesController = require("./controllers/likesController");
const searchPageController = require("./controllers/userSearchPageController");
const userFeedPageController = require("./controllers/userFeedPageController");
const userProfileController = require("./controllers/userProfileController");
const followController = require("./controllers/followController");

const sql = require("mssql");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "null"); // Replace with your client origin
  res.setHeader("Access-Control-Allow-Methods", "GET"); // Add other methods if needed
  res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Add other allowed headers
  next();
});
// Cheryl's Parts
app.put("/volunteers/:id/password", volunteerController.updateVolunteerHash);
app.put("/organisations/:id/password", organisationController.updateOrganisationHash);


app.get("/volunteers", volunteerController.getAllVolunteers); //get all user
app.get("/volunteers/:id", volunteerController.getVolunteerById); // Get user by ID
app.get("/volunteers/:username", volunteerController.getVolunteerByUsername);
app.put("/volunteers/:id", volunteerController.updateVolunteerProfile);
app.delete("/volunteers/:id", volunteerController.deleteVolunteer);

app.get("/organisations", organisationController.getAllOrganisations); //get all organisation
app.get("/organisations/:id", organisationController.getOrgById);
app.put("/organisations/:id", organisationController.updateOrgProfile);

app.get("/organisations/:OrgName", organisationController.getOrgByName);
//app.put("/organisations/:OrgName", organisationController.updateOrgProfile);

app.get("/listing", listingController.getAllListings);
app.get("/listing/byOrgId/:orgID", listingController.getListingsByOrgId);
app.get("/listing/byListingID/:id", listingController.getListingsByListingId);

// Caden's Parts
app.get("/searchPage/allFollower/:id", searchPageController.getFollowersByID);
app.get(
  "/searchPage/allFollower",
  searchPageController.getAllFollowerRelations
);
app.post("/searchPage/postFollow", followController.postFollow);
app.delete("/searchPage/deleteFollow", followController.deleteFollow);
app.get("/searchPage", searchPageController.getAllAccounts);
app.get("/searchPage/:username", searchPageController.getAccountByUsername);

// Likes' end points
app.get("/likes/:id", likesController.getAllLikesById);
app.post("/likes", likesController.postLikeById);
app.delete("/likes", likesController.deleteLikesById);

app.post("/userFeedPage", userFeedPageController.postComment);

// app.get("/userProfile/:id", postController.getAllPostsByAccID)
// app.get("/userProfile/:id", volunteerController.getAllFollowersAndFollowing)
app.get("/volunteerProfile/:id", userProfileController.getAccountInfo);
app.get("/organisationProfile/:id", userProfileController.getOrganisationInfo);

app.post("/postCreation", postController.postPost);

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

  process.on("SIGINT", async () => {
    console.log("Server is gracefully shutting down");
    // Perform cleanup tasks (e.g., close database connections)
    await sql.close();
    console.log("Database connection closed");
    process.exit(0); // Exit with code 0 indicating successful shutdown
  });
});
