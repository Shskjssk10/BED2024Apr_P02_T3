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

    // Save tokens in a session or cookie (not implemented here for simplicity)
    res.cookie("authToken", tokens.id_token, { httpOnly: true });

    // Redirect to the desired page after login
    res.redirect("http://localhost:5500/public/html/index.html");
  } catch (error) {
    console.error("Error during OAuth2 callback", error);
    res.status(500).send("Authentication failed");
  }
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
