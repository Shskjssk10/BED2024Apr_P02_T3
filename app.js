require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const { OAuth2Client } = require("google-auth-library");

const app = express();
const port = process.env.PORT || 8080;

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
const authRoutes = require("./public/routes/authRoutes");
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

// Database connection
const { poolPromise } = require("./dbConfig");
poolPromise
  .then((pool) => {
    console.log("Database connected successfully.");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
