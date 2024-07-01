require("dotenv").config();
const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const path = require("path");

const app = express();
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Serve static files
app.use("/public", express.static(path.join(__dirname, "public")));

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
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Save tokens in a session or cookie (not implemented here for simplicity)
  // Redirect to the desired page after login
  res.redirect("/public/html/index.html");
});

// Start the server
app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
