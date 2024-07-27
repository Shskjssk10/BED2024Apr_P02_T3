// Cheryl's part (authentication)
const jwt = require("jsonwebtoken");
// middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  console.log("Received token:", token);

  if (!token) {
    console.log("No token provided");
    return res.status(403).json({ message: "No token provided" });
  }
  // verify token using secret key in env
  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      return res.status(500).json({ message: "Failed to authenticate token" });
    }
    req.accountId = decoded.id;
    console.log("Token verified successfully:", decoded);
    next();
  });
};

module.exports = { verifyToken };
// end of Cheryl's part